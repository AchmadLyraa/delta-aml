"use client"

import { useState, useEffect } from "react"
import { getProcurementContractsWithPagination, analyzeProcurementPatterns } from "@/lib/actions/procurement-actions"
import { ProcurementList } from "@/components/procurement-list"
import { ProcurementAnalysis } from "@/components/procurement-analysis"
import type { ProcurementContract, ProcurementAnalysisResult } from "@/lib/types"

interface SearchFilters {
  search: string
  searchIn: string
  markupLevel: string
  status: string
  priceMin: string
  priceMax: string
  agency: string
}

const defaultFilters: SearchFilters = {
  search: "",
  searchIn: "all",
  markupLevel: "all",
  status: "all",
  priceMin: "",
  priceMax: "",
  agency: "all",
}

export function ProcurementDashboard() {
  const [contracts, setContracts] = useState<ProcurementContract[]>([])
  const [analysis, setAnalysis] = useState<ProcurementAnalysisResult | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [loading, setLoading] = useState(true)
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(defaultFilters)
  const [error, setError] = useState<string | null>(null)

  const loadContracts = async (page = 1, limit = 25, filters: SearchFilters = defaultFilters) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getProcurementContractsWithPagination(page, limit, filters)
      setContracts(result.contracts)
      setTotalCount(result.totalCount)
      setCurrentPage(page)
      setItemsPerPage(limit)
      setCurrentFilters(filters)
    } catch (error) {
      console.error("Error loading contracts:", error)
      setError("Failed to load contracts")
      setContracts([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const loadAnalysis = async () => {
    try {
      const analysisResult = await analyzeProcurementPatterns()
      setAnalysis(analysisResult)
    } catch (error) {
      console.error("Error loading analysis:", error)
    }
  }

  // Load initial data
  useEffect(() => {
    loadContracts(1, 25, defaultFilters)
    loadAnalysis()
  }, [])

  const handleSearch = (filters: SearchFilters) => {
    loadContracts(1, itemsPerPage, filters)
  }

  const handlePageChange = (page: number, newItemsPerPage: number) => {
    loadContracts(page, newItemsPerPage, currentFilters)
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
          <p>{error}</p>
          <button
            onClick={() => loadContracts(1, 25, defaultFilters)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Procurement Contract Monitoring</h2>

        <ProcurementList
          contracts={contracts}
          totalCount={totalCount}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          loading={loading}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
        />
      </div>

      {analysis && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Procurement Analysis</h2>
          <ProcurementAnalysis analysis={analysis} />
        </div>
      )}
    </div>
  )
}
