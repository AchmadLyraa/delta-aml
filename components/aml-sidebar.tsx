import { getAMLStatistics, getTopSuspiciousAccounts, getSystemStatus } from "@/lib/actions/analytics-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export async function AMLSidebar() {
  const [stats, suspiciousAccounts, systemStatus] = await Promise.all([
    getAMLStatistics(),
    getTopSuspiciousAccounts(),
    getSystemStatus(),
  ])

  return (
    <div className="space-y-4 pb-6">
      {/* System Status */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${systemStatus.isHealthy ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
            ></div>
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="flex justify-between text-sm">
            <span>ML Engine</span>
            <Badge variant={systemStatus.mlEngineStatus === "active" ? "default" : "destructive"} className="text-xs">
              {systemStatus.mlEngineStatus}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span>Blockchain</span>
            <Badge
              variant={systemStatus.blockchainStatus === "connected" ? "default" : "destructive"}
              className="text-xs"
            >
              {systemStatus.blockchainStatus}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span>Database</span>
            <Badge variant={systemStatus.databaseStatus === "healthy" ? "default" : "destructive"} className="text-xs">
              {systemStatus.databaseStatus}
            </Badge>
          </div>
          <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
            Last updated: {new Date(systemStatus.lastUpdate).toLocaleTimeString("id-ID")}
          </div>
        </CardContent>
      </Card>

      {/* AML Statistics */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">📊 AML Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center bg-red-50 p-3 rounded-lg">
              <div className="text-xl font-bold text-red-600">{stats.suspiciousTransactions}</div>
              <div className="text-xs text-red-700">Suspicious</div>
            </div>
            <div className="text-center bg-green-50 p-3 rounded-lg">
              <div className="text-xl font-bold text-green-600">{stats.normalTransactions}</div>
              <div className="text-xs text-green-700">Normal</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>False Positive Rate</span>
              <span className="font-semibold">{stats.falsePositiveRate}%</span>
            </div>
            <Progress value={stats.falsePositiveRate} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Average Risk Score</span>
              <span className="font-semibold">{stats.averageRiskScore}%</span>
            </div>
            <Progress value={stats.averageRiskScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Top Suspicious Accounts */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">🚨 Top Suspicious Accounts</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {suspiciousAccounts.map((account, index) => (
              <div key={account.accountNumber} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-800">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{account.accountNumber}</div>
                    <div className="text-xs text-gray-600">{account.suspiciousCount} suspicious txs</div>
                  </div>
                </div>
                <Badge variant="destructive" className="text-xs">
                  {account.riskScore}%
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
            📊 Generate Report
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8 bg-transparent">
            🔍 Advanced Search
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8 bg-transparent">
            ⚙️ ML Model Settings
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8 bg-transparent">
            📤 Export Data
          </Button>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">📈 Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-700">Low Risk (0-59%)</span>
              <span className="font-semibold">
                {Math.round((stats.normalTransactions / stats.totalTransactions) * 100)}%
              </span>
            </div>
            <Progress value={(stats.normalTransactions / stats.totalTransactions) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-yellow-700">Medium Risk (60-79%)</span>
              <span className="font-semibold">15%</span>
            </div>
            <Progress value={15} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-red-700">High Risk (80-100%)</span>
              <span className="font-semibold">
                {Math.round((stats.suspiciousTransactions / stats.totalTransactions) * 100)}%
              </span>
            </div>
            <Progress value={(stats.suspiciousTransactions / stats.totalTransactions) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">📅 Today's Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-blue-50 p-2 rounded">
              <div className="text-lg font-bold text-blue-600">{stats.totalTransactions}</div>
              <div className="text-xs text-blue-800">Total Txs</div>
            </div>
            <div className="bg-red-50 p-2 rounded">
              <div className="text-lg font-bold text-red-600">{stats.recentAlerts.length}</div>
              <div className="text-xs text-red-800">New Alerts</div>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">Last 24 hours activity</div>
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>New transaction processed</span>
              <span className="text-gray-500">2s ago</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
              <span>Risk score calculated</span>
              <span className="text-gray-500">5s ago</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span>Pattern analysis complete</span>
              <span className="text-gray-500">12s ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
