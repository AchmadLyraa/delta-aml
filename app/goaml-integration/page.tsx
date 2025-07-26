import { GOAMLIntegrationStatus } from "@/components/goaml-integration-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GOAMLIntegrationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GOAML Integration</h1>
              <p className="text-sm text-gray-600">Real-time data integration from GOAML system</p>
            </div>
            <a href="/" className="text-blue-600 hover:text-blue-800">
              ← Kembali ke Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Panel */}
          <div className="lg:col-span-1">
            <GOAMLIntegrationStatus />
          </div>

          {/* Documentation */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🔌 API Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800">POST /api/goaml/webhook</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Webhook endpoint untuk menerima data real-time dari GOAML system
                  </p>
                  <div className="mt-2 text-xs text-gray-500">Supports: STR, CTR, CBR, THR reports</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">POST /api/goaml/bulk</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Bulk import endpoint untuk import data dalam jumlah besar
                  </p>
                  <div className="mt-2 text-xs text-gray-500">Batch processing up to 100,000 transactions</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800">GET /api/goaml/status</h4>
                  <p className="text-sm text-gray-600 mt-1">Status endpoint untuk monitoring kesehatan integrasi</p>
                  <div className="mt-2 text-xs text-gray-500">Returns processing statistics and system health</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 Data Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      1
                    </div>
                    <div>
                      <div className="font-medium">GOAML System</div>
                      <div className="text-sm text-gray-600">Sends STR/CTR/CBR/THR reports via webhook</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                      2
                    </div>
                    <div>
                      <div className="font-medium">DELTA Processing</div>
                      <div className="text-sm text-gray-600">Enhanced ML analysis + risk scoring</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                      3
                    </div>
                    <div>
                      <div className="font-medium">Database + Blockchain</div>
                      <div className="text-sm text-gray-600">Store in PostgreSQL + immutable blockchain record</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                      4
                    </div>
                    <div>
                      <div className="font-medium">Alert Generation</div>
                      <div className="text-sm text-gray-600">Auto-generate alerts for high-risk transactions</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚙️ Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div># GOAML Webhook Configuration</div>
                  <div>GOAML_WEBHOOK_URL=https://your-domain.com/api/goaml/webhook</div>
                  <div>GOAML_SECRET_KEY=your-secret-key</div>
                  <div>GOAML_BATCH_SIZE=500</div>
                  <div>GOAML_TIMEOUT=30000</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
