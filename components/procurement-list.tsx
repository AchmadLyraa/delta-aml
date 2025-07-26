"use client"

import { useState, useTransition } from "react"
import type { ProcurementContract } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { flagSuspiciousContract } from "@/lib/actions/procurement-actions"

interface ProcurementListProps {
  contracts: ProcurementContract[]
  totalCount: number
  currentPage: number
  itemsPerPage: number
  loading?: boolean
  onSearch: (filters: SearchFilters) => void
  onPageChange: (page: number, itemsPerPage: number) => void
}

interface SearchFilters {
  search: string
  searchIn: string
  markupLevel: string
  status: string
  priceMin: string
  priceMax: string
  agency: string
}

export function ProcurementList({
  contracts,
  totalCount,
  currentPage,
  itemsPerPage,
  loading = false,
  onSearch,
  onPageChange,
}: ProcurementListProps) {
  const [showConfirm, setShowConfirm] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Search states
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    searchIn: "all",
    markupLevel: "all",
    status: "all",
    priceMin: "",
    priceMax: "",
    agency: "all",
  })

  const handleFlag = (contractId: string) => {
    startTransition(async () => {
      await flagSuspiciousContract(contractId)
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
      markupLevel: "all",
      status: "all",
      priceMin: "",
      priceMax: "",
      agency: "all",
    }
    setFilters(clearedFilters)
    onSearch(clearedFilters)
  }

  const getMarkupColor = (markupPercentage: number | null) => {
    if (!markupPercentage) return "bg-gray-100 text-gray-800"
    if (markupPercentage >= 50) return "bg-red-100 text-red-800"
    if (markupPercentage >= 30) return "bg-yellow-100 text-yellow-800"
    if (markupPercentage >= 15) return "bg-orange-100 text-orange-800"
    return "bg-green-100 text-green-800"
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(new Date(date))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Pagination calculations
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalCount)

  return (
    <div className="space-y-4">
      {/* Search & Filter Section */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">🔍 Search & Filter Procurement</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Search by Contract/Item */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Contract/Item</label>
            <Input
              placeholder="Contract number atau item name"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Search In Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search In</label>
            <Select value={filters.searchIn} onValueChange={(value) => setFilters({ ...filters, searchIn: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih lokasi search" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🔍 Semua (Contract, Item, Vendor)</SelectItem>
                <SelectItem value="contract">📄 Contract Number saja</SelectItem>
                <SelectItem value="item">📦 Item Name saja</SelectItem>
                <SelectItem value="vendor">🏢 Vendor saja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Markup Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Markup Level</label>
            <Select
              value={filters.markupLevel}
              onValueChange={(value) => setFilters({ ...filters, markupLevel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Markup Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Markup Level</SelectItem>
                <SelectItem value="normal">Normal (0-15%)</SelectItem>
                <SelectItem value="medium">Sedang (15-30%)</SelectItem>
                <SelectItem value="high">Tinggi (30-50%)</SelectItem>
                <SelectItem value="critical">Kritis (&gt;50%)</SelectItem>
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
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="verified">Oracle Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Min */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Minimum</label>
            <Input
              type="number"
              placeholder="0"
              value={filters.priceMin}
              onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
            />
          </div>

          {/* Price Max */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Maximum</label>
            <Input
              type="number"
              placeholder="999999999"
              value={filters.priceMax}
              onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
            />
          </div>

          {/* Agency Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Procuring Agency</label>
            <Select value={filters.agency} onValueChange={(value) => setFilters({ ...filters, agency: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Agency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Agency</SelectItem>
                <SelectItem value="Kementerian Pendidikan">Kementerian Pendidikan</SelectItem>
                <SelectItem value="Kementerian Kesehatan">Kementerian Kesehatan</SelectItem>
                <SelectItem value="Kementerian PUPR">Kementerian PUPR</SelectItem>
                <SelectItem value="Kementerian Pertahanan">Kementerian Pertahanan</SelectItem>
              </SelectContent>
            </Select>
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
                  ? "semua field (Contract, Item, Vendor)"
                  : filters.searchIn === "contract"
                    ? "Contract Number saja"
                    : filters.searchIn === "item"
                      ? "Item Name saja"
                      : "Vendor saja"}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Menampilkan {startItem}-{endItem} dari {totalCount} kontrak
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

      {/* Procurement Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item & Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price Analysis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Markup
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
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-6 py-4 whitespace-nowrap">
                        <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {totalCount === 0 ? "Tidak ada kontrak yang ditemukan" : "Loading..."}
                  </td>
                </tr>
              ) : (
                contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="font-medium">{contract.contractNumber}</div>
                        <div className="text-xs text-gray-500">{formatDateTime(contract.contractDate)}</div>
                        <div className="text-xs text-blue-600">{contract.procuringAgency}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="font-medium">{contract.itemName}</div>
                        <div className="text-xs text-gray-500 max-w-xs truncate">{contract.specification}</div>
                        <div className="text-xs text-green-600">{contract.vendorName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div>
                          <span className="text-gray-600">Est:</span> {formatCurrency(contract.estimatedPrice)}
                        </div>
                        <div>
                          <span className="text-green-600">Bid:</span> {formatCurrency(contract.bidPrice)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contract.markupPercentage ? (
                        <div className="space-y-1">
                          <Badge className={getMarkupColor(contract.markupPercentage)}>
                            {contract.markupPercentage.toFixed(1)}%
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {contract.markupPercentage >= 50
                              ? "Kritis"
                              : contract.markupPercentage >= 30
                                ? "Tinggi"
                                : contract.markupPercentage >= 15
                                  ? "Sedang"
                                  : "Normal"}
                          </div>
                        </div>
                      ) : (
                        <Badge variant="secondary">No Markup</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <Badge variant={contract.isMarkedUp ? "destructive" : "secondary"}>
                          {contract.isMarkedUp ? "🚩 Flagged" : "✅ Normal"}
                        </Badge>
                        {contract.oracleVerified && <div className="text-xs text-green-600">🔮 Oracle Verified</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!contract.isMarkedUp && (
                        <div className="space-y-2">
                          {showConfirm === contract.id ? (
                            <div className="space-y-2">
                              <div className="text-xs text-red-600 font-medium">Yakin ingin flag kontrak ini?</div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleFlag(contract.id)}
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
                              onClick={() => setShowConfirm(contract.id)}
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
