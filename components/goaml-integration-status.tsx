"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface GOAMLStatus {
  status: string
  timestamp: string
  statistics: {
    totalTransactions: number
    todayTransactions: number
    suspiciousTransactions: number
    recentAlerts: number
  }
}

export function GOAMLIntegrationStatus() {
  const [status, setStatus] = useState<GOAMLStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/goaml/status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Error fetching GOAML status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">GOAML Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${status?.status === "healthy" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
          ></div>
          GOAML Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex justify-between items-center">
          <span className="text-sm">Status</span>
          <Badge variant={status?.status === "healthy" ? "default" : "destructive"} className="text-xs">
            {status?.status || "unknown"}
          </Badge>
        </div>

        {status && (
          <>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-lg font-bold text-blue-600">{status.statistics.totalTransactions}</div>
                <div className="text-xs text-blue-800">Total</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="text-lg font-bold text-green-600">{status.statistics.todayTransactions}</div>
                <div className="text-xs text-green-800">Today</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-red-50 p-2 rounded">
                <div className="text-lg font-bold text-red-600">{status.statistics.suspiciousTransactions}</div>
                <div className="text-xs text-red-800">Suspicious</div>
              </div>
              <div className="bg-yellow-50 p-2 rounded">
                <div className="text-lg font-bold text-yellow-600">{status.statistics.recentAlerts}</div>
                <div className="text-xs text-yellow-800">Alerts 24h</div>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center pt-2 border-t">
              Last updated: {new Date(status.timestamp).toLocaleTimeString("id-ID")}
            </div>
          </>
        )}

        <Button variant="outline" size="sm" className="w-full text-xs bg-transparent" onClick={fetchStatus}>
          🔄 Refresh Status
        </Button>
      </CardContent>
    </Card>
  )
}
