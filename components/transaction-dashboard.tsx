"use client"

import { useState, useEffect } from "react"
import { getTransactionsWithPagination, analyzeTransactionPatterns } from "@/lib/actions/transaction-actions"
import { TransactionList } from "./transaction-list"
import { PatternAnalysis } from "./pattern-analysis"
import type { Transaction, PatternAnalysisResult } from "@/lib/types"

interface SearchFilters {
  search: string
  searchIn: string // NEW: "all", "from", "to"
  riskLevel: string
  status: string
  amountMin: string
  amountMax: string
}

const defaultFilters: SearchFilters = {
  search: "",
  searchIn: "all", // NEW: default value
  riskLevel: "all",
  status: "all",
  amountMin: "",
  amountMax: "",
}

export function TransactionDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [patterns, setPatterns] = useState<PatternAnalysisResult | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [loading, setLoading] = useState(true)
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(defaultFilters)

  const loadTransactions = async (page = 1, limit = 25, filters: SearchFilters = defaultFilters) => {
    setLoading(true)
    try {
      const result = await getTransactionsWithPagination(page, limit, filters)
      setTransactions(result.transactions)
      setTotalCount(result.totalCount)
      setCurrentPage(page)
      setItemsPerPage(limit)
      setCurrentFilters(filters)
    } catch (error) {
      console.error("Error loading transactions:", error)
      setTransactions([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const loadPatterns = async () => {
    try {
      const patternsResult = await analyzeTransactionPatterns()
      setPatterns(patternsResult)
    } catch (error) {
      console.error("Error loading patterns:", error)
    }
  }

  // Load initial data
  useEffect(() => {
    loadTransactions(1, 25, defaultFilters)
    loadPatterns()
  }, [])

  const handleSearch = (filters: SearchFilters) => {
    loadTransactions(1, itemsPerPage, filters)
  }

  const handlePageChange = (page: number, newItemsPerPage: number) => {
    loadTransactions(page, newItemsPerPage, currentFilters)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction Monitoring</h2>

        {loading ? (
          <div className="space-y-4">
            {/* Loading Search Bar */}
            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>

            {/* Loading Table */}
            <div className="bg-white border rounded-lg p-4">
              <div className="animate-pulse space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="grid grid-cols-7 gap-4">
                      {[...Array(7)].map((_, j) => (
                        <div key={j} className="h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <TransactionList
            transactions={transactions}
            totalCount={totalCount}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {patterns && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pattern Analysis</h2>
          <PatternAnalysis patterns={patterns} />
        </div>
      )}
    </div>
  )
}
