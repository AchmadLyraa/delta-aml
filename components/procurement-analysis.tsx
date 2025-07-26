"use client"

import type { ProcurementAnalysisResult } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProcurementAnalysisProps {
  analysis: ProcurementAnalysisResult
}

export function ProcurementAnalysis({ analysis }: ProcurementAnalysisProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Price Markup Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Average Markup</span>
              <span>{analysis.averageMarkup}%</span>
            </div>
            <Progress value={analysis.averageMarkup} className="h-2" />
            <p className="text-xs text-gray-600">{analysis.highMarkupContracts} contracts with high markup</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Oracle Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Verification Rate</span>
              <span>{analysis.oracleVerificationRate}%</span>
            </div>
            <Progress value={analysis.oracleVerificationRate} className="h-2" />
            <p className="text-xs text-gray-600">{analysis.verifiedContracts} contracts oracle verified</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Vendor Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>High Risk Vendors</span>
              <span>{analysis.highRiskVendors}%</span>
            </div>
            <Progress value={analysis.highRiskVendors} className="h-2" />
            <p className="text-xs text-gray-600">{analysis.suspiciousVendorCount} vendors flagged</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Contract Anomalies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Anomaly Score</span>
              <span>{analysis.contractAnomalyScore}%</span>
            </div>
            <Progress value={analysis.contractAnomalyScore} className="h-2" />
            <p className="text-xs text-gray-600">{analysis.anomalousContracts} anomalous contracts</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
