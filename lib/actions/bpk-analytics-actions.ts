"use server"

import { prisma } from "@/lib/prisma"
import type { BPKStatistics, SuspiciousVendor, PriceOracleStatus } from "@/lib/types"

export async function getBPKStatistics(): Promise<BPKStatistics> {
  try {
    const [totalContracts, suspiciousContracts, markupStats, verificationRate] = await Promise.all([
      prisma.procurementContract.count(),
      prisma.procurementContract.count({ where: { isMarkedUp: true } }),
      prisma.procurementContract.aggregate({
        _avg: { markupPercentage: true },
      }),
      prisma.procurementContract.count({ where: { oracleVerified: true } }),
    ])

    const normalContracts = totalContracts - suspiciousContracts

    // Simulate recent alerts (in production, this would come from actual alert system)
    const recentAlerts = [
      {
        type: "HIGH_MARKUP",
        description: "Contract PROC003 has 65% markup above market price",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        severity: "HIGH" as const,
      },
      {
        type: "VENDOR_RISK",
        description: "PT Overpriced Goods flagged for multiple high markups",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        severity: "MEDIUM" as const,
      },
      {
        type: "ORACLE_MISMATCH",
        description: "Price verification failed for office equipment category",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        severity: "LOW" as const,
      },
    ]

    return {
      totalContracts,
      suspiciousContracts,
      normalContracts,
      averageMarkup: Math.round(markupStats._avg.markupPercentage || 0),
      oracleVerificationRate: totalContracts > 0 ? Math.round((verificationRate / totalContracts) * 100) : 0,
      recentAlerts,
    }
  } catch (error) {
    console.error("Error fetching BPK statistics:", error)
    return {
      totalContracts: 0,
      suspiciousContracts: 0,
      normalContracts: 0,
      averageMarkup: 0,
      oracleVerificationRate: 0,
      recentAlerts: [],
    }
  }
}

export async function getTopSuspiciousVendors(): Promise<SuspiciousVendor[]> {
  try {
    const suspiciousVendors = await prisma.procurementContract.groupBy({
      by: ["vendorId"],
      where: {
        isMarkedUp: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        markupPercentage: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    })

    const vendorsWithDetails = await Promise.all(
      suspiciousVendors.map(async (vendor) => {
        const vendorDetails = await prisma.vendor.findUnique({
          where: { id: vendor.vendorId },
        })

        return {
          vendorName: vendorDetails?.name || "Unknown",
          suspiciousContracts: vendor._count.id,
          averageMarkup: Math.round(vendor._avg.markupPercentage || 0),
        }
      }),
    )

    return vendorsWithDetails
  } catch (error) {
    console.error("Error fetching suspicious vendors:", error)
    return []
  }
}

export async function getPriceOracleStatus(): Promise<PriceOracleStatus> {
  try {
    // Simulate oracle status checks (in production, this would ping actual APIs)
    const isHealthy = true
    const lkppStatus = "active"
    const tokopediaStatus = "active"
    const marketDataStatus = "active"

    return {
      isHealthy,
      lkppStatus,
      tokopediaStatus,
      marketDataStatus,
      lastUpdate: new Date(),
    }
  } catch (error) {
    console.error("Error fetching oracle status:", error)
    return {
      isHealthy: false,
      lkppStatus: "error",
      tokopediaStatus: "error",
      marketDataStatus: "error",
      lastUpdate: new Date(),
    }
  }
}
