"use client"

import { useState, useTransition } from "react"
import type { Transaction } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { flagSuspiciousTransaction } from "@/lib/actions/transaction-actions"

interface TransactionListProps {
  transactions: Transaction[]
  totalCount: number
  currentPage: number
  itemsPerPage: number
  loading?: boolean
  onSearch: (filters: SearchFilters) => void
  onPageChange: (page: number, itemsPerPage: number) => void
}

interface SearchFilters {
  search: string
  searchIn: string // NEW: "all", "from", "to"
  riskLevel: string
  status: string
  amountMin: string
  amountMax: string
}

export function TransactionList({
  transactions,
  totalCount,
  currentPage,
  itemsPerPage,
  loading = false,
  onSearch,
  onPageChange,
}: TransactionListProps) {
  const [showConfirm, setShowConfirm] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Search states
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    searchIn: "all", // NEW: default to search in all
    riskLevel: "all",
    status: "all",
    amountMin: "",
    amountMax: "",
  })

  const handleFlag = (transactionId: string) => {
    startTransition(async () => {
      await flagSuspiciousTransaction(transactionId)
      setShowConfirm(null)
    })
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      search: "",
      searchIn: "all",
      riskLevel: "all",
      status: "all",
      amountMin: "",
      amountMax: "",
    }
    setFilters(clearedFilters)
    onSearch(clearedFilters)
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 80) return "bg-red-100 text-red-800"
    if (riskScore >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(new Date(date))
  }

  // Pagination calculations
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalCount)

  return (
    <div className="space-y-4">
      {/* Search & Filter Section */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">🔍 Search & Filter</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Search by ID or Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search ID/Account</label>
            <Input
              placeholder="Transaction ID atau Account Number"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          {/* NEW: Search In Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search In</label>
            <Select value={filters.searchIn} onValueChange={(value) => setFilters({ ...filters, searchIn: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih lokasi search" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🔍 Semua (ID, From, To)</SelectItem>
                <SelectItem value="from">📤 From Account saja</SelectItem>
                <SelectItem value="to">📥 To Account saja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
            <Select value={filters.riskLevel} onValueChange={(value) => setFilters({ ...filters, riskLevel: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Risk Level</SelectItem>
                <SelectItem value="low">Rendah (0-59%)</SelectItem>
                <SelectItem value="medium">Sedang (60-79%)</SelectItem>
                <SelectItem value="high">Tinggi (80-100%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="suspicious">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Min */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Minimum</label>
            <Input
              type="number"
              placeholder="0"
              value={filters.amountMin}
              onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })}
            />
          </div>

          {/* Amount Max */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Maximum</label>
            <Input
              type="number"
              placeholder="999999999"
              value={filters.amountMax}
              onChange={(e) => setFilters({ ...filters, amountMax: e.target.value })}
            />
          </div>
        </div>

        {/* Search Buttons */}
        <div className="flex space-x-2">
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
            🔍 Search
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            🗑️ Clear Filters
          </Button>
        </div>

        {/* Search Info */}
        {filters.search && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Searching for:</strong> "{filters.search}" in{" "}
              <strong>
                {filters.searchIn === "all"
                  ? "semua field (ID, From, To)"
                  : filters.searchIn === "from"
                    ? "From Account saja"
                    : "To Account saja"}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Menampilkan {startItem}-{endItem} dari {totalCount} transaksi
        </div>

        {/* Items Per Page */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => onPageChange(1, Number.parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal & Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From/To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                // Loading skeleton
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-6 py-4 whitespace-nowrap">
                        <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {totalCount === 0 ? "Tidak ada transaksi yang ditemukan" : "Loading..."}
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="font-medium">{formatDateTime(transaction.timestamp).split(" ")[0]}</div>
                        <div className="text-xs text-gray-500">
                          {formatDateTime(transaction.timestamp).split(" ")[1]} WIB
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-semibold">Rp {transaction.amount.toLocaleString("id-ID")}</div>
                      <div className="text-xs text-gray-500">{transaction.transactionType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div>
                          <span className="text-red-600">From:</span> {transaction.fromAccount}
                        </div>
                        <div>
                          <span className="text-green-600">To:</span> {transaction.toAccount}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRiskColor(transaction.riskScore)}>{transaction.riskScore}%</Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {transaction.riskScore >= 80 ? "Tinggi" : transaction.riskScore >= 60 ? "Sedang" : "Rendah"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={transaction.isSuspicious ? "destructive" : "secondary"}>
                        {transaction.isSuspicious ? "🚩 Flagged" : "✅ Normal"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!transaction.isSuspicious && (
                        <div className="space-y-2">
                          {showConfirm === transaction.id ? (
                            <div className="space-y-2">
                              <div className="text-xs text-red-600 font-medium">Yakin ingin flag transaksi ini?</div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleFlag(transaction.id)}
                                  disabled={isPending}
                                >
                                  {isPending ? "Flagging..." : "Ya, Flag!"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowConfirm(null)}
                                  disabled={isPending}
                                >
                                  Batal
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowConfirm(transaction.id)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              🚩 Flag
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({totalCount} total items)
          </div>

          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1, itemsPerPage)}
              disabled={currentPage <= 1}
            >
              ← Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum, itemsPerPage)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1, itemsPerPage)}
              disabled={currentPage >= totalPages}
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
