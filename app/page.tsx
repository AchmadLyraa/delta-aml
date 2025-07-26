import { Suspense } from "react"
import { TransactionDashboard } from "@/components/transaction-dashboard"
import { AMLSidebar } from "@/components/aml-sidebar"
import { BlockchainStatus } from "@/components/blockchain-status"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-4 space-y-4 lg:space-y-0">
            {/* Title Section */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">DELTA - PPATK MODULE</h1>
              <span className="text-sm text-gray-500">Anti-Money Laundering Detection</span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <a
                href="/how-it-works"
                className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                📖 Cara Kerja
              </a>
              <a
                href="/goaml-integration"
                className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium hover:bg-purple-200 transition-colors"
              >
                🔌 GOAML
              </a>
              <a
                href="/bpk"
                className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium hover:bg-green-200 transition-colors"
              >
                🔄 Switch to BPK
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
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
              <TransactionDashboard />
            </Suspense>
          </div>

          {/* Sidebar - Fixed/Sticky with independent scroll */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto sidebar-scroll">
              <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
                <AMLSidebar />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
