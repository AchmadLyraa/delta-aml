import type { PatternAnalysisResult } from "@/lib/types"

export async function detectPatterns(transactions: any[]): Promise<PatternAnalysisResult> {
  try {
    const smurfingAnalysis = detectSmurfingPatterns(transactions)
    const layeringAnalysis = detectLayeringPatterns(transactions)
    const networkAnalysis = analyzeTransactionNetwork(transactions)
    const anomalyAnalysis = detectAnomalies(transactions)

    return {
      smurfingConfidence: smurfingAnalysis.confidence,
      smurfingPatterns: smurfingAnalysis.patterns,
      layeringComplexity: layeringAnalysis.complexity,
      layeringChains: layeringAnalysis.chains,
      networkHubScore: networkAnalysis.hubScore,
      suspiciousNodes: networkAnalysis.suspiciousNodes,
      anomalyScore: anomalyAnalysis.score,
      anomalousTransactions: anomalyAnalysis.count,
      analysisTimestamp: new Date(),
    }
  } catch (error) {
    console.error("Error detecting patterns:", error)
    return {
      smurfingConfidence: 0,
      smurfingPatterns: 0,
      layeringComplexity: 0,
      layeringChains: 0,
      networkHubScore: 0,
      suspiciousNodes: 0,
      anomalyScore: 0,
      anomalousTransactions: 0,
      analysisTimestamp: new Date(),
    }
  }
}

function detectSmurfingPatterns(transactions: any[]): { confidence: number; patterns: number } {
  // Group transactions by amount ranges that might indicate structuring
  const structuredAmounts = transactions.filter(
    (tx) =>
      (tx.amount >= 9000 && tx.amount < 10000) || // Just below reporting threshold
      (tx.amount % 1000 === 0 && tx.amount < 10000), // Round amounts
  )

  // Group by account pairs and time windows
  const accountPairs = new Map<string, any[]>()

  transactions.forEach((tx) => {
    const key = `${tx.fromAccountId}-${tx.toAccountId}`
    if (!accountPairs.has(key)) {
      accountPairs.set(key, [])
    }
    accountPairs.get(key)!.push(tx)
  })

  let suspiciousPatterns = 0
  let totalConfidence = 0

  accountPairs.forEach((txs, pair) => {
    if (txs.length >= 3) {
      // Multiple transactions between same accounts
      const timeSpan =
        new Date(Math.max(...txs.map((tx) => new Date(tx.createdAt).getTime()))).getTime() -
        new Date(Math.min(...txs.map((tx) => new Date(tx.createdAt).getTime()))).getTime()

      // If multiple transactions in short time with similar amounts
      if (timeSpan < 24 * 60 * 60 * 1000) {
        // Within 24 hours
        const amounts = txs.map((tx) => tx.amount)
        const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length
        const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - avgAmount, 2), 0) / amounts.length

        if (variance < avgAmount * 0.1) {
          // Low variance indicates similar amounts
          suspiciousPatterns++
          totalConfidence += 70
        }
      }
    }
  })

  const confidence = suspiciousPatterns > 0 ? Math.min(totalConfidence / suspiciousPatterns, 100) : 0

  return {
    confidence: Math.round(confidence),
    patterns: suspiciousPatterns,
  }
}

function detectLayeringPatterns(transactions: any[]): { complexity: number; chains: number } {
  // Build transaction graph
  const graph = new Map<string, Set<string>>()

  transactions.forEach((tx) => {
    if (!graph.has(tx.fromAccountId)) {
      graph.set(tx.fromAccountId, new Set())
    }
    graph.get(tx.fromAccountId)!.add(tx.toAccountId)
  })

  // Find transaction chains (A -> B -> C -> D...)
  let chains = 0
  let totalComplexity = 0

  graph.forEach((destinations, source) => {
    if (destinations.size > 1) {
      // Account sends to multiple destinations
      destinations.forEach((dest) => {
        if (graph.has(dest) && graph.get(dest)!.size > 0) {
          // This destination also sends money elsewhere (potential layering)
          chains++

          // Calculate complexity based on chain length and branching
          const chainLength = calculateChainLength(dest, graph, new Set())
          const branchingFactor = graph.get(dest)!.size

          totalComplexity += chainLength * branchingFactor * 10
        }
      })
    }
  })

  const complexity = chains > 0 ? Math.min(totalComplexity / chains, 100) : 0

  return {
    complexity: Math.round(complexity),
    chains,
  }
}

function calculateChainLength(
  accountId: string,
  graph: Map<string, Set<string>>,
  visited: Set<string>,
  maxDepth = 5,
): number {
  if (visited.has(accountId) || maxDepth <= 0) return 0

  visited.add(accountId)

  const destinations = graph.get(accountId)
  if (!destinations || destinations.size === 0) return 1

  let maxLength = 1
  destinations.forEach((dest) => {
    const length = 1 + calculateChainLength(dest, graph, new Set(visited), maxDepth - 1)
    maxLength = Math.max(maxLength, length)
  })

  return maxLength
}

function analyzeTransactionNetwork(transactions: any[]): { hubScore: number; suspiciousNodes: number } {
  // Calculate node degrees (how many connections each account has)
  const nodeDegrees = new Map<string, number>()

  transactions.forEach((tx) => {
    nodeDegrees.set(tx.fromAccountId, (nodeDegrees.get(tx.fromAccountId) || 0) + 1)
    nodeDegrees.set(tx.toAccountId, (nodeDegrees.get(tx.toAccountId) || 0) + 1)
  })

  // Identify hubs (accounts with unusually high connectivity)
  const degrees = Array.from(nodeDegrees.values())
  const avgDegree = degrees.reduce((sum, deg) => sum + deg, 0) / degrees.length
  const stdDev = Math.sqrt(degrees.reduce((sum, deg) => sum + Math.pow(deg - avgDegree, 2), 0) / degrees.length)

  const hubThreshold = avgDegree + 2 * stdDev
  const hubs = Array.from(nodeDegrees.entries()).filter(([_, degree]) => degree > hubThreshold)

  const hubScore = hubs.length > 0 ? Math.min((hubs.length / nodeDegrees.size) * 100, 100) : 0

  return {
    hubScore: Math.round(hubScore),
    suspiciousNodes: hubs.length,
  }
}

function detectAnomalies(transactions: any[]): { score: number; count: number } {
  if (transactions.length === 0) return { score: 0, count: 0 }

  // Statistical anomaly detection based on amount distribution
  const amounts = transactions.map((tx) => tx.amount)
  const mean = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length
  const stdDev = Math.sqrt(amounts.reduce((sum, amt) => sum + Math.pow(amt - mean, 2), 0) / amounts.length)

  // Transactions more than 2 standard deviations from mean are anomalous
  const anomalousTransactions = transactions.filter((tx) => Math.abs(tx.amount - mean) > 2 * stdDev)

  // Time-based anomalies (transactions at unusual hours)
  const timeAnomalies = transactions.filter((tx) => {
    const hour = new Date(tx.createdAt).getHours()
    return hour < 6 || hour > 22 // Late night/early morning
  })

  const totalAnomalies = new Set([...anomalousTransactions.map((tx) => tx.id), ...timeAnomalies.map((tx) => tx.id)])
    .size
  const anomalyScore = (totalAnomalies / transactions.length) * 100

  return {
    score: Math.round(Math.min(anomalyScore, 100)),
    count: totalAnomalies,
  }
}
