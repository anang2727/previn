"use client"

import { createClient } from "@/utils/client" // Pastikan path benar
import { Search, Star, Copy, Trash2, Eye, Calendar, Clock, Loader2 } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { toast as sonnerToast } from "sonner"

interface UploadedFile {
  id: number
  name: string
  size: string
  link: string
  uploadDate: string
  expiryDate: string
  is_bookmarked: boolean
  storage_path: string
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<UploadedFile[]>([])
  const [filterBookmarked, setFilterBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // 1. Fungsi Fetch Data dari Supabase
  const fetchFiles = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      if (data) {
        const formattedFiles: UploadedFile[] = data.map((f: any) => ({
          id: f.id,
          name: f.file_name,
          size: `${(f.file_size / (1024 * 1024)).toFixed(2)} MB`,
          link: `${window.location.origin}/preview/${f.short_link_code}`,
          uploadDate: new Date(f.created_at).toLocaleDateString('id-ID'),
          expiryDate: "Tak Terbatas",
          is_bookmarked: f.is_bookmarked || false,
          storage_path: f.storage_path
        }))
        setUploadedFiles(formattedFiles)
        setFilteredFiles(formattedFiles)
      }
    } catch (error) {
      console.error("Error:", error)
      sonnerToast.error("Gagal mengambil data dari cloud")
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  // Panggil fetchFiles saat komponen pertama kali dimuat
  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  // 2. Logika Filter & Search (Client Side)
  useEffect(() => {
    let results = uploadedFiles
    if (filterBookmarked) results = results.filter(file => file.is_bookmarked)
    if (searchQuery.trim()) {
      results = results.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    setFilteredFiles(results)
  }, [searchQuery, uploadedFiles, filterBookmarked])

  // 3. Fungsi Aksi
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    sonnerToast.success("Link berhasil disalin!")
  }

  const handleDelete = async (file: UploadedFile) => {
    if (!confirm(`Hapus permanen file ${file.name}?`)) return

    try {
      // Hapus dari Storage
      await supabase.storage.from("user-files").remove([file.storage_path])

      // Hapus dari Database
      const { error } = await supabase.from("files").delete().eq("id", file.id)
      if (error) throw error

      setUploadedFiles(prev => prev.filter(f => f.id !== file.id))
      sonnerToast.success("File dihapus dari cloud")
    } catch (error) {
      sonnerToast.error("Gagal menghapus file")
    }
  }

  const toggleBookmark = async (file: UploadedFile) => {
    try {
      const newStatus = !file.is_bookmarked
      console.log("Mengupdate ID:", file.id, "dengan status:", newStatus);
      const { error } = await supabase
        .from("files")
        .update({ is_bookmarked: newStatus })
        .eq("id", file.id)

      if (error) {
        console.error("Error saat update bookmark:", error);
        throw error
      }

      setUploadedFiles(prev =>
        prev.map(f => f.id === file.id ? { ...f, is_bookmarked: newStatus } : f)
      )
      sonnerToast.success(newStatus ? "BookMark Sukses" : "BookMark Terhapus")
    } catch (error) {
      console.error("Bookmark Error:", error)
      sonnerToast.error("Gagal memperbarui bookmark")
    }
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "webp"].includes(ext || "")) return "🖼️"
    if (ext === "pdf") return "📄"
    if (ext === "txt") return "📃"
    return "📁"
  }


  return (
    <section className="space-y-4 sm:space-y-6 mx-3 sm:mx-4 md:mx-0 py-4 sm:py-6 pb-24 md:pb-10">

      {/* Header Search */}
      <header className="flex flex-col sm:flex-row sm:items-center gap-3">

        {/* Search Bar */}
        <div className="flex-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-[#296374] focus-within:ring-2 focus-within:ring-[#296374]/10 transition-all">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari file di cloud..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-slate-300 hover:text-slate-500 transition-colors">
              ✕
            </button>
          )}
        </div>

        {/* Bookmark Filter */}
        <button
          onClick={() => setFilterBookmarked(!filterBookmarked)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all shrink-0 ${filterBookmarked
            ? "bg-amber-400 border-amber-400 text-white"
            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
        >
          <Star size={15} className={filterBookmarked ? "fill-white" : ""} />
          Bookmark
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${filterBookmarked ? "bg-white/30 text-white" : "bg-slate-100 text-slate-500"
            }`}>
            {uploadedFiles.filter(f => f.is_bookmarked).length}
          </span>
        </button>

      </header>

      {/* Grid List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-[#296374]" size={40} />
          <p className="text-slate-500 font-medium">Menghubungkan ke cloud...</p>
        </div>
      ) : filteredFiles.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
          {filteredFiles.map((file) => (
            <article key={file.id} className="relative rounded-xl border border-slate-200 bg-white p-4 hover:border-[#296374] hover:shadow-md transition-all group hover:bg-[#296374]">

              <button onClick={() => toggleBookmark(file)} className="absolute top-3 right-3">
                <Star className={`w-4 h-4 ${file.is_bookmarked ? "fill-amber-400 text-amber-400" : "text-slate-300 group-hover:text-slate-500"}`} />
              </button>

              {/* Icon + Name */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl group-hover:text-white">{getFileIcon(file.name)}</span>
                <h3 className="font-semibold text-sm truncate text-slate-800 flex-1 group-hover:text-white">{file.name}</h3>
              </div>

              {/* Meta info */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-3">
                <span>{file.size}</span>
                <span>{file.uploadDate}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-1.5">
                <button onClick={() => handleCopyLink(file.link)} className="cursor-pointer flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors">
                  <Copy size={13} /><span className="text-[10px] font-medium">Copy</span>
                </button>
                <button onClick={() => window.open(file.link, "_blank")} className="cursor-pointer flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors">
                  <Eye size={13} /><span className="text-[10px] font-medium">View</span>
                </button>
                <button onClick={() => handleDelete(file)} className="cursor-pointer flex items-center justify-center px-2 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>

            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-400 font-medium">Tidak ada file ditemukan</p>
        </div>
      )}
    </section>
  )
}