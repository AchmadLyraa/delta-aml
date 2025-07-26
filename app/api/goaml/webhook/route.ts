import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateRiskScore } from "@/lib/ml/risk-calculator"
import { recordTransactionOnBlockchain } from "@/lib/actions/blockchain-actions"

// GOAML Transaction Interface
interface GOAMLTransaction {
  transactionId: string
  reportId: string
  reportType: "STR" | "CTR" | "CBR" | "THR" // Suspicious, Currency, Cross-border, Threshold
  amount: number
  currency: string
  transactionDate: string
  fromAccount: {
    accountNumber: string
    accountType: string
    ownerName: string
    ownerType: "INDIVIDUAL" | "CORPORATION" | "GOVERNMENT"
    identificationNumber: string
    address?: string
  }
  toAccount: {
    accountNumber: string
    accountType: string
    ownerName: string
    ownerType: "INDIVIDUAL" | "CORPORATION" | "GOVERNMENT"
    identificationNumber: string
    address?: string
  }
  transactionType: string
  description?: string
  reportingInstitution: {
    name: string
    code: string
    type: string
  }
  geolocation?: string
  additionalInfo?: Record<string, any>
}

interface GOAMLWebhookPayload {
  eventType: "TRANSACTION_REPORT" | "BULK_IMPORT" | "ALERT_UPDATE"
  timestamp: string
  source: "GOAML"
  data: GOAMLTransaction | GOAMLTransaction[]
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 GOAML Webhook received")

    // Verify webhook signature (in production)
    const signature = request.headers.get("x-goaml-signature")
    // TODO: Verify signature with GOAML secret key

    const payload: GOAMLWebhookPayload = await request.json()
    console.log("📦 Payload:", JSON.stringify(payload, null, 2))

