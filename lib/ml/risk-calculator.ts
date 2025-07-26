interface TransactionInput {
  amount: number
  fromAccountId: string
  toAccountId: string
  transactionType: string
  timestamp: Date
}

export async function calculateRiskScore(transaction: TransactionInput): Promise<number> {
  try {
    const { prisma } = await import("@/lib/prisma")

    // Get historical data for the accounts
    const [fromAccountHistory, toAccountHistory, recentTransactions] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          OR: [{ fromAccountId: transaction.fromAccountId }, { toAccountId: transaction.fromAccountId }],
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.transaction.findMany({
        where: {
          OR: [{ fromAccountId: transaction.toAccountId }, { toAccountId: transaction.toAccountId }],
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.transaction.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ])

    let riskScore = 0

    // Amount-based risk (30% weight)
    const amountRisk = calculateAmountRisk(transaction.amount, fromAccountHistory)
    riskScore += amountRisk * 0.3

    // Frequency-based risk (25% weight)
    const frequencyRisk = calculateFrequencyRisk(transaction, recentTransactions)
    riskScore += frequencyRisk * 0.25

    // Pattern-based risk (25% weight)
    const patternRisk = calculatePatternRisk(transaction, fromAccountHistory, toAccountHistory)
    riskScore += patternRisk * 0.25

    // Time-based risk (20% weight)
    const timeRisk = calculateTimeRisk(transaction.timestamp)
    riskScore += timeRisk * 0.2

    return Math.min(Math.max(Math.round(riskScore), 0), 100)
  } catch (error) {
    console.error("Error calculating risk score:", error)
    return 50 // Default medium risk
  }
}

function calculateAmountRisk(amount: number, history: any[]): number {
  if (history.length === 0) return 70 // High risk for new accounts

  const amounts = history.map((tx) => tx.amount)
  const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length
  const maxAmount = Math.max(...amounts)

  // Risk increases with deviation from normal patterns
  const deviationFromAvg = Math.abs(amount - avgAmount) / avgAmount
  const deviationFromMax = amount > maxAmount ? (amount - maxAmount) / maxAmount : 0

  let risk = 0

  // Large amounts are riskier
  if (amount > 100000) risk += 40
  else if (amount > 50000) risk += 25
  else if (amount > 10000) risk += 10

  // Unusual amounts compared to history
  if (deviationFromAvg > 5) risk += 30
  else if (deviationFromAvg > 2) risk += 15

  if (deviationFromMax > 2) risk += 25

  return Math.min(risk, 100)
}

function calculateFrequencyRisk(transaction: TransactionInput, recentTransactions: any[]): number {
  const sameAccountTransactions = recentTransactions.filter(
    (tx) => tx.fromAccountId === transaction.fromAccountId || tx.toAccountId === transaction.fromAccountId,
  )

  const hourlyTransactions = sameAccountTransactions.filter(
    (tx) => new Date(tx.createdAt).getTime() > Date.now() - 60 * 60 * 1000,
  ).length

  const dailyTransactions = sameAccountTransactions.length

  let risk = 0

  // High frequency in short time periods
  if (hourlyTransactions > 10) risk += 50
  else if (hourlyTransactions > 5) risk += 25

  if (dailyTransactions > 50) risk += 40
  else if (dailyTransactions > 20) risk += 20

  return Math.min(risk, 100)
}

function calculatePatternRisk(transaction: TransactionInput, fromHistory: any[], toHistory: any[]): number {
  let risk = 0

  // Round number amounts (potential structuring)
  if (transaction.amount % 1000 === 0 && transaction.amount < 10000) {
    risk += 20
  }

  // Just below reporting thresholds
  if (transaction.amount >= 9000 && transaction.amount < 10000) {
    risk += 30
  }

  // Rapid back-and-forth transactions (layering)
  const backAndForth = fromHistory.filter(
    (tx) =>
      tx.toAccountId === transaction.toAccountId &&
      Math.abs(new Date(tx.createdAt).getTime() - transaction.timestamp.getTime()) < 60 * 60 * 1000,
  ).length

  if (backAndForth > 0) risk += 35

  // New account relationships
  const existingRelationship = fromHistory.some(
    (tx) => tx.toAccountId === transaction.toAccountId || tx.fromAccountId === transaction.toAccountId,
  )

  if (!existingRelationship) risk += 15

  return Math.min(risk, 100)
}

function calculateTimeRisk(timestamp: Date): number {
  const hour = timestamp.getHours()
  const dayOfWeek = timestamp.getDay()

  let risk = 0

  // Unusual hours (late night/early morning)
  if (hour < 6 || hour > 22) risk += 15

  // Weekend transactions
  if (dayOfWeek === 0 || dayOfWeek === 6) risk += 10

  return risk
}
