"use client"

import { Search, FileText, Star, Copy, Trash2, Eye, Calendar, Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface UploadedFile {
  id: number
  name: string
  size: string
  link: string
  uploadDate: string
  expiryDate: string
  content: string
  isBookmarked?: boolean
}

interface Toast {
  id: string
  type: "success" | "error" | "info"
  message: string
}

const STORAGE_KEY = "uploadedFiles"

const getExistingFiles = (): UploadedFile[] => {
  if (typeof window === "undefined") return []
  const storedData = window.localStorage.getItem(STORAGE_KEY)

  try {
    const parsed = storedData ? JSON.parse(storedData) : []
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error("Gagal parse LocalStorage:", error)
    return []
  }
}

const Toast = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[toast.type]

  return (
    <div className={`${bgColor} text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
      <p className="font-medium text-sm">{toast.message}</p>
    </div>
  )
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<UploadedFile[]>([])
  const [toast, setToast] = useState<Toast | null>(null)
  const [filterBookmarked, setFilterBookmarked] = useState(false)

  useEffect(() => {
    const files = getExistingFiles()
    setUploadedFiles(files)
    setFilteredFiles(files)
  }, [])

  useEffect(() => {
    let results = uploadedFiles

    if (filterBookmarked) {
      results = results.filter(file => file.isBookmarked)
    }

    if (searchQuery.trim()) {
      results = results.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredFiles(results)
  }, [searchQuery, uploadedFiles, filterBookmarked])

  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToast({ id: Date.now().toString(), type, message })
  }

  const handleCopyLink = (link: string, fileName: string) => {
    navigator.clipboard.writeText(link)
    showToast("success", `Link disalin!`)
  }

  const handleDelete = (id: number, fileName: string) => {
    const existing = getExistingFiles()
    const filtered = existing.filter(file => file.id !== id)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    
    setUploadedFiles(filtered)
    showToast("info", `File dihapus`)
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return "🖼️"
    if (ext === "pdf") return "📄"
    if (["doc", "docx"].includes(ext || "")) return "📝"
    if (["ppt", "pptx"].includes(ext || "")) return "📊"
    if (["txt", "md"].includes(ext || "")) return "📃"
    return "📁"
  }

  const bookmarkedCount = uploadedFiles.filter(f => f.isBookmarked).length

  return (
    <section className="space-y-4 sm:space-y-6 mx-3 sm:mx-4 md:mx-0 py-4 sm:py-6 pb-24 md:pb-10">
      {toast && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto z-50">
          <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Header Search */}
      <header className="rounded-xl sm:rounded-2xl border-2 border-foreground bg-gradient-to-r from-teal-50 to-green-50 p-4 sm:p-6 shadow-md">
        <div className="space-y-3 sm:space-y-4">
          {/* Title Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-[#296374] rounded-lg sm:rounded-xl">
              <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Cari File</h1>
              <p className="text-xs sm:text-sm text-foreground/60 mt-0.5 sm:mt-1">
                Temukan file yang sudah kamu upload
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="flex-1 flex items-center rounded-lg sm:rounded-xl border-2 border-foreground bg-white px-3 sm:px-4 py-2.5 sm:py-3">
              <Search className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-foreground/60 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari nama file..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-foreground placeholder:text-foreground/40 outline-none text-sm min-w-0"
              />
            </div>
            <button
              onClick={() => setFilterBookmarked(!filterBookmarked)}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-foreground font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                filterBookmarked
                  ? "bg-yellow-400 text-foreground shadow-md"
                  : "bg-white text-foreground hover:bg-gray-50"
              }`}
            >
              <Star className={`h-4 w-4 ${filterBookmarked ? "fill-foreground" : ""}`} />
              <span>
                {filterBookmarked ? "Semua" : `Bookmark (${bookmarkedCount})`}
              </span>
            </button>
          </div>

          {/* Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
            <p className="text-foreground/70">
              {filteredFiles.length === uploadedFiles.length
                ? `${uploadedFiles.length} file tersedia`
                : `${filteredFiles.length} dari ${uploadedFiles.length} file`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-purple-600 hover:text-purple-700 font-medium text-left sm:text-right"
              >
                Reset pencarian
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Results Grid */}
      {filteredFiles.length > 0 ? (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file) => (
            <article
              key={file.id}
              className="rounded-xl sm:rounded-2xl border-2 border-foreground bg-white p-4 sm:p-5 transition-all hover:-translate-y-1"
            >
              {/* Header Card */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <span className="text-2xl sm:text-3xl flex-shrink-0">{getFileIcon(file.name)}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground truncate text-sm sm:text-base">
                      {file.name}
                    </h3>
                    <p className="text-xs text-foreground/60 mt-0.5">{file.size}</p>
                  </div>
                </div>
                {file.isBookmarked && (
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-500 text-yellow-500 flex-shrink-0 ml-2" />
                )}
              </div>

              {/* Info Section */}
              <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 text-xs text-foreground/60">
                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                  <span className="truncate">Upload: {file.uploadDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground/60">
                  <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                  <span className="truncate">
                    Kadaluarsa:{" "}
                    <span className="font-semibold text-foreground/80">
                      {file.expiryDate}
                    </span>
                  </span>
                </div>
              </div>

              {/* Link Display */}
              <div className="mb-3 sm:mb-4 p-2 sm:p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-xs font-mono text-blue-700 truncate">{file.link}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  onClick={() => handleCopyLink(file.link, file.name)}
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-lg border-2 border-foreground bg-white hover:bg-[#296374] text-[#296374] hover:text-white cursor-pointer transition-colors active:scale-95"
                  title="Salin link"
                >
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="text-[10px] sm:text-xs font-medium">
                    Salin
                  </span>
                </button>
                <button
                  onClick={() => window.open(file.link, "_blank")}
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-lg border-2 border-foreground bg-white hover:bg-[#296374] text-[#296374] hover:text-white transition-colors active:scale-95"
                  title="Preview"
                >
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="text-[10px] sm:text-xs font-medium">
                    Lihat
                  </span>
                </button>
                <button
                  onClick={() => handleDelete(file.id, file.name)}
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-lg border-2 border-foreground bg-white hover:bg-red-400 text-red-500 hover:text-white transition-colors active:scale-95"
                  title="Hapus"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="text-[10px] sm:text-xs font-medium">
                    Hapus
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 mb-3 sm:mb-4">
            <Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-base sm:text-lg text-foreground mb-1 sm:mb-2">
            {searchQuery ? "Tidak ada hasil" : "Belum ada file"}
          </h3>
          <p className="text-xs sm:text-sm text-foreground/60 max-w-sm mx-auto">
            {searchQuery
              ? `Tidak ditemukan file dengan nama "${searchQuery}"`
              : "Upload file pertama Anda untuk mulai mencari"}
          </p>
        </div>
      )}
    </section>
  )
}