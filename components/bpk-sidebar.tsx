import { getBPKStatistics, getTopSuspiciousVendors, getPriceOracleStatus } from "@/lib/actions/bpk-analytics-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export async function BPKSidebar() {
  try {
    const [stats, suspiciousVendors, oracleStatus] = await Promise.all([
      getBPKStatistics(),
      getTopSuspiciousVendors(),
      getPriceOracleStatus(),
    ])

    return (
      <div className="space-y-4 pb-6">
        {/* Oracle Status */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${oracleStatus.isHealthy ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              ></div>
              Price Oracle Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div className="flex justify-between text-sm">
              <span>e-Katalog LKPP</span>
              <Badge variant={oracleStatus.lkppStatus === "active" ? "default" : "destructive"} className="text-xs">
                {oracleStatus.lkppStatus}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tokopedia API</span>
              <Badge
                variant={oracleStatus.tokopediaStatus === "active" ? "default" : "destructive"}
                className="text-xs"
              >
                {oracleStatus.tokopediaStatus}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Market Data</span>
              <Badge
                variant={oracleStatus.marketDataStatus === "active" ? "default" : "destructive"}
                className="text-xs"
              >
                {oracleStatus.marketDataStatus}
              </Badge>
            </div>
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
              Last updated: {new Date(oracleStatus.lastUpdate).toLocaleTimeString("id-ID")}
            </div>
          </CardContent>
        </Card>

        {/* BPK Statistics */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">📊 BPK Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center bg-red-50 p-3 rounded-lg">
                <div className="text-xl font-bold text-red-600">{stats.suspiciousContracts}</div>
                <div className="text-xs text-red-700">Suspicious</div>
              </div>
              <div className="text-center bg-green-50 p-3 rounded-lg">
                <div className="text-xl font-bold text-green-600">{stats.normalContracts}</div>
                <div className="text-xs text-green-700">Normal</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Markup</span>
                <span className="font-semibold">{stats.averageMarkup}%</span>
              </div>
              <Progress value={stats.averageMarkup} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Oracle Verification</span>
                <span className="font-semibold">{stats.oracleVerificationRate}%</span>
              </div>
              <Progress value={stats.oracleVerificationRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Top Suspicious Vendors */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">🚨 Top Suspicious Vendors</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {suspiciousVendors.map((vendor, index) => (
                <div key={vendor.vendorName} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-800">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{vendor.vendorName}</div>
                      <div className="text-xs text-gray-600">{vendor.suspiciousContracts} suspicious contracts</div>
                    </div>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {vendor.averageMarkup}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">🔔 Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {stats.recentAlerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="p-2 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-yellow-900">{alert.type}</div>
                      <div className="text-xs text-yellow-800 mt-1 line-clamp-2">{alert.description}</div>
                    </div>
                    <Badge
                      variant={
                        alert.severity === "CRITICAL"
                          ? "destructive"
                          : alert.severity === "HIGH"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs ml-2"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(alert.timestamp).toLocaleString("id-ID")}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">⚡ Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8 bg-transparent">
              📊 Generate BPK Report
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8 bg-transparent">
              🔍 Advanced Contract Search
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8 bg-transparent">
              🔮 Update Oracle Prices
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8 bg-transparent">
              📤 Export Contract Data
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error loading BPK sidebar:", error)
    return (
      <div className="space-y-4 pb-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="text-sm">Error loading sidebar data</p>
              <button onClick={() => window.location.reload()} className="mt-2 text-xs text-blue-600 hover:underline">
                Refresh
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}
