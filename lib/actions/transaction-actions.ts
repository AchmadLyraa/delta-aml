"use server"

import { prisma } from "@/lib/prisma"
import type { Transaction, PatternAnalysisResult, ActionResponse } from "@/lib/types"
import { detectPatterns } from "@/lib/ml/pattern-detector"
import { revalidatePath } from "next/cache"

interface SearchFilters {
  search: string
  searchIn: string // NEW: "all", "from", "to"
  riskLevel: string
  status: string
  amountMin: string
  amountMax: string
}

interface PaginatedTransactions {
  transactions: Transaction[]
  totalCount: number
  currentPage: number
  totalPages: number
}

export async function getTransactionsWithPagination(
  page = 1,
  limit = 25,
  filters: SearchFilters = {
    search: "",
    searchIn: "all",
    riskLevel: "all",
    status: "all",
    amountMin: "",
    amountMax: "",
  },
): Promise<PaginatedTransactions> {
  try {
    const skip = (page - 1) * limit

    // Build where clause based on filters
    const where: any = {}

    // NEW: Search filter with searchIn logic
    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.trim()

      if (filters.searchIn === "from") {
        // Search only in fromAccount
        where.fromAccount = { accountNumber: { contains: searchTerm, mode: "insensitive" } }
      } else if (filters.searchIn === "to") {
        // Search only in toAccount
        where.toAccount = { accountNumber: { contains: searchTerm, mode: "insensitive" } }
      } else {
        // Search in all (default behavior)
        where.OR = [
          { id: { contains: searchTerm, mode: "insensitive" } },
          { fromAccount: { accountNumber: { contains: searchTerm, mode: "insensitive" } } },
          { toAccount: { accountNumber: { contains: searchTerm, mode: "insensitive" } } },
        ]
      }
    }

    // Risk level filter
    if (filters.riskLevel && filters.riskLevel !== "all") {
      switch (filters.riskLevel) {
        case "low":
          where.riskScore = { lt: 60 }
          break
        case "medium":
          where.riskScore = { gte: 60, lt: 80 }
          break
        case "high":
          where.riskScore = { gte: 80 }
          break
      }
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      where.isSuspicious = filters.status === "suspicious"
    }

    // Amount range filter
    if (filters.amountMin || filters.amountMax) {
      where.amount = {}
      if (filters.amountMin && filters.amountMin.trim() !== "") {
        const minAmount = Number.parseFloat(filters.amountMin.trim())
        if (!Number.isNaN(minAmount)) {
          where.amount.gte = minAmount
        }
      }
      if (filters.amountMax && filters.amountMax.trim() !== "") {
        const maxAmount = Number.parseFloat(filters.amountMax.trim())
        if (!Number.isNaN(maxAmount)) {
          where.amount.lte = maxAmount
        }
      }
    }

    console.log("Query where clause:", JSON.stringify(where, null, 2))
    console.log("Search filters:", filters)

    // Get total count for pagination
    const totalCount = await prisma.transaction.count({ where })

    // Get transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        fromAccount: true,
        toAccount: true,
      },
    })

    console.log(`Found ${transactions.length} transactions out of ${totalCount} total`)

    const totalPages = Math.ceil(totalCount / limit)

    return {
      transactions: transactions.map((tx) => ({
        id: tx.id,
        amount: tx.amount,
        fromAccount: tx.fromAccount.accountNumber,
        toAccount: tx.toAccount.accountNumber,
        timestamp: tx.timestamp,
        transactionType: tx.transactionType as any,
        currency: tx.currency,
        riskScore: tx.riskScore,
        isSuspicious: tx.isSuspicious,
        blockchainHash: tx.blockchainHash,
        geolocation: tx.geolocation,
        description: tx.description,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
      })),
      totalCount,
      currentPage: page,
      totalPages,
    }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return {
      transactions: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
    }
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const result = await getTransactionsWithPagination(1, 50)
    return result.transactions
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}

export async function analyzeTransactionPatterns(): Promise<PatternAnalysisResult> {
  try {
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      include: {
        fromAccount: true,
        toAccount: true,
      },
    })

    const patterns = await detectPatterns(recentTransactions)
    return patterns
  } catch (error) {
    console.error("Error analyzing patterns:", error)
    return {
      smurfingConfidence: 0,
      smurfingPatterns: 0,
      layeringComplexity: 0,
      layeringChains: 0,
      networkHubScore: 0,
      suspiciousNodes: 0,
      anomalyScore: 0,
      anomalousTransactions: 0,
      analysisTimestamp: new Date(),
    }
  }
}

export async function flagSuspiciousTransaction(transactionId: string): Promise<ActionResponse> {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) {
      return { success: false, error: "Transaction not found" }
    }

    // Update transaction as suspicious
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        isSuspicious: true,
        riskScore: Math.max(transaction.riskScore, 85), // Ensure high risk score
      },
    })

    // Create AML Alert
    await prisma.aMLAlert.create({
      data: {
        transactionId,
        alertType: "UNUSUAL_PATTERN",
        severity: "HIGH",
        description: `Transaction flagged manually for suspicious activity`,
        riskScore: Math.max(transaction.riskScore, 85),
        isResolved: false,
      },
    })

    revalidatePath("/")
    return { success: true, message: "Transaction flagged successfully" }
  } catch (error) {
    console.error("Error flagging transaction:", error)
    return { success: false, error: "Failed to flag transaction" }
  }
}