    // Handle different event types
    switch (payload.eventType) {
      case "TRANSACTION_REPORT":
        if (Array.isArray(payload.data)) {
          // Bulk transactions
          const results = await processBulkTransactions(payload.data)
          return NextResponse.json({
            success: true,
            message: `Processed ${results.success} transactions, ${results.failed} failed`,
            processed: results.success,
            failed: results.failed,
          })
        } else {
          // Single transaction
          const result = await processSingleTransaction(payload.data)
          return NextResponse.json(result)
        }

      case "BULK_IMPORT":
        if (Array.isArray(payload.data)) {
          const results = await processBulkTransactions(payload.data)
          return NextResponse.json({
            success: true,
            message: `Bulk import completed: ${results.success} success, ${results.failed} failed`,
            processed: results.success,
            failed: results.failed,
          })
        }
        break

      case "ALERT_UPDATE":
        // Handle alert updates from GOAML
        return NextResponse.json({ success: true, message: "Alert update received" })

      default:
        return NextResponse.json({ success: false, error: "Unknown event type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ GOAML Webhook error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

async function processSingleTransaction(goamlData: GOAMLTransaction) {
  try {
    console.log(`🔄 Processing transaction: ${goamlData.transactionId}`)

    // 1. Create or find entities (account owners)
    const fromEntity = await createOrFindEntity(goamlData.fromAccount)
    const toEntity = await createOrFindEntity(goamlData.toAccount)

    // 2. Create or find accounts
    const fromAccount = await createOrFindAccount(goamlData.fromAccount, fromEntity.id)
    const toAccount = await createOrFindAccount(goamlData.toAccount, toEntity.id)

    // 3. Calculate enhanced risk score using our ML
    const enhancedRiskScore = await calculateRiskScore({
      amount: goamlData.amount,
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
      transactionType: goamlData.transactionType,
      timestamp: new Date(goamlData.transactionDate),
    })

    // 4. Determine if suspicious (GOAML STR = already suspicious, but we enhance it)
    const isSuspicious = goamlData.reportType === "STR" || enhancedRiskScore >= 80

    // 5. Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        id: goamlData.transactionId, // Use GOAML transaction ID
        amount: goamlData.amount,
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        timestamp: new Date(goamlData.transactionDate),
        transactionType: goamlData.transactionType as any,
        currency: goamlData.currency,
        riskScore: enhancedRiskScore,
        isSuspicious,
        description: goamlData.description,
        geolocation: goamlData.geolocation,
      },
    })

    // 6. Create AML Alert if suspicious
    if (isSuspicious) {
      await prisma.aMLAlert.create({
        data: {
          transactionId: transaction.id,
          alertType: getAlertType(goamlData.reportType),
          severity: getSeverity(enhancedRiskScore),
          description: `GOAML ${goamlData.reportType} Report - Enhanced Risk Score: ${enhancedRiskScore}%`,
          riskScore: enhancedRiskScore,
          isResolved: false,
        },
      })
    }

    // 7. Record on blockchain (async)
    recordTransactionOnBlockchain(transaction.id, goamlData.amount, fromAccount.id, toAccount.id).catch(console.error)

    console.log(`✅ Transaction processed: ${goamlData.transactionId} (Risk: ${enhancedRiskScore}%)`)

    return {
      success: true,
      transactionId: goamlData.transactionId,
      enhancedRiskScore,
      isSuspicious,
      message: "Transaction processed successfully",
    }
  } catch (error) {
    console.error(`❌ Error processing transaction ${goamlData.transactionId}:`, error)
    return {
      success: false,
      transactionId: goamlData.transactionId,
      error: (error as Error).message,
    }
  }
}

async function processBulkTransactions(transactions: GOAMLTransaction[]) {
  console.log(`🚀 Processing ${transactions.length} transactions in bulk`)

  let success = 0
  let failed = 0

  // Process in batches to avoid overwhelming the database
  const batchSize = 100
  for (let i = 0; i < transactions.length; i += batchSize) {
    const batch = transactions.slice(i, i + batchSize)
    console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(transactions.length / batchSize)}`)

    const batchPromises = batch.map(async (transaction) => {
      try {
        await processSingleTransaction(transaction)
        return { success: true }
      } catch (error) {
        console.error(`❌ Batch error for ${transaction.transactionId}:`, error)
        return { success: false }
      }
    })

    const batchResults = await Promise.all(batchPromises)
    success += batchResults.filter((r) => r.success).length
    failed += batchResults.filter((r) => !r.success).length

    // Small delay between batches
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  console.log(`✅ Bulk processing completed: ${success} success, ${failed} failed`)
  return { success, failed }
}

async function createOrFindEntity(accountData: GOAMLTransaction["fromAccount"]) {
  const existing = await prisma.entity.findUnique({
    where: { identificationNumber: accountData.identificationNumber },
  })

  if (existing) return existing

  return await prisma.entity.create({
    data: {
      name: accountData.ownerName,
      entityType: accountData.ownerType,
      identificationNumber: accountData.identificationNumber,
      address: accountData.address,
      riskProfile: "MEDIUM", // Default, will be updated by ML
    },
  })
}

async function createOrFindAccount(accountData: GOAMLTransaction["fromAccount"], ownerId: string) {
  const existing = await prisma.account.findUnique({
    where: { accountNumber: accountData.accountNumber },
  })

  if (existing) return existing

  return await prisma.account.create({
    data: {
      accountNumber: accountData.accountNumber,
      accountType: accountData.accountType as any,
      ownerId,
      riskLevel: "MEDIUM", // Default, will be updated by ML
    },
  })
}

function getAlertType(reportType: string) {
  switch (reportType) {
    case "STR":
      return "UNUSUAL_PATTERN"
    case "CTR":
      return "THRESHOLD_BREACH"
    case "CBR":
      return "HIGH_RISK_JURISDICTION"
    case "THR":
      return "THRESHOLD_BREACH"
    default:
      return "UNUSUAL_PATTERN"
  }
}

function getSeverity(riskScore: number) {
  if (riskScore >= 90) return "CRITICAL"
  if (riskScore >= 80) return "HIGH"
  if (riskScore >= 60) return "MEDIUM"
  return "LOW"
}
