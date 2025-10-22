'use client'
import { History, Upload, FileText, Clock, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"

// --- Definisi Tipe dan Kunci (Diambil dari kode UploadPage sebelumnya) ---
// Harap pastikan Anda mendefinisikan tipe UploadedFile di file types/index.ts Anda,
// atau salin definisinya ke sini jika Anda tidak menggunakan file types terpisah.
interface UploadedFile {
  id: number
  name: string
  size: string
  link: string
  uploadDate: string
  expiryDate: string
  content: string // Konten file
  isBookmarked: boolean
}

// Catatan: Anda perlu membuat STORAGE_KEY_ACCESS yang terpisah untuk riwayat baca
const STORAGE_KEY_UPLOAD = "uploadedFiles"
const STORAGE_KEY_ACCESS = "lastAccessedFiles" // Kunci baru untuk riwayat baca/akses

// --- Fungsi Pembantu ---

/**
 * Mengambil data riwayat upload (UploadedFile) dari localStorage.
 */
const getUploadedFiles = (): UploadedFile[] => {
  if (typeof window === "undefined") return []
  const storedData = window.localStorage.getItem(STORAGE_KEY_UPLOAD)

  try {
    const parsed = storedData ? JSON.parse(storedData) : []
    // Mengurutkan berdasarkan ID (asumsi ID = Date.now(), jadi yang terbaru ada di atas)
    return Array.isArray(parsed) ? parsed.sort((a: UploadedFile, b: UploadedFile) => b.id - a.id) : []
  } catch (error) {
    console.error("Gagal parse LocalStorage untuk Riwayat Upload:", error)
    return []
  }
}

// Anda harus mengimplementasikan logika untuk menyimpan dan mengambil riwayat akses terakhir.
// Ini hanya contoh struktur. Logika penyimpanan riwayat baca harus ditambahkan
// di tempat Anda "membaca" sebuah file.
interface AccessHistoryItem {
    id: number | string;
    fileName: string;
    lastAccessDate: string; // Misal, format tanggal yang mudah dibaca
    link?: string; // Jika memiliki link
}

const getAccessHistory = (): AccessHistoryItem[] => {
    if (typeof window === "undefined") return []
    const storedData = window.localStorage.getItem(STORAGE_KEY_ACCESS)
    
    // --- TEMPORARY DUMMY DATA UNTUK DEMONSTRASI RIWAYAT BACA ---
    // Hapus blok ini dan implementasikan logika penyimpanan Anda
    if (!storedData) {
        return [
            { id: 101, fileName: "Laporan_Keuangan_Q3.pdf", lastAccessDate: "15 Oct 2025, 10:30" },
            { id: 102, fileName: "Presentasi_Proyek_Baru.pptx", lastAccessDate: "14 Oct 2025, 14:00" },
            { id: 103, fileName: "Surat_Kontrak.docx", lastAccessDate: "12 Oct 2025, 09:15" },
        ] as AccessHistoryItem[];
    }
    // --- AKHIR DUMMY DATA ---

    try {
        const parsed = storedData ? JSON.parse(storedData) : []
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        console.error("Gagal parse LocalStorage untuk Riwayat Akses:", error)
        return []
    }
}


// --------------------------------------------------------------------

export default function HistoryPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [accessHistory, setAccessHistory] = useState<AccessHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mengambil kedua jenis riwayat
    setIsLoading(true)
    setUploadedFiles(getUploadedFiles())
    setAccessHistory(getAccessHistory())
    setIsLoading(false)
  }, [])

  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-48">
              <p className="text-foreground font-medium">Memuat riwayat...</p>
          </div>
      )
  }

  // Cek apakah kedua riwayat kosong
  const isHistoryEmpty = uploadedFiles.length === 0 && accessHistory.length === 0;

  return (
    <section className="space-y-8 mx-4 md:mx-0 py-8 pb-24 md:pb-10">
      
      <header className="rounded-2xl border-2 border-foreground bg-gradient-to-r from-teal-50 to-emerald-50 p-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500 rounded-xl">
            <History className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Aktivitas & Riwayat Saya</h1>
            <p className="text-sm text-foreground/60 mt-1">Lacak file yang Anda upload dan dokumen yang Anda akses</p>
          </div>
        </div>
      </header>

      {/* Konten Utama Riwayat */}
      {isHistoryEmpty ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-foreground/60 font-medium">Tidak ada riwayat aktivitas yang ditemukan.</p>
            <p className="text-sm text-foreground/40 mt-1">Upload atau akses file untuk mulai melacak riwayat.</p>
        </div>
      ) : (
        <div className="space-y-8">
            
            {/* Riwayat Akses Terakhir (Akses Baca) */}
            <div className="rounded-2xl border-2 border-foreground bg-white p-6 shadow-md">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-500" /> Riwayat Akses Terakhir
                </h2>
                <p className="text-sm text-foreground/70 mb-4">Daftar file yang terakhir kali Anda buka (riwayat baca).</p>

                {accessHistory.length > 0 ? (
                    <div className="space-y-3">
                        {accessHistory.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <FileText className="h-5 w-5 text-indigo-400" />
                                    <p className="font-medium text-foreground truncate">{item.fileName}</p>
                                </div>
                                <span className="text-xs text-foreground/60 flex-shrink-0">
                                    Akses: {item.lastAccessDate}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <p>Riwayat Akses Terakhir kosong. Anda perlu mengimplementasikan logika untuk menyimpan riwayat baca.</p>
                    </div>
                )}
            </div>

            {/* Riwayat Upload */}
            <div className="rounded-2xl border-2 border-foreground bg-white p-6 shadow-md">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-emerald-500" /> Riwayat Upload Saya
                </h2>
                <p className="text-sm text-foreground/70 mb-4">Daftar file yang Anda unggah ke sistem.</p>

                {uploadedFiles.length > 0 ? (
                    <div className="space-y-3">
                        {uploadedFiles.map((file) => (
                            <div
                                key={file.id}
                                className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <FileText className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-foreground truncate">{file.name}</p>
                                        <p className="text-xs text-foreground/60">
                                            {file.size} • Upload: {file.uploadDate} • Kadaluarsa: {file.expiryDate}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-2 md:mt-0 flex-shrink-0">
                                    {file.isBookmarked && (
                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                                            Bookmark
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <p>Belum ada file yang diunggah. Silakan kembali ke halaman upload.</p>
                    </div>
                )}
            </div>

        </div>
      )}
      
    </section>
  )
}