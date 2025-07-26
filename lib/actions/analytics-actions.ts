"use server"

import { prisma } from "@/lib/prisma"
import type { AMLStatistics } from "@/lib/types"

interface SuspiciousAccount {
  accountNumber: string
  suspiciousCount: number
  riskScore: number
}

interface SystemStatus {
  isHealthy: boolean
  mlEngineStatus: string
  blockchainStatus: string
  databaseStatus: string
  lastUpdate: Date
}

export async function getAMLStatistics(): Promise<AMLStatistics> {
  try {
    const [totalTransactions, suspiciousTransactions, recentAlerts, avgRiskScore] = await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.count({ where: { isSuspicious: true } }),
      prisma.aMLAlert.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.transaction.aggregate({
        _avg: { riskScore: true },
      }),
    ])

    const normalTransactions = totalTransactions - suspiciousTransactions
    const falsePositiveRate =
      suspiciousTransactions > 0
        ? Math.round(((suspiciousTransactions * 0.15) / suspiciousTransactions) * 100) // Simulated 15% false positive
        : 0

    return {
      totalTransactions,
      suspiciousTransactions,
      normalTransactions,
      falsePositiveRate,
      averageRiskScore: Math.round(avgRiskScore._avg.riskScore || 0),
      recentAlerts: recentAlerts.map((alert) => ({
        type: alert.alertType,
        description: alert.description,
        timestamp: alert.createdAt,
        severity: alert.severity as any,
      })),
    }
  } catch (error) {
    console.error("Error fetching AML statistics:", error)
    return {
      totalTransactions: 0,
      suspiciousTransactions: 0,
      normalTransactions: 0,
      falsePositiveRate: 0,
      averageRiskScore: 0,
      recentAlerts: [],
    }
  }
}

export async function getTopSuspiciousAccounts(): Promise<SuspiciousAccount[]> {
  try {
    const suspiciousAccounts = await prisma.transaction.groupBy({
      by: ["fromAccountId"],
      where: {
        isSuspicious: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        riskScore: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    })

    const accountsWithDetails = await Promise.all(
      suspiciousAccounts.map(async (account) => {
        const accountDetails = await prisma.account.findUnique({
          where: { id: account.fromAccountId },
        })

        return {
          accountNumber: accountDetails?.accountNumber || "Unknown",
          suspiciousCount: account._count.id,
          riskScore: Math.round(account._avg.riskScore || 0),
        }
      }),
    )

    return accountsWithDetails
  } catch (error) {
    console.error("Error fetching suspicious accounts:", error)
    return []
  }
}

export async function getSystemStatus(): Promise<SystemStatus> {
  try {
    // Simulate system health checks
    const isHealthy = true
    const mlEngineStatus = "active"
    const blockchainStatus = "connected"
    const databaseStatus = "healthy"

    return {
      isHealthy,
      mlEngineStatus,
      blockchainStatus,
      databaseStatus,
      lastUpdate: new Date(),
    }
  } catch (error) {
    console.error("Error fetching system status:", error)
    return {
      isHealthy: false,
      mlEngineStatus: "error",
      blockchainStatus: "disconnected",
      databaseStatus: "error",
      lastUpdate: new Date(),
    }
  }
}
