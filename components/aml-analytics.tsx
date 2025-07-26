import { getAMLStatistics } from "@/lib/actions/analytics-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export async function AMLAnalytics() {
  const stats = await getAMLStatistics()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AML Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.suspiciousTransactions}</div>
              <div className="text-sm text-gray-600">Suspicious</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.normalTransactions}</div>
              <div className="text-sm text-gray-600">Normal</div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{stats.falsePositiveRate}%</div>
              <div className="text-sm text-gray-600">False Positive Rate</div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{stats.averageRiskScore}%</div>
              <div className="text-sm text-gray-600">Average Risk Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{alert.type}</div>
                  <div className="text-xs text-gray-600">{alert.description}</div>
                </div>
                <div className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
