# DELTA - Anti-Money Laundering Platform MVP
 
DELTA (Decentralized Ledger Technology for Anti-laundering) adalah platform terintegrasi berbasis AI dan Blockchain Smart Contract untuk deteksi pencucian uang dan transparansi pengadaan pemerintah.

## 🚀 Fitur Utama

### Modul Intelijen Keuangan (PPATK)
- **Real-time Transaction Monitoring**: Pemantauan transaksi secara real-time
- **Pattern Detection**: Deteksi pola smurfing, layering, dan structuring
- **Risk Scoring**: Sistem penilaian risiko berbasis ML
- **Network Analysis**: Analisis jaringan transaksi untuk identifikasi hub mencurigakan
- **Anomaly Detection**: Deteksi anomali statistik dan temporal

### Modul Transparansi Pengadaan (BPK)
- **Oracle Price Verification**: Verifikasi harga pasar real-time
- **Markup Detection**: Deteksi mark-up harga pengadaan
- **Blockchain Recording**: Pencatatan kontrak di blockchain
- **Vendor Risk Assessment**: Penilaian risiko vendor

## 🛠️ Teknologi

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: PostgreSQL
- **Blockchain**: Ethereum L2 (Arbitrum), Ethers.js
- **AI/ML**: Pattern detection algorithms, Risk scoring models

## 📦 Instalasi

1. **Clone repository**
\`\`\`bash
git clone <repository-url>
cd delta-aml-mvp
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Setup database**
\`\`\`bash
# Copy environment variables
cp .env.example .env

# Edit .env dengan database URL Anda
# DATABASE_URL="postgresql://username:password@localhost:5432/delta_aml_db"

# Generate Prisma client
npm run db:generate

# Push schema ke database
npm run db:push

# Seed database dengan data real
npm run db:seed
\`\`\`

4. **Run development server**
\`\`\`bash
npm run dev
\`\`\`

Aplikasi akan berjalan di `http://localhost:3000`

## 🗄️ Database Schema

### Core Entities
- **Entity**: Individu, korporasi, atau institusi
- **Account**: Rekening bank atau akun keuangan
- **Transaction**: Transaksi keuangan dengan risk scoring
- **AMLAlert**: Alert untuk aktivitas mencurigakan

### Procurement Module
- **Vendor**: Vendor pengadaan pemerintah
- **ProcurementContract**: Kontrak pengadaan
- **OraclePriceData**: Data harga pasar dari oracle

## 🤖 Machine Learning Features

### Risk Scoring Algorithm
- **Amount-based Risk**: Analisis berdasarkan nominal transaksi
- **Frequency-based Risk**: Analisis frekuensi transaksi
- **Pattern-based Risk**: Deteksi pola mencurigakan
- **Time-based Risk**: Analisis waktu transaksi

### Pattern Detection
- **Smurfing Detection**: Deteksi transaksi kecil berulang
- **Layering Analysis**: Analisis rantai transaksi kompleks
- **Network Analysis**: Analisis jaringan dan hub detection
- **Anomaly Detection**: Deteksi anomali statistik

## 🔧 Commands

\`\`\`bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:seed         # Seed database with real data
npm run db:studio       # Open Prisma Studio
npm run db:reset        # Reset database and reseed

# Linting
npm run lint            # Run ESLint
\`\`\`

## 📊 Data Seeding

Database di-seed dengan data realistis termasuk:

- **7 Entities**: Individu, korporasi, dan institusi keuangan
- **7 Accounts**: Berbagai jenis akun dengan risk levels
- **3 Vendors**: Vendor pengadaan dengan risk ratings
- **80+ Transactions**: Termasuk pola normal dan mencurigakan
- **AML Alerts**: Alert otomatis untuk transaksi berisiko tinggi
- **Procurement Data**: Kontrak pengadaan dan data harga oracle

### Pola Transaksi Mencurigakan yang Di-seed:
1. **Smurfing Pattern**: 8 transaksi kecil di bawah threshold
2. **Layering Pattern**: Rantai transaksi antar akun
3. **Round Number Transactions**: Transaksi dengan nominal bulat
4. **Late Night Transactions**: Transaksi di jam tidak biasa

## 🔐 Security Features

- **Server-side Processing**: Semua logika sensitif di server
- **Input Validation**: Validasi input komprehensif
- **Risk-based Authentication**: Autentikasi berdasarkan risk level
- **Audit Trail**: Pencatatan semua aktivitas

## 🚀 Production Deployment

Untuk deployment production:

1. Setup PostgreSQL database
2. Configure environment variables
3. Setup Ethereum L2 connection
4. Configure Oracle APIs
5. Deploy to Vercel atau platform pilihan

## 📈 Monitoring & Analytics

Dashboard menyediakan:
- Real-time transaction monitoring
- Risk score distribution
- Pattern analysis results
- False positive rate tracking
- Alert management

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 🆘 Support

Untuk support dan pertanyaan:
- Email: support@delta-aml.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

---

**⚠️ PENTING**: Ini adalah MVP (Minimum Viable Product). Untuk production, pastikan:
- Implementasi keamanan tambahan
- Integrasi dengan sistem real PPATK/BPK
- Compliance dengan regulasi yang berlaku
- Load testing dan performance optimization
