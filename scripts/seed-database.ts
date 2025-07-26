import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Clear existing data
  await prisma.aMLAlert.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.procurementContract.deleteMany()
  await prisma.oraclePriceData.deleteMany()
  await prisma.account.deleteMany()
  await prisma.vendor.deleteMany()
  await prisma.entity.deleteMany()

  console.log("🧹 Cleared existing data")

  // Create Entities
  const entities = await Promise.all([
    // Individuals
    prisma.entity.create({
      data: {
        name: "John Smith",
        entityType: "INDIVIDUAL",
        identificationNumber: "ID001",
        address: "123 Main St, Jakarta",
        phoneNumber: "+62-21-1234567",
        email: "john.smith@email.com",
        dateOfBirth: new Date("1985-05-15"),
        nationality: "Indonesian",
        occupation: "Business Owner",
        riskProfile: "MEDIUM",
      },
    }),
    prisma.entity.create({
      data: {
        name: "Maria Garcia",
        entityType: "INDIVIDUAL",
        identificationNumber: "ID002",
        address: "456 Oak Ave, Surabaya",
        phoneNumber: "+62-31-2345678",
        email: "maria.garcia@email.com",
        dateOfBirth: new Date("1990-08-22"),
        nationality: "Indonesian",
        occupation: "Trader",
        riskProfile: "HIGH",
      },
    }),
    prisma.entity.create({
      data: {
        name: "David Chen",
        entityType: "INDIVIDUAL",
        identificationNumber: "ID003",
        address: "789 Pine St, Bandung",
        phoneNumber: "+62-22-3456789",
        email: "david.chen@email.com",
        dateOfBirth: new Date("1978-12-03"),
        nationality: "Indonesian",
        occupation: "Import/Export",
        riskProfile: "CRITICAL",
      },
    }),
    // Corporations
    prisma.entity.create({
      data: {
        name: "PT Maju Bersama",
        entityType: "CORPORATION",
        identificationNumber: "CORP001",
        address: "Jl. Sudirman 100, Jakarta",
        phoneNumber: "+62-21-5555000",
        email: "info@majubersama.co.id",
        riskProfile: "LOW",
      },
    }),
    prisma.entity.create({
      data: {
        name: "CV Berkah Jaya",
        entityType: "CORPORATION",
        identificationNumber: "CORP002",
        address: "Jl. Gatot Subroto 200, Jakarta",
        phoneNumber: "+62-21-6666000",
        email: "contact@berkahjaya.co.id",
        riskProfile: "MEDIUM",
      },
    }),
    prisma.entity.create({
      data: {
        name: "PT Suspicious Trading",
        entityType: "CORPORATION",
        identificationNumber: "CORP003",
        address: "Jl. Thamrin 300, Jakarta",
        phoneNumber: "+62-21-7777000",
        email: "info@suspicioustrading.com",
        riskProfile: "CRITICAL",
      },
    }),
    // Financial Institution
    prisma.entity.create({
      data: {
        name: "Bank Central Indonesia",
        entityType: "FINANCIAL_INSTITUTION",
        identificationNumber: "BANK001",
        address: "Jl. MH Thamrin 1, Jakarta",
        phoneNumber: "+62-21-1500000",
        email: "info@bci.co.id",
        riskProfile: "LOW",
      },
    }),
  ])

  console.log("✅ Created entities")

  // Create Accounts
  const accounts = await Promise.all([
    // Personal accounts
    prisma.account.create({
      data: {
        accountNumber: "ACC001",
        accountType: "PERSONAL",
        balance: 150000,
        ownerId: entities[0].id,
        riskLevel: "MEDIUM",
      },
    }),
    prisma.account.create({
      data: {
        accountNumber: "ACC002",
        accountType: "PERSONAL",
        balance: 75000,
        ownerId: entities[1].id,
        riskLevel: "HIGH",
      },
    }),
    prisma.account.create({
      data: {
        accountNumber: "ACC003",
        accountType: "PERSONAL",
        balance: 500000,
        ownerId: entities[2].id,
        riskLevel: "CRITICAL",
      },
    }),
    // Business accounts
    prisma.account.create({
      data: {
        accountNumber: "BUS001",
        accountType: "BUSINESS",
        balance: 2500000,
        ownerId: entities[3].id,
        riskLevel: "LOW",
      },
    }),
    prisma.account.create({
      data: {
        accountNumber: "BUS002",
        accountType: "BUSINESS",
        balance: 1200000,
        ownerId: entities[4].id,
        riskLevel: "MEDIUM",
      },
    }),
    prisma.account.create({
      data: {
        accountNumber: "BUS003",
        accountType: "BUSINESS",
        balance: 800000,
        ownerId: entities[5].id,
        riskLevel: "CRITICAL",
      },
    }),
    // Bank account
    prisma.account.create({
      data: {
        accountNumber: "BANK001",
        accountType: "FINANCIAL_INSTITUTION",
        balance: 100000000,
        ownerId: entities[6].id,
        riskLevel: "LOW",
      },
    }),
  ])

  console.log("✅ Created accounts")

  // Create Vendors for Procurement Module
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        name: "PT Konstruksi Utama",
        registrationNumber: "VEN001",
        address: "Jl. Industri 1, Jakarta",
        contactPerson: "Budi Santoso",
        phoneNumber: "+62-21-8888000",
        email: "budi@konstruksiutama.co.id",
        businessType: "Construction",
        riskRating: "LOW",
      },
    }),
    prisma.vendor.create({
      data: {
        name: "CV IT Solutions",
        registrationNumber: "VEN002",
        address: "Jl. Teknologi 2, Bandung",
        contactPerson: "Sari Wijaya",
        phoneNumber: "+62-22-9999000",
        email: "sari@itsolutions.co.id",
        businessType: "Technology",
        riskRating: "MEDIUM",
      },
    }),
    prisma.vendor.create({
      data: {
        name: "PT Overpriced Goods",
        registrationNumber: "VEN003",
        address: "Jl. Mahal 3, Jakarta",
        contactPerson: "Andi Markup",
        phoneNumber: "+62-21-0000111",
        email: "andi@overpriced.com",
        businessType: "General Trading",
        riskRating: "HIGH",
      },
    }),
  ])

  console.log("✅ Created vendors")

  // Create Oracle Price Data
  await Promise.all([
    prisma.oraclePriceData.create({
      data: {
        itemCategory: "Office Equipment",
        itemName: "Laptop Dell Inspiron 15",
        marketPrice: 8500000,
        source: "e-Katalog LKPP",
        confidence: 0.95,
      },
    }),
    prisma.oraclePriceData.create({
      data: {
        itemCategory: "Office Equipment",
        itemName: "Printer HP LaserJet",
        marketPrice: 3200000,
        source: "Tokopedia API",
        confidence: 0.88,
      },
    }),
    prisma.oraclePriceData.create({
      data: {
        itemCategory: "Construction",
        itemName: "Cement per ton",
        marketPrice: 850000,
        source: "Industry Report",
        confidence: 0.92,
      },
    }),
  ])

  console.log("✅ Created oracle price data")

  // Create Procurement Contracts
  await Promise.all([
    prisma.procurementContract.create({
      data: {
        contractNumber: "PROC001",
        itemName: "Laptop Dell Inspiron 15",
        specification: '15.6" FHD, Intel i5, 8GB RAM, 256GB SSD',
        estimatedPrice: 8500000,
        bidPrice: 8200000,
        vendorId: vendors[1].id,
        procuringAgency: "Kementerian Pendidikan",
        contractDate: new Date("2024-01-15"),
        isMarkedUp: false,
        oracleVerified: true,
      },
    }),
    prisma.procurementContract.create({
      data: {
        contractNumber: "PROC002",
        itemName: "Printer HP LaserJet",
        specification: "Monochrome, 25ppm, Network ready",
        estimatedPrice: 3200000,
        bidPrice: 4500000,
        vendorId: vendors[2].id,
        procuringAgency: "Kementerian Kesehatan",
        contractDate: new Date("2024-01-20"),
        isMarkedUp: true,
        markupPercentage: 40.6,
        oracleVerified: true,
      },
    }),
  ])

  console.log("✅ Created procurement contracts")

  // Create realistic transaction patterns
  const transactions = []
  const now = new Date()

  // Normal transactions
  for (let i = 0; i < 50; i++) {
    const randomDays = Math.floor(Math.random() * 30)
    const transactionDate = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000)

    transactions.push({
      amount: Math.floor(Math.random() * 50000) + 1000,
      fromAccountId: accounts[Math.floor(Math.random() * 6)].id,
      toAccountId: accounts[Math.floor(Math.random() * 6)].id,
      transactionType: ["TRANSFER", "PAYMENT", "DEPOSIT"][Math.floor(Math.random() * 3)],
      timestamp: transactionDate,
      riskScore: Math.floor(Math.random() * 40) + 10, // Low to medium risk
      isSuspicious: false,
    })
  }

  // Suspicious smurfing pattern - multiple small transactions just below threshold
  const smurfingAccount = accounts[1].id
  const targetAccount = accounts[3].id
  for (let i = 0; i < 8; i++) {
    const transactionDate = new Date(now.getTime() - Math.floor(Math.random() * 2) * 24 * 60 * 60 * 1000)
    transactions.push({
      amount: 9500 + Math.floor(Math.random() * 400), // Just below 10k threshold
      fromAccountId: smurfingAccount,
      toAccountId: targetAccount,
      transactionType: "TRANSFER",
      timestamp: transactionDate,
      riskScore: Math.floor(Math.random() * 20) + 75, // High risk
      isSuspicious: true,
    })
  }

  // Layering pattern - rapid movement between accounts
  const layeringAccounts = [accounts[2].id, accounts[4].id, accounts[5].id]
  let currentAmount = 100000
  for (let i = 0; i < layeringAccounts.length - 1; i++) {
    const transactionDate = new Date(now.getTime() - i * 60 * 60 * 1000) // 1 hour apart
    currentAmount = currentAmount * 0.95 // Slightly reduce amount each time
    transactions.push({
      amount: Math.floor(currentAmount),
      fromAccountId: layeringAccounts[i],
      toAccountId: layeringAccounts[i + 1],
      transactionType: "TRANSFER",
      timestamp: transactionDate,
      riskScore: Math.floor(Math.random() * 15) + 80, // Very high risk
      isSuspicious: true,
    })
  }

  // Round number transactions (potential structuring)
  for (let i = 0; i < 5; i++) {
    const transactionDate = new Date(now.getTime() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
    transactions.push({
      amount: [5000, 7500, 9000, 8500, 6000][i], // Round numbers
      fromAccountId: accounts[Math.floor(Math.random() * 3)].id,
      toAccountId: accounts[Math.floor(Math.random() * 3) + 3].id,
      transactionType: "TRANSFER",
      timestamp: transactionDate,
      riskScore: Math.floor(Math.random() * 25) + 60, // Medium to high risk
      isSuspicious: Math.random() > 0.5,
    })
  }

  // Late night transactions (time-based risk)
  for (let i = 0; i < 3; i++) {
    const transactionDate = new Date(now.getTime() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000)
    transactionDate.setHours(2 + Math.floor(Math.random() * 3)) // 2-5 AM
    transactions.push({
      amount: Math.floor(Math.random() * 30000) + 10000,
      fromAccountId: accounts[Math.floor(Math.random() * 6)].id,
      toAccountId: accounts[Math.floor(Math.random() * 6)].id,
      transactionType: "TRANSFER",
      timestamp: transactionDate,
      riskScore: Math.floor(Math.random() * 20) + 50, // Medium to high risk
      isSuspicious: Math.random() > 0.7,
    })
  }

  // Create all transactions
  for (const txData of transactions) {
    if (txData.fromAccountId !== txData.toAccountId) {
      // Avoid self-transfers
      await prisma.transaction.create({ data: txData })
    }
  }

  console.log(`✅ Created ${transactions.length} transactions`)

  // Create AML Alerts for suspicious transactions
  const suspiciousTransactions = await prisma.transaction.findMany({
    where: { isSuspicious: true },
  })

  const alerts = []
  for (const tx of suspiciousTransactions) {
    const alertTypes = ["SMURFING", "LAYERING", "STRUCTURING", "UNUSUAL_PATTERN", "THRESHOLD_BREACH"]
    const severities = ["MEDIUM", "HIGH", "CRITICAL"]

    alerts.push({
      transactionId: tx.id,
      alertType: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: `Suspicious transaction detected: ${tx.amount.toLocaleString()} ${tx.currency}`,
      riskScore: tx.riskScore,
      isResolved: Math.random() > 0.7, // 30% resolved
    })
  }

  for (const alertData of alerts) {
    await prisma.aMLAlert.create({ data: alertData })
  }

  console.log(`✅ Created ${alerts.length} AML alerts`)

  console.log("🎉 Database seeding completed successfully!")
  console.log("\n📊 Summary:")
  console.log(`- Entities: ${entities.length}`)
  console.log(`- Accounts: ${accounts.length}`)
  console.log(`- Vendors: ${vendors.length}`)
  console.log(`- Transactions: ${transactions.length}`)
  console.log(`- AML Alerts: ${alerts.length}`)
  console.log(`- Procurement Contracts: 2`)
  console.log(`- Oracle Price Data: 3`)
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
