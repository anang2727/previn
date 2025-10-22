"use client"

import { Upload, X, FileText, Copy, Trash2, CheckCircle, AlertCircle, Eye, MoreVertical, Zap, Star } from "lucide-react"
import { useState, useEffect, useRef } from "react"
// Import mammoth untuk konversi DOCX ke HTML
import * as mammoth from "mammoth"
// Asumsi type UploadedFile dan ChangeEvent ada di sini
import type { UploadedFile, ChangeEvent } from "@/types/index" // Ganti dengan path yang benar jika berbeda

type ExpiryLevel = "3mo" | "6mo" | "unlimited";

const EXPIRY_OPTIONS: { [key in ExpiryLevel]: { label: string; months: number | null; price: string } } = {
    "3mo": { label: "3 Bulan", months: 3, price: "Rp 50.000" },
    "6mo": { label: "6 Bulan", months: 6, price: "Rp 90.000" },
    "unlimited": { label: "Unlimited", months: null, price: "Rp 150.000" },
};

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

const saveFileMetadata = (fileName: string, fileSize: number, fileContent: string, level: ExpiryLevel): string => {
    const existingFiles = getExistingFiles()
    const today = new Date()
    let expiryDateString: string;
    const levelData = EXPIRY_OPTIONS[level];

    if (levelData.months !== null) {
        const expiryDateObj = new Date(today);
        expiryDateObj.setMonth(today.getMonth() + levelData.months);
        expiryDateString = expiryDateObj.toLocaleDateString("id-ID");
    } else {
        expiryDateString = "Seumur Hidup";
    }

    const newFile: UploadedFile = {
        id: Date.now(),
        name: fileName,
        size: (fileSize / 1024 / 1024).toFixed(2) + " MB",
        link: `sinikirim.id/file-${Math.random().toString(36).substring(2, 8)}`,
        uploadDate: today.toLocaleDateString("id-ID"),
        expiryDate: expiryDateString,
        content: fileContent,
        isBookmarked: false,
    }

    existingFiles.unshift(newFile)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existingFiles))
    return newFile.link
}

