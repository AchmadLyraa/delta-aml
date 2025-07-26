import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Bulk import endpoint for large datasets
export async function POST(request: NextRequest) {
  try {
    const { transactions, source = "GOAML_BULK" } = await request.json()

    if (!Array.isArray(transactions)) {
      return NextResponse.json({ success: false, error: "Transactions must be an array" }, { status: 400 })
    }

    console.log(`🚀 Bulk import started: ${transactions.length} transactions from ${source}`)

    // Process in chunks to avoid memory issues
    const chunkSize = 500
    let processed = 0
    let failed = 0

    for (let i = 0; i < transactions.length; i += chunkSize) {
      const chunk = transactions.slice(i, i + chunkSize)
      console.log(`📦 Processing chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(transactions.length / chunkSize)}`)

      try {
        // Process chunk with database transaction
        await prisma.$transaction(async (tx) => {
          for (const transaction of chunk) {
            try {
              // Simplified bulk insert (skip ML for performance)
              await tx.transaction.create({
                data: {
                  id: transaction.transactionId || undefined,
                  amount: transaction.amount,
                  fromAccountId: transaction.fromAccountId,
                  toAccountId: transaction.toAccountId,
                  timestamp: new Date(transaction.transactionDate),
                  transactionType: transaction.transactionType,
                  currency: transaction.currency || "USD",
                  riskScore: transaction.riskScore || 50,
                  isSuspicious: transaction.isSuspicious || false,
                  description: transaction.description,
                  geolocation: transaction.geolocation,
                },
              })
              processed++
            } catch (error) {
              console.error(`❌ Failed to insert transaction:`, error)
              failed++
            }
          }
        })
      } catch (error) {
        console.error(`❌ Chunk processing failed:`, error)
        failed += chunk.length
      }

      // Progress update
      if (i % (chunkSize * 10) === 0) {
        console.log(
          `📊 Progress: ${processed + failed}/${transactions.length} (${Math.round(((processed + failed) / transactions.length) * 100)}%)`,
        )
      }
    }

    console.log(`✅ Bulk import completed: ${processed} success, ${failed} failed`)

    return NextResponse.json({
      success: true,
      message: `Bulk import completed`,
      statistics: {
        total: transactions.length,
        processed,
        failed,
        successRate: Math.round((processed / transactions.length) * 100),
      },
    })
  } catch (error) {
    console.error("❌ Bulk import error:", error)
    return NextResponse.json({ success: false, error: "Bulk import failed" }, { status: 500 })
  }
}
