import { Suspense } from "react"
import { ProcurementDashboard } from "@/components/procurement-dashboard"
import { BPKSidebar } from "@/components/bpk-sidebar"
import { BlockchainStatus } from "@/components/blockchain-status"

function LoadingFallback() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

function SidebarLoadingFallback() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function BPKPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-4 space-y-4 lg:space-y-0">
            {/* Title Section */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">DELTA - BPK MODULE</h1>
              <span className="text-sm text-gray-500">Procurement Transparency & Markup Detection</span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <a
                href="/bpk/how-it-works"
                className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                📖 Cara Kerja
              </a>
              <a
                href="/bpk/oracle-integration"
                className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium hover:bg-green-200 transition-colors"
              >
                🔮 Oracle
              </a>
              <a
                href="/"
                className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium hover:bg-purple-200 transition-colors"
              >
                🔄 Switch to PPATK
              </a>

              {/* Blockchain Status */}
              <div className="flex items-center">
                <Suspense fallback={<div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>}>
                  <BlockchainStatus />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content - Scrollable */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<LoadingFallback />}>
              <ProcurementDashboard />
            </Suspense>
          </div>

          {/* Sidebar - Fixed/Sticky with independent scroll */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto sidebar-scroll">
              <Suspense fallback={<SidebarLoadingFallback />}>
                <BPKSidebar />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