const deleteFile = (id: number) => {
    const existingFiles = getExistingFiles()
    const filtered = existingFiles.filter((file) => file.id !== id)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

const toggleBookmark = (id: number) => {
    const existingFiles = getExistingFiles()
    const updated = existingFiles.map((file) =>
        file.id === id ? { ...file, isBookmarked: !file.isBookmarked } : file
    )
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

interface Toast {
    id: string
    type: "success" | "error" | "info"
    message: string
}

const Toast = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000)
        return () => clearTimeout(timer)
    }, [onClose])

    const bgColor = {
        success: "bg-emerald-500",
        error: "bg-red-500",
        info: "bg-blue-500",
    }[toast.type]

    const Icon = toast.type === "success" ? CheckCircle : AlertCircle

    return (
        <div
            className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300`}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <p className="font-medium">{toast.message}</p>
        </div>
    )
}

interface PreviewModalProps {
    file: UploadedFile | null
    onClose: () => void
}

const PreviewModal = ({ file, onClose }: PreviewModalProps) => {
    if (!file) return null

    const getFileType = (fileName: string) => {
        const ext = fileName.split(".").pop()?.toLowerCase()
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return "image"
        if (ext === "pdf") return "pdf"
        if (["docx"].includes(ext || "")) return "html"
        if (["txt", "md", "json", "csv", "xml", "doc", "ppt", "pptx"].includes(ext || "")) return "text"
        return "other"
    }

    const fileType = getFileType(file.name)
    const isImage = fileType === "image"
    const isPdf = fileType === "pdf"
    const isHtmlDocx = fileType === "html"
    const isWarningContent = file.content?.startsWith('[PERINGATAN BINARY]') || file.content?.startsWith('[ERROR PREVIEW]');


    if (!file.content) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div
                    className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 animate-in fade-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                        <h3 className="font-bold text-lg text-foreground">Preview Gagal</h3>
                    </div>
                    <p className="text-sm text-gray-600">Konten file tidak dapat ditampilkan. Ini mungkin karena file terlalu besar atau format file tidak dapat diurai di sisi klien.</p>
                    <button onClick={onClose} className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors">Tutup</button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-auto animate-in fade-in zoom-in-95 duration-300 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                    <h3 className="font-bold text-lg text-foreground truncate">{file.name}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {isImage && file.content ? (
                        <div className="flex items-center justify-center">
                            <img
                                src={file.content}
                                alt={file.name}
                                className="max-w-full max-h-96 rounded-lg shadow-md"
                            />
                        </div>
                    ) :
                        isPdf && file.content ? (
                            <div
                                className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden"
                                style={{ height: "600px" }}
                            >
                                <embed src={file.content} type="application/pdf" width="100%" height="100%" className="rounded-lg" />
                            </div>
                        ) :
                            isHtmlDocx && file.content ? (
                                <div className="bg-gray-50 rounded-lg p-6 overflow-auto max-h-96 border border-gray-200">
                                    <div className="prose max-w-none break-words" dangerouslySetInnerHTML={{ __html: file.content }} />
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96 border border-gray-200">
                                    {isWarningContent && (
                                        <h4 className={`font-bold text-base mb-2 ${file.content.startsWith('[ERROR PREVIEW]') ? 'text-red-600' : 'text-yellow-600'}`}>
                                            {file.content.startsWith('[ERROR PREVIEW]') ? '⚠️ Gagal Mengurai Dokumen' : '🚨 Preview Teks Mentah (Nty)'}
                                        </h4>
                                    )}
                                    <pre className="whitespace-pre-wrap break-words text-foreground">
                                        {file.content.length > 5000
                                            ? "Konten file terlalu panjang untuk ditampilkan sebagai teks penuh. Hanya beberapa karakter pertama yang dibaca: " + file.content.substring(0, 500) + "..."
                                            : file.content
                                        }
                                    </pre>
                                </div>
                            )}
                </div>
            </div>
        </div>
    )
}

interface FileActionsMenuProps {
    file: UploadedFile
    onPreview: () => void
    onCopy: () => void
    onDelete: () => void
    onBookmark: () => void
    isOpen: boolean
    onToggle: () => void
}

const FileActionsMenu = ({ file, onPreview, onCopy, onDelete, onBookmark, isOpen, onToggle }: FileActionsMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onToggle()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            return () => document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onToggle])

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={onToggle}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                title="Lebih banyak aksi"
            >
                <MoreVertical className="h-4 w-4 text-gray-600" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                        onClick={() => {
                            onBookmark()
                            onToggle()
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-yellow-50 transition-colors flex items-center gap-2 border-b border-gray-100"
                    >
                        <Star className={`h-4 w-4 ${file.isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium text-foreground">
                            {file.isBookmarked ? 'Hapus Bookmark' : 'Bookmark'}
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            onPreview()
                            onToggle()
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-2 border-b border-gray-100"
                    >
                        <Eye className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-foreground">Preview</span>
                    </button>
                    <button
                        onClick={() => {
                            onCopy()
                            onToggle()
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-2 border-b border-gray-100"
                    >
                        <Copy className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-foreground">Salin Link</span>
                    </button>
                    <button
                        onClick={() => {
                            onDelete()
                            onToggle()
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-600">Hapus</span>
                    </button>
                </div>
            )}
        </div>
    )
}


export default function UploadPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [toast, setToast] = useState<Toast | null>(null)
    const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)
    const [openMenuId, setOpenMenuId] = useState<number | null>(null)
    const [expiryLevel, setExpiryLevel] = useState<ExpiryLevel>("3mo")
    const [showBookmarked, setShowBookmarked] = useState<boolean>(false)

    const MAX_SIZE_BYTES = 20 * 1024 * 1024

    useEffect(() => {
        setUploadedFiles(getExistingFiles())
    }, [])

    const showToast = (type: "success" | "error" | "info", message: string) => {
        setToast({
            id: Date.now().toString(),
            type,
            message,
        })
    }

    const handleFileChange = (event: ChangeEvent) => {
        const file = event.target.files?.[0]

        if (file) {
            if (file.size > MAX_SIZE_BYTES) {
                showToast("error", "File terlalu besar! Maksimal 20 MB.")
                setSelectedFile(null)
                return
            }

            const allowedExtensions = /\.(pdf|ppt|pptx|doc|docx|jpg|jpeg|png|txt|md|json)$/i;
            if (!file.type.match(/(pdf|presentation|document|image|text)/) && !file.name.match(allowedExtensions)) {
                showToast("error", "Tipe file tidak didukung! Hanya PDF, PPT, DOC, Gambar, atau Text.")
                setSelectedFile(null)
                return
            }
            setSelectedFile(file)
        }
    }

    const readFileContent = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onerror = reject

            const fileNameLower = file.name.toLowerCase();

            if (fileNameLower.endsWith('.docx')) {
                reader.onload = async (e) => {
                    try {
                        const arrayBuffer = e.target?.result as ArrayBuffer;

                        const options = {
                            convertImage: mammoth.images.imgElement(function (image) {
                                return image.read("base64").then(function (imageBuffer) {
                                    return {
                                        src: "data:" + image.contentType + ";base64," + imageBuffer
                                    };
                                });
                            })
                        };

                        const result = await mammoth.convertToHtml({ arrayBuffer }, options);
                        resolve(result.value);
                    } catch (error: any) {
                        console.error("Mammoth error (DOCX):", error);
                        resolve(`[ERROR PREVIEW] Gagal menguraikan file DOCX. Ini mungkin bukan format DOCX yang valid atau file rusak. Detail: ${error.message}`);
                    }
                };
                reader.readAsArrayBuffer(file);
            }
            else if (file.type.startsWith("image/") || file.type === "application/pdf") {
                reader.onload = (e) => resolve(e.target?.result as string)
                reader.readAsDataURL(file)
            }
            else {
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    if (fileNameLower.endsWith('.pptx') || fileNameLower.endsWith('.ppt') || fileNameLower.endsWith('.doc')) {
                        resolve(`[PERINGATAN BINARY] Format ${fileNameLower.toUpperCase()} adalah file biner kompleks. Preview ini hanya menampilkan teks mentah yang tidak dapat dibaca ('Nty' / PK...). Harap unduh file untuk melihat konten sebenarnya. \n\n Konten Mentah Awal: \n\n ${content}`);
                    } else {
                        resolve(content);
                    }
                }
                reader.readAsText(file)
            }
        })
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            showToast("error", "Pilih file dulu sebelum upload!")
            return
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            showToast("info", "File Anda besar. Preview mungkin gagal karena batasan penyimpanan browser.")
        }

        setIsUploading(true)

        try {
            const fileContent = await readFileContent(selectedFile)

            setTimeout(() => {
                if (selectedFile) {
                    try {
                        saveFileMetadata(selectedFile.name, selectedFile.size, fileContent, expiryLevel)

                        setUploadedFiles(getExistingFiles())
                        showToast("success", `File "${selectedFile.name}" berhasil diupload!`)
                    } catch (e) {
                        if (e instanceof DOMException && e.name === "QuotaExceededError") {
                            showToast("error", "Konten file terlalu besar. Hanya metadata yang tersimpan (link).")
                        } else {
                            showToast("error", "Gagal menyimpan file metadata.")
                        }
                    } finally {
                        setSelectedFile(null)
                        setIsUploading(false)
                    }
                }
            }, 1500)
        } catch (error) {
            console.error("Error reading file:", error)
            showToast("error", "Gagal membaca file!")
            setIsUploading(false)
        }
    }

    const handleDeleteFile = (id: number, fileName: string) => {
        deleteFile(id)
        setUploadedFiles(getExistingFiles())
        showToast("info", `File "${fileName}" telah dihapus.`)
    }

    const handleCopyLink = (link: string) => {
        navigator.clipboard.writeText(link)
        showToast("success", "Link disalin ke clipboard!")
    }

    const handleToggleBookmark = (id: number, fileName: string, isCurrentlyBookmarked: boolean) => {
        toggleBookmark(id)
        setUploadedFiles(getExistingFiles())
        showToast("success", isCurrentlyBookmarked ? `Bookmark "${fileName}" dihapus` : `"${fileName}" ditambahkan ke bookmark`)
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const filteredFiles = showBookmarked
        ? uploadedFiles.filter(file => file.isBookmarked)
        : uploadedFiles

    const bookmarkedCount = uploadedFiles.filter(f => f.isBookmarked).length

    return (
        <section className="space-y-8 mx-4 md:mx-0 py-8 pb-24 md:pb-10">
            {toast && (
                <div className="fixed top-4 right-4 z-50">
                    <Toast toast={toast} onClose={() => setToast(null)} />
                </div>
            )}

            <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />

            <header className="rounded-2xl border-2 border-foreground bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-500 rounded-xl">
                        <Upload className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Unggah Dokumen</h1>
                        <p className="text-sm text-foreground/60 mt-1">Bagikan file Anda dengan aman dan mudah</p>
                    </div>
                </div>
            </header>

            <div className="rounded-2xl border-2 border-foreground bg-white p-8 shadow-md">
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-12">
                    <div className="inline-flex items-center gap-2 text-gray-800 px-4 py-2">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm font-medium">Pilih File Dokumen</span>
                    </div>

                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer rounded-lg border-2 border-gray-700 bg-sky-400 text-white px-6 py-3 font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                        {selectedFile ? "📁 Pilih File Lain" : "📁 Pilih Dokumen"}
                    </label>
                    <input id="file-upload" type="file" onChange={handleFileChange} disabled={isUploading} className="sr-only" />

                    <p className="text-xs text-foreground/60 text-center">
                        Maksimal <span className="font-semibold">20 MB</span>. Format: PDF, DOCX, DOC, PPTX, Gambar, atau Text.
                    </p>
                </div>

                {selectedFile && (
                    <div className="mt-8 space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-lg font-bold text-foreground">File Terpilih:</h2>

                        <div className="flex items-center justify-between rounded-xl border border-gray-800 p-5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-lg">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{selectedFile.name}</p>
                                    <p className="text-sm text-foreground/60">{formatBytes(selectedFile.size)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedFile(null)}
                                disabled={isUploading}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-red-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Zap className="h-5 w-5 text-yellow-600" />
                                Pilih Masa Berlaku Link:
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                {(Object.keys(EXPIRY_OPTIONS) as ExpiryLevel[]).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setExpiryLevel(key)}
                                        className={`rounded-xl p-4 transition-all border-2 ${expiryLevel === key
                                                ? "border-blue-500 bg-blue-50 shadow-md"
                                                : "border-gray-200 bg-white hover:border-gray-400"
                                            }`}
                                        disabled={isUploading}
                                    >
                                        <p className="font-bold text-base text-foreground">
                                            {EXPIRY_OPTIONS[key].label}
                                        </p>
                                        <p className="text-sm text-blue-600 font-semibold mt-1">
                                            {EXPIRY_OPTIONS[key].price}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {key === "unlimited" ? "Selamanya" : "Perlu Beli"}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>


                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading}
                            className={`w-full rounded-xl py-4 text-lg font-bold transition-all ${!isUploading
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                }`}
                        >
                            {isUploading ? "⏳ Mengunggah..." : "✨ Buat Link Sekarang!"}
                        </button>
                    </div>
                )}
            </div>

            {uploadedFiles.length > 0 && (
                <div className="rounded-2xl border-2 border-foreground bg-white p-8 shadow-md">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">📋 Riwayat Upload</h2>
                        <button
                            onClick={() => setShowBookmarked(!showBookmarked)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${showBookmarked
                                    ? 'bg-yellow-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Star className={`h-4 w-4 ${showBookmarked ? 'fill-white' : ''}`} />
                            <span className="font-medium text-sm">
                                {showBookmarked ? 'Semua File' : `Bookmark (${bookmarkedCount})`}
                            </span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        {filteredFiles.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-foreground truncate">{file.name}</p>
                                            {file.isBookmarked && (
                                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-foreground/60">
                                            {file.uploadDate} • Kadaluarsa: {file.expiryDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleToggleBookmark(file.id, file.name, file.isBookmarked || false)}
                                        className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                                        title={file.isBookmarked ? "Hapus bookmark" : "Bookmark file"}
                                    >
                                        <Star className={`h-4 w-4 ${file.isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
                                    </button>
                                    <button
                                        onClick={() => setPreviewFile(file)}
                                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                        title="Preview file"
                                    >
                                        <Eye className="h-4 w-4 text-blue-500" />
                                    </button>
                                    <button
                                        onClick={() => handleCopyLink(file.link)}
                                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                        title="Salin link"
                                    >
                                        <Copy className="h-4 w-4 text-blue-500" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteFile(file.id, file.name)}
                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                        title="Hapus file"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>

                                <FileActionsMenu
                                    file={file}
                                    onPreview={() => setPreviewFile(file)}
                                    onCopy={() => handleCopyLink(file.link)}
                                    onDelete={() => handleDeleteFile(file.id, file.name)}
                                    onBookmark={() => handleToggleBookmark(file.id, file.name, file.isBookmarked || false)}
                                    isOpen={openMenuId === file.id}
                                    onToggle={() => setOpenMenuId(openMenuId === file.id ? null : file.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {uploadedFiles.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-foreground/60 font-medium">Belum ada file yang diupload</p>
                    <p className="text-sm text-foreground/40 mt-1">Upload file pertama Anda untuk melihat riwayat di sini</p>
                </div>
            )}
        </section>
    )
}