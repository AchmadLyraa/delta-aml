// Core Transaction Interface
export interface Transaction {
  id: string
  amount: number
  fromAccount: string
  toAccount: string
  timestamp: Date
  transactionType: TransactionType
  currency: string
  riskScore: number
  isSuspicious: boolean
  blockchainHash?: string
  geolocation?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

// Transaction Types Enum
export enum TransactionType {
  TRANSFER = "TRANSFER",
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  PAYMENT = "PAYMENT",
  EXCHANGE = "EXCHANGE",
}

// Account Interface
export interface Account {
  id: string
  accountNumber: string
  accountType: AccountType
  balance: number
  currency: string
  ownerId: string
  isActive: boolean
  riskLevel: RiskLevel
  createdAt: Date
  updatedAt: Date
}

// Account Types Enum
export enum AccountType {
  PERSONAL = "PERSONAL",
  BUSINESS = "BUSINESS",
  GOVERNMENT = "GOVERNMENT",
  FINANCIAL_INSTITUTION = "FINANCIAL_INSTITUTION",
}

// Risk Level Enum
export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// Entity Interface (Account Owners)
export interface Entity {
  id: string
  name: string
  entityType: EntityType
  identificationNumber: string
  address?: string
  phoneNumber?: string
  email?: string
  dateOfBirth?: Date
  nationality?: string
  occupation?: string
  riskProfile: RiskLevel
  isBlacklisted: boolean
  createdAt: Date
  updatedAt: Date
}

// Entity Types Enum
export enum EntityType {
  INDIVIDUAL = "INDIVIDUAL",
  CORPORATION = "CORPORATION",
  GOVERNMENT_AGENCY = "GOVERNMENT_AGENCY",
  NON_PROFIT = "NON_PROFIT",
  FINANCIAL_INSTITUTION = "FINANCIAL_INSTITUTION",
}

// AML Alert Interface
export interface AMLAlert {
  id: string
  transactionId: string
  alertType: AlertType
  severity: AlertSeverity
  description: string
  riskScore: number
  isResolved: boolean
  resolvedBy?: string
  resolvedAt?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Alert Types Enum
export enum AlertType {
  SMURFING = "SMURFING",
  LAYERING = "LAYERING",
  STRUCTURING = "STRUCTURING",
  UNUSUAL_PATTERN = "UNUSUAL_PATTERN",
  HIGH_RISK_JURISDICTION = "HIGH_RISK_JURISDICTION",
  VELOCITY_CHECK = "VELOCITY_CHECK",
  THRESHOLD_BREACH = "THRESHOLD_BREACH",
}

// Alert Severity Enum
export enum AlertSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// Pattern Analysis Result Interface
export interface PatternAnalysisResult {
  smurfingConfidence: number
  smurfingPatterns: number
  layeringComplexity: number
  layeringChains: number
  networkHubScore: number
  suspiciousNodes: number
  anomalyScore: number
  anomalousTransactions: number
  analysisTimestamp: Date
}

// Blockchain Status Interface
export interface BlockchainStatus {
  isConnected: boolean
  currentBlock: number
  network: string
  gasPrice?: string
  lastSyncTime: Date
}

// AML Statistics Interface
export interface AMLStatistics {
  totalTransactions: number
  suspiciousTransactions: number
  normalTransactions: number
  falsePositiveRate: number
  averageRiskScore: number
  recentAlerts: RecentAlert[]
}

// Recent Alert Interface
export interface RecentAlert {
  type: string
  description: string
  timestamp: Date
  severity: AlertSeverity
}

// Network Analysis Interface
export interface NetworkNode {
  id: string
  accountId: string
  centrality: number
  clusteringCoefficient: number
  degree: number
  isHub: boolean
  suspiciousConnections: number
}

// Transaction Network Edge Interface
export interface NetworkEdge {
  fromNodeId: string
  toNodeId: string
  weight: number
  transactionCount: number
  totalAmount: number
  averageAmount: number
  timespan: number
}

// ML Model Prediction Interface
export interface MLPrediction {
  transactionId: string
  riskScore: number
  confidence: number
  features: Record<string, number>
  modelVersion: string
  predictionTimestamp: Date
}

// Procurement Module Interfaces (for BPK module)
export interface ProcurementContract {
  id: string
  contractNumber: string
  itemName: string
  specification: string
  estimatedPrice: number
  bidPrice: number
  vendorId: string
  vendorName: string
  procuringAgency: string
  contractDate: Date
  isMarkedUp: boolean
  markupPercentage?: number
  blockchainHash?: string
  oracleVerified: boolean
  createdAt: Date
  updatedAt: Date
}

// Vendor Interface
export interface Vendor {
  id: string
  name: string
  registrationNumber: string
  address: string
  contactPerson: string
  phoneNumber: string
  email: string
  businessType: string
  riskRating: RiskLevel
  isBlacklisted: boolean
  createdAt: Date
  updatedAt: Date
}

// Oracle Price Data Interface
export interface OraclePriceData {
  id: string
  itemCategory: string
  itemName: string
  marketPrice: number
  source: string
  confidence: number
  timestamp: Date
  blockchainHash?: string
}

// BPK Statistics Interface
export interface BPKStatistics {
  totalContracts: number
  suspiciousContracts: number
  normalContracts: number
  averageMarkup: number
  oracleVerificationRate: number
  recentAlerts: RecentAlert[]
}

// Procurement Analysis Result Interface
export interface ProcurementAnalysisResult {
  averageMarkup: number
  highMarkupContracts: number
  oracleVerificationRate: number
  verifiedContracts: number
  highRiskVendors: number
  suspiciousVendorCount: number
  contractAnomalyScore: number
  anomalousContracts: number
  analysisTimestamp: Date
}

// Suspicious Vendor Interface
export interface SuspiciousVendor {
  vendorName: string
  suspiciousContracts: number
  averageMarkup: number
}

// Price Oracle Status Interface
export interface PriceOracleStatus {
  isHealthy: boolean
  lkppStatus: string
  tokopediaStatus: string
  marketDataStatus: string
  lastUpdate: Date
}

// Server Action Response Interface
export interface ActionResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
