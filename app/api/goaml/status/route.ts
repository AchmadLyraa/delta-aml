import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get processing statistics
    const [totalTransactions, todayTransactions, suspiciousTransactions, recentAlerts] = await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.transaction.count({
        where: { isSuspicious: true },
      }),
      prisma.aMLAlert.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      statistics: {
        totalTransactions,
        todayTransactions,
        suspiciousTransactions,
        recentAlerts,
      },
      endpoints: {
        webhook: "/api/goaml/webhook",
        status: "/api/goaml/status",
        bulk: "/api/goaml/bulk",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
