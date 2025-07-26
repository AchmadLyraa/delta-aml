import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DELTA - Anti-Money Laundering Platform",
  description: "Decentralized Ledger Technology for Anti-laundering detection and procurement transparency",
  keywords: "AML, Anti-Money Laundering, Blockchain, AI, Machine Learning, PPATK, BPK",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
