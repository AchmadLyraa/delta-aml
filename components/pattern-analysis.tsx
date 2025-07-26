import type { PatternAnalysisResult } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface PatternAnalysisProps {
  patterns: PatternAnalysisResult
}

export function PatternAnalysis({ patterns }: PatternAnalysisProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Smurfing Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Confidence</span>
              <span>{patterns.smurfingConfidence}%</span>
            </div>
            <Progress value={patterns.smurfingConfidence} className="h-2" />
            <p className="text-xs text-gray-600">{patterns.smurfingPatterns} potential patterns detected</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Layering Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Complexity Score</span>
              <span>{patterns.layeringComplexity}%</span>
            </div>
            <Progress value={patterns.layeringComplexity} className="h-2" />
            <p className="text-xs text-gray-600">{patterns.layeringChains} transaction chains analyzed</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Network Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Hub Score</span>
              <span>{patterns.networkHubScore}%</span>
            </div>
            <Progress value={patterns.networkHubScore} className="h-2" />
            <p className="text-xs text-gray-600">{patterns.suspiciousNodes} suspicious nodes identified</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Anomaly Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Anomaly Score</span>
              <span>{patterns.anomalyScore}%</span>
            </div>
            <Progress value={patterns.anomalyScore} className="h-2" />
            <p className="text-xs text-gray-600">{patterns.anomalousTransactions} anomalous transactions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
