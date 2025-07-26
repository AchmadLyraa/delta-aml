export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">DELTA - Cara Kerja</h1>
            </div>
            <a href="/" className="text-blue-600 hover:text-blue-800">
              ← Kembali ke Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Apa itu DELTA?</h2>
            <p className="text-gray-700 mb-4">
              DELTA (Decentralized Ledger Technology for Anti-laundering) adalah platform AI dan Blockchain untuk
              mendeteksi pencucian uang dan memantau transparansi pengadaan pemerintah secara real-time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Modul PPATK</h3>
                <p className="text-sm text-blue-800">Deteksi pencucian uang dengan AI dan machine learning</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Modul BPK</h3>
                <p className="text-sm text-green-800">Transparansi pengadaan dengan blockchain dan oracle</p>
              </div>
            </div>
          </div>

          {/* Cara Kerja Sistem */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚙️ Cara Kerja Sistem AML</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full p-2 text-blue-600 font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Real-time Transaction Monitoring</h3>
                  <p className="text-gray-700">
                    Sistem memantau semua transaksi keuangan secara real-time. Setiap transaksi yang masuk langsung
                    dianalisis menggunakan algoritma machine learning.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full p-2 text-blue-600 font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Risk Score Calculation</h3>
                  <p className="text-gray-700">Algoritma ML menghitung risk score (0-100%) berdasarkan 4 faktor:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                    <li>
                      <strong>Amount Risk (30%):</strong> Nominal transaksi vs pola historis
                    </li>
                    <li>
                      <strong>Frequency Risk (25%):</strong> Frekuensi transaksi dalam periode tertentu
                    </li>
                    <li>
                      <strong>Pattern Risk (25%):</strong> Deteksi pola mencurigakan (smurfing, layering)
                    </li>
                    <li>
                      <strong>Time Risk (20%):</strong> Waktu transaksi yang tidak biasa
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full p-2 text-blue-600 font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Automatic Alert Generation</h3>
                  <p className="text-gray-700">
                    Jika risk score ≥ 80%, sistem otomatis membuat AML Alert dan menandai transaksi sebagai "High Risk"
                    untuk investigasi prioritas.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full p-2 text-blue-600 font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manual Flagging by Officers</h3>
                  <p className="text-gray-700">
                    Petugas PPATK dapat secara manual "flag" transaksi yang mencurigakan berdasarkan analisis mereka,
                    bahkan jika risk score rendah.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Flag System */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🚩 Flag System - Apa dan Mengapa?</h2>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">Apa itu "Flag"?</h3>
                <p className="text-red-800">
                  <strong>Flag = Menandai transaksi sebagai mencurigakan</strong> untuk investigasi lebih lanjut. Ini
                  adalah tindakan manual yang dilakukan petugas PPATK ketika mereka melihat sesuatu yang tidak wajar.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900">Kapan Harus Flag?</h4>
                  <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                    <li>• Pola transaksi tidak wajar</li>
                    <li>• Nominal ganjil (misal: Rp 9.999.000)</li>
                    <li>• Transaksi berulang dengan jumlah sama</li>
                    <li>• Transaksi di jam tidak biasa</li>
                    <li>• Hubungan antar akun mencurigakan</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900">Apa yang Terjadi Setelah Flag?</h4>
                  <ul className="text-sm text-green-800 mt-2 space-y-1">
                    <li>• Status berubah jadi "🚩 Flagged"</li>
                    <li>• Risk score naik minimum 85%</li>
                    <li>• Sistem buat AML Alert otomatis</li>
                    <li>• Masuk daftar prioritas investigasi</li>
                    <li>• Audit trail tersimpan permanen</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Pattern Detection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔍 Jenis Pola yang Dideteksi</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900">🔴 Smurfing/Structuring</h3>
                  <p className="text-sm text-red-800 mt-2">
                    Memecah transaksi besar menjadi banyak transaksi kecil untuk menghindari pelaporan. Contoh: 10
                    transaksi Rp 9.5 juta dalam 2 hari.
                  </p>
                </div>

                <div className="border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900">🟠 Layering</h3>
                  <p className="text-sm text-orange-800 mt-2">
                    Rantai transaksi kompleks untuk menyamarkan asal uang. Contoh: A → B → C → D → E dalam waktu
                    singkat.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900">🟡 Round Number Pattern</h3>
                  <p className="text-sm text-yellow-800 mt-2">
                    Transaksi dengan nominal bulat yang mencurigakan. Contoh: Rp 5.000.000, Rp 7.500.000 berulang kali.
                  </p>
                </div>

                <div className="border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900">🟣 Time-based Anomaly</h3>
                  <p className="text-sm text-purple-800 mt-2">
                    Transaksi di waktu tidak biasa (tengah malam, weekend). Bisa indikasi aktivitas ilegal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Guide */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Cara Menggunakan Dashboard</h2>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">1. Transaction Monitoring</h3>
                <p className="text-gray-700 text-sm mt-1">
                  Tabel utama menampilkan semua transaksi dengan tanggal, waktu, nominal, risk score, dan status. Warna
                  risk score: Hijau (rendah), Kuning (sedang), Merah (tinggi).
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">2. Pattern Analysis</h3>
                <p className="text-gray-700 text-sm mt-1">
                  Panel kanan menampilkan confidence score untuk berbagai pola AML yang terdeteksi sistem. Semakin
                  tinggi persentase, semakin besar kemungkinan ada aktivitas mencurigakan.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">3. AML Statistics</h3>
                <p className="text-gray-700 text-sm mt-1">
                  Statistik keseluruhan termasuk jumlah transaksi suspicious, false positive rate, dan recent alerts
                  untuk monitoring performa sistem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
