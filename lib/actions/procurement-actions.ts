"use server"

import { prisma } from "@/lib/prisma"
import type { ProcurementContract, ProcurementAnalysisResult, ActionResponse } from "@/lib/types"
import { revalidatePath } from "next/cache"

interface SearchFilters {
  search: string
  searchIn: string
  markupLevel: string
  status: string
  priceMin: string
  priceMax: string
  agency: string
}

interface PaginatedContracts {
  contracts: ProcurementContract[]
  totalCount: number
  currentPage: number
  totalPages: number
}

export async function getProcurementContractsWithPagination(
  page = 1,
  limit = 25,
  filters: SearchFilters = {
    search: "",
    searchIn: "all",
    markupLevel: "all",
    status: "all",
    priceMin: "",
    priceMax: "",
    agency: "all",
  },
): Promise<PaginatedContracts> {
  try {
    const skip = (page - 1) * limit

    // Build where clause based on filters
    const where: any = {}

    // Search filter with searchIn logic
    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.trim()

      if (filters.searchIn === "contract") {
        where.contractNumber = { contains: searchTerm, mode: "insensitive" }
      } else if (filters.searchIn === "item") {
        where.itemName = { contains: searchTerm, mode: "insensitive" }
      } else if (filters.searchIn === "vendor") {
        where.vendor = { name: { contains: searchTerm, mode: "insensitive" } }
      } else {
        // Search in all
        where.OR = [
          { contractNumber: { contains: searchTerm, mode: "insensitive" } },
          { itemName: { contains: searchTerm, mode: "insensitive" } },
          { vendor: { name: { contains: searchTerm, mode: "insensitive" } } },
        ]
      }
    }

    // Markup level filter
    if (filters.markupLevel && filters.markupLevel !== "all") {
      switch (filters.markupLevel) {
        case "normal":
          where.OR = [{ markupPercentage: { lt: 15 } }, { markupPercentage: null }]
          break
        case "medium":
          where.markupPercentage = { gte: 15, lt: 30 }
          break
        case "high":
          where.markupPercentage = { gte: 30, lt: 50 }
          break
        case "critical":
          where.markupPercentage = { gte: 50 }
          break
      }
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      switch (filters.status) {
        case "normal":
          where.isMarkedUp = false
          break
        case "flagged":
          where.isMarkedUp = true
          break
        case "verified":
          where.oracleVerified = true
          break
      }
    }

    // Agency filter
    if (filters.agency && filters.agency !== "all") {
      where.procuringAgency = filters.agency
    }

    // Price range filter
    if (filters.priceMin || filters.priceMax) {
      where.bidPrice = {}
      if (filters.priceMin && filters.priceMin.trim() !== "") {
        const minPrice = Number.parseFloat(filters.priceMin.trim())
        if (!Number.isNaN(minPrice)) {
          where.bidPrice.gte = minPrice
        }
      }
      if (filters.priceMax && filters.priceMax.trim() !== "") {
        const maxPrice = Number.parseFloat(filters.priceMax.trim())
        if (!Number.isNaN(maxPrice)) {
          where.bidPrice.lte = maxPrice
        }
      }
    }

    console.log("Procurement query where clause:", JSON.stringify(where, null, 2))

    // Get total count for pagination
    const totalCount = await prisma.procurementContract.count({ where })

    // Get contracts with pagination
    const contracts = await prisma.procurementContract.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        vendor: true,
      },
    })

    console.log(`Found ${contracts.length} contracts out of ${totalCount} total`)

    const totalPages = Math.ceil(totalCount / limit)

    return {
      contracts: contracts.map((contract) => ({
        id: contract.id,
        contractNumber: contract.contractNumber,
        itemName: contract.itemName,
        specification: contract.specification,
        estimatedPrice: contract.estimatedPrice,
        bidPrice: contract.bidPrice,
        vendorId: contract.vendorId,
        vendorName: contract.vendor.name,
        procuringAgency: contract.procuringAgency,
        contractDate: contract.contractDate,
        isMarkedUp: contract.isMarkedUp,
        markupPercentage: contract.markupPercentage,
        blockchainHash: contract.blockchainHash,
        oracleVerified: contract.oracleVerified,
        createdAt: contract.createdAt,
        updatedAt: contract.updatedAt,
      })),
      totalCount,
      currentPage: page,
      totalPages,
    }
  } catch (error) {
    console.error("Error fetching procurement contracts:", error)
    return {
      contracts: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
    }
  }
}

export async function analyzeProcurementPatterns(): Promise<ProcurementAnalysisResult> {
  try {
    const [totalContracts, markupStats, verificationStats, vendorStats] = await Promise.all([
      prisma.procurementContract.count(),
      prisma.procurementContract.aggregate({
        _avg: { markupPercentage: true },
        _count: { markupPercentage: true },
      }),
      prisma.procurementContract.count({ where: { oracleVerified: true } }),
      prisma.vendor.count({ where: { riskRating: "HIGH" } }),
    ])

    const highMarkupContracts = await prisma.procurementContract.count({
      where: { markupPercentage: { gte: 30 } },
    })

    const anomalousContracts = await prisma.procurementContract.count({
      where: {
        OR: [{ markupPercentage: { gte: 50 } }, { isMarkedUp: true }],
      },
    })

    const suspiciousVendorCount = await prisma.vendor.count({
      where: { riskRating: { in: ["HIGH", "CRITICAL"] } },
    })

    return {
      averageMarkup: Math.round(markupStats._avg.markupPercentage || 0),
      highMarkupContracts,
      oracleVerificationRate: totalContracts > 0 ? Math.round((verificationStats / totalContracts) * 100) : 0,
      verifiedContracts: verificationStats,
      highRiskVendors: totalContracts > 0 ? Math.round((vendorStats / totalContracts) * 100) : 0,
      suspiciousVendorCount,
      contractAnomalyScore: totalContracts > 0 ? Math.round((anomalousContracts / totalContracts) * 100) : 0,
      anomalousContracts,
      analysisTimestamp: new Date(),
    }
  } catch (error) {
    console.error("Error analyzing procurement patterns:", error)
    return {
      averageMarkup: 0,
      highMarkupContracts: 0,
      oracleVerificationRate: 0,
      verifiedContracts: 0,
      highRiskVendors: 0,
      suspiciousVendorCount: 0,
      contractAnomalyScore: 0,
      anomalousContracts: 0,
      analysisTimestamp: new Date(),
    }
  }
}

export async function flagSuspiciousContract(contractId: string): Promise<ActionResponse> {
  try {
    const contract = await prisma.procurementContract.findUnique({
      where: { id: contractId },
    })

    if (!contract) {
      return { success: false, error: "Contract not found" }
    }

    // Update contract as marked up
    await prisma.procurementContract.update({
      where: { id: contractId },
      data: {
        isMarkedUp: true,
        markupPercentage: contract.markupPercentage || 100, // Set high markup if not calculated
      },
    })

    revalidatePath("/bpk")
    return { success: true, message: "Contract flagged successfully" }
  } catch (error) {
    console.error("Error flagging contract:", error)
    return { success: false, error: "Failed to flag contract" }
  }
}
