"use client"

import type React from "react"

import {
  Settings,
  Download,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  FileText,
  Bell,
  Palette,
  X,
  User,
  Crown,
  Lock,
  Camera,
  Mail,
  Moon,
  Sun,
  Trash2,
  Upload,
} from "lucide-react"
import { useState, useEffect } from "react"

interface SettingsState {
  darkMode: boolean
  autoDeleteExpired: boolean
  defaultExpiryLevel: string
  notifyBeforeExpiry: boolean
}

interface UserAccount {
  name: string
  email: string
  photoUrl: string
}

interface Toast {
  id: string
  type: "success" | "error" | "info"
  message: string
}

const SETTINGS_KEY = "appSettings"
const UPLOADED_FILES_KEY = "uploadedFiles"
const USER_ACCOUNT_KEY = "userAccount"
const PREMIUM_STATUS_KEY = "premiumStatus"

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

  const Icon = toast.type === "success" ? CheckCircle : AlertCircle

  return (
    <div className={`${bgColor} text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="font-medium text-sm">{toast.message}</p>
    </div>
  )
}

const ModalWrapper = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) => {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-300 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h3 className="font-bold text-lg text-foreground">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 rotate-90" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  )
}

export default function SettingPage() {
  const [settings, setSettings] = useState<SettingsState>({
    darkMode: false,
    autoDeleteExpired: false,
    defaultExpiryLevel: "3mo",
    notifyBeforeExpiry: true,
  })
  const [userAccount, setUserAccount] = useState<UserAccount>({
    name: "Pengguna",
    email: "user@example.com",
    photoUrl: "https://i.pravatar.cc/96?img=12",
  })
  const [isPremium, setIsPremium] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [editFormData, setEditFormData] = useState<UserAccount>({
    name: "",
    email: "",
    photoUrl: "",
  })
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    const savedSettings = window.sessionStorage.getItem(SETTINGS_KEY)
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }

    const savedAccount = window.localStorage.getItem(USER_ACCOUNT_KEY)
    if (savedAccount) {
      try {
        setUserAccount(JSON.parse(savedAccount))
      } catch (error) {
        console.error("Error loading account:", error)
      }
    }

    const savedPremium = window.localStorage.getItem(PREMIUM_STATUS_KEY)
    if (savedPremium) {
      setIsPremium(JSON.parse(savedPremium))
    }
  }, [])

  const saveSettings = (newSettings: SettingsState) => {
    setSettings(newSettings)
    window.sessionStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
  }

  const saveUserAccount = (account: UserAccount) => {
    setUserAccount(account)
    window.localStorage.setItem(USER_ACCOUNT_KEY, JSON.stringify(account))
  }

  const handleEditAccount = () => {
    if (!editFormData.name || !editFormData.email) {
      showToast("error", "Nama dan email tidak boleh kosong!")
      return
    }

    if (newPassword && newPassword !== confirmPassword) {
      showToast("error", "Password tidak cocok!")
      return
    }

    saveUserAccount(editFormData)
    if (newPassword) {
      showToast("success", "Akun dan password berhasil diperbarui!")
    } else {
      showToast("success", "Akun berhasil diperbarui!")
    }
    setNewPassword("")
    setConfirmPassword("")
    setActiveModal(null)
  }

  const handleUpgradePremium = () => {
    setIsPremium(true)
    window.localStorage.setItem(PREMIUM_STATUS_KEY, JSON.stringify(true))
    showToast("success", "Selamat! Anda sekarang premium member!")
    setActiveModal(null)
  }

  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToast({ id: Date.now().toString(), type, message })
  }

  const toggleSetting = (key: keyof SettingsState) => {
    const newSettings = { ...settings, [key]: !settings[key] }
    saveSettings(newSettings)
    showToast("success", "Pengaturan diperbarui!")
  }

  const updateSetting = (key: keyof SettingsState, value: string) => {
    const newSettings = { ...settings, [key]: value }
    saveSettings(newSettings)
    showToast("success", "Pengaturan tersimpan!")
  }

  const exportData = () => {
    const files = window.localStorage.getItem(UPLOADED_FILES_KEY)
    const data = {
      settings,
      files: files ? JSON.parse(files) : [],
      exportDate: new Date().toISOString(),
    }
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `sinikirim-backup-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
    showToast("success", "Data berhasil diekspor!")
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        if (imported.settings) saveSettings(imported.settings)
        if (imported.files) {
          window.localStorage.setItem(UPLOADED_FILES_KEY, JSON.stringify(imported.files))
        }
        showToast("success", "Data berhasil diimpor!")
        setActiveModal(null)
      } catch (error) {
        showToast("error", "File tidak valid!")
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = () => {
    window.localStorage.removeItem(UPLOADED_FILES_KEY)
    window.sessionStorage.removeItem(SETTINGS_KEY)
    setSettings({
      darkMode: false,
      autoDeleteExpired: false,
      defaultExpiryLevel: "3mo",
      notifyBeforeExpiry: true,
    })
    setShowDeleteModal(false)
    showToast("success", "Semua data berhasil dihapus!")
  }

  const getTotalFiles = () => {
    if (typeof window === "undefined") return 0

    const files = window.localStorage.getItem(UPLOADED_FILES_KEY)
    try {
      const parsed = files ? JSON.parse(files) : []
      return Array.isArray(parsed) ? parsed.length : 0
    } catch {
      return 0
    }
  }

  const settingsMenu = [
    {
      id: "account",
      icon: User,
      title: "Edit Akun",
      description: "Ubah profil, password, dan foto",
      color: "indigo",
    },
    {
      id: "premium",
      icon: Crown,
      title: "Premium",
      description: isPremium ? "Anda sudah premium member" : "Upgrade ke premium sekarang",
      color: "yellow",
    },
    {
      id: "appearance",
      icon: Palette,
      title: "Tampilan",
      description: "Tema dan preferensi visual",
      color: "purple",
    },
    {
      id: "files",
      icon: FileText,
      title: "Pengelolaan File",
      description: "Atur perilaku file upload",
      color: "blue",
    },
    {
      id: "notifications",
      icon: Bell,
      title: "Notifikasi",
      description: "Pengingat dan pemberitahuan",
      color: "orange",
    },
    {
      id: "data",
      icon: Download,
      title: "Data & Backup",
      description: "Ekspor, impor, dan hapus data",
      color: "green",
    },
  ]

  return (
    <section className="space-y-4 sm:space-y-6 mx-3 sm:mx-4 md:mx-0 py-4 sm:py-6 pb-24 md:pb-10">
      {toast && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto z-50">
          <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
      )}

      <ModalWrapper isOpen={activeModal === "account"} onClose={() => setActiveModal(null)} title="Edit Akun">
        <div className="space-y-4">
          {/* Foto Profil */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Foto Profil</label>
            <div className="flex items-center gap-4">
              <img
                src={editFormData.photoUrl || userAccount.photoUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-indigo-500 bg-indigo-50 text-indigo-600 font-medium cursor-pointer hover:bg-indigo-100 transition-colors">
                <Camera className="h-4 w-4" />
                <span className="text-sm">Ubah Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        setEditFormData({ ...editFormData, photoUrl: event.target?.result as string })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Nama */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              placeholder="Masukkan nama Anda"
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-gray-50">
              <Mail className="h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                placeholder="Masukkan email Anda"
                className="flex-1 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-foreground text-sm mb-3">Ubah Password</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1.5">Password Baru</label>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-200 focus-within:border-indigo-500 transition-colors">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password baru"
                    className="flex-1 bg-transparent focus:outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1.5">Konfirmasi Password</label>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-200 focus-within:border-indigo-500 transition-colors">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Konfirmasi password baru"
                    className="flex-1 bg-transparent focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-foreground bg-white text-foreground font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleEditAccount}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-foreground bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      </ModalWrapper>

      <ModalWrapper isOpen={activeModal === "premium"} onClose={() => setActiveModal(null)} title="Premium Membership">
        <div className="space-y-6">
          {/* Status */}
          <div
            className={`p-4 rounded-xl border-2 ${isPremium ? "bg-yellow-50 border-yellow-300" : "bg-gray-50 border-gray-200"}`}
          >
            <div className="flex items-center gap-3">
              <Crown className={`h-6 w-6 ${isPremium ? "text-yellow-500" : "text-gray-400"}`} />
              <div>
                <p className="font-semibold text-foreground">{isPremium ? "Premium Member" : "Free Member"}</p>
                <p className="text-xs text-foreground/60 mt-0.5">
                  {isPremium ? "Nikmati semua fitur premium!" : "Upgrade untuk akses fitur eksklusif"}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Fitur Premium</h4>
            <div className="space-y-2">
              {[
                "Upload file tanpa batas",
                "Penyimpanan hingga 100GB",
                "Prioritas support 24/7",
                "Analitik file lengkap",
                "Sharing link custom",
                "Backup otomatis harian",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${isPremium ? "text-green-500" : "text-gray-300"}`} />
                  <span className={`text-sm ${isPremium ? "text-foreground" : "text-foreground/60"}`}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          {!isPremium && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-foreground">Rp 99.000</span>
                <span className="text-sm text-foreground/60">/bulan</span>
              </div>
              <p className="text-xs text-foreground/60">Pembayaran berulang, bisa dibatalkan kapan saja</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-foreground bg-white text-foreground font-medium hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
            {!isPremium && (
              <button
                onClick={handleUpgradePremium}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-foreground bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <Crown className="h-4 w-4" />
                Upgrade Sekarang
              </button>
            )}
          </div>
        </div>
      </ModalWrapper>

      <ModalWrapper isOpen={activeModal === "appearance"} onClose={() => setActiveModal(null)} title="Tampilan">
        <div className="space-y-4">
          {/* Dark Mode */}
          <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.darkMode ? (
                  <Moon className="h-5 w-5 text-purple-600" />
                ) : (
                  <Sun className="h-5 w-5 text-purple-600" />
                )}
                <div>
                  <p className="font-semibold text-foreground text-sm">Mode Gelap</p>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    {settings.darkMode ? "Mode gelap aktif" : "Gunakan mode terang"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting("darkMode")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.darkMode ? "bg-purple-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-purple-50 border-2 border-purple-200">
            <p className="text-xs text-foreground/70">
              Preferensi tampilan akan disimpan dan diterapkan di seluruh aplikasi.
            </p>
          </div>

          {/* Button */}
          <button
            onClick={() => setActiveModal(null)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-foreground bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors"
          >
            Selesai
          </button>
        </div>
      </ModalWrapper>

      <ModalWrapper isOpen={activeModal === "files"} onClose={() => setActiveModal(null)} title="Pengelolaan File">
        <div className="space-y-4">
          {/* Auto Delete */}
          <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground text-sm">Hapus Otomatis</p>
                <p className="text-xs text-foreground/60 mt-0.5">Hapus file yang sudah kadaluarsa secara otomatis</p>
              </div>
              <button
                onClick={() => toggleSetting("autoDeleteExpired")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.autoDeleteExpired ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.autoDeleteExpired ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Default Expiry */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Waktu Kadaluarsa Default</label>
            <select
              value={settings.defaultExpiryLevel}
              onChange={(e) => updateSetting("defaultExpiryLevel", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="1d">1 Hari</option>
              <option value="7d">7 Hari</option>
              <option value="30d">30 Hari</option>
              <option value="3mo">3 Bulan</option>
              <option value="1y">1 Tahun</option>
            </select>
          </div>

          {/* Notify Before Expiry */}
          <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground text-sm">Notifikasi Sebelum Kadaluarsa</p>
                <p className="text-xs text-foreground/60 mt-0.5">Ingatkan sebelum file dihapus</p>
              </div>
              <button
                onClick={() => toggleSetting("notifyBeforeExpiry")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.notifyBeforeExpiry ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.notifyBeforeExpiry ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={() => setActiveModal(null)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-foreground bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            Selesai
          </button>
        </div>
      </ModalWrapper>

      <ModalWrapper isOpen={activeModal === "notifications"} onClose={() => setActiveModal(null)} title="Notifikasi">
        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground text-sm">Notifikasi Email</p>
                <p className="text-xs text-foreground/60 mt-0.5">Terima update melalui email</p>
              </div>
              <button className="relative w-12 h-6 rounded-full bg-orange-500 transition-colors">
                <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground text-sm">Notifikasi Push</p>
                <p className="text-xs text-foreground/60 mt-0.5">Notifikasi real-time di browser</p>
              </div>
              <button className="relative w-12 h-6 rounded-full bg-gray-300 transition-colors">
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </div>

          {/* File Upload Alerts */}
          <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground text-sm">Alert Upload File</p>
                <p className="text-xs text-foreground/60 mt-0.5">Notifikasi saat file berhasil diunggah</p>
              </div>
              <button className="relative w-12 h-6 rounded-full bg-orange-500 transition-colors">
                <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={() => setActiveModal(null)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-foreground bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
          >
            Selesai
          </button>
        </div>
      </ModalWrapper>

      <ModalWrapper isOpen={activeModal === "data"} onClose={() => setActiveModal(null)} title="Data & Backup">
        <div className="space-y-4">
          {/* File Count */}
          <div className="p-4 rounded-lg bg-green-50 border-2 border-green-200">
            <p className="text-sm text-foreground/70">
              Total file yang tersimpan: <span className="font-bold text-green-600">{getTotalFiles()} file</span>
            </p>
          </div>

          {/* Export Data */}
          <button
            onClick={exportData}
            className="w-full p-4 rounded-lg border-2 border-green-300 bg-green-50 hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600 text-sm">Ekspor Data</span>
          </button>

          {/* Import Data */}
          <label className="w-full p-4 rounded-lg border-2 border-green-300 bg-green-50 hover:bg-green-100 transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600 text-sm">Impor Data</span>
            <input type="file" accept=".json" onChange={importData} className="sr-only" />
          </label>

          {/* Delete All Data */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full p-4 rounded-lg border-2 border-red-300 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
            <span className="font-medium text-red-600 text-sm">Hapus Semua Data</span>
          </button>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <>
              <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowDeleteModal(false)} />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                  className="bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in-95 duration-300 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">Hapus Semua Data?</h4>
                        <p className="text-xs text-foreground/60 mt-1">Tindakan ini tidak dapat dibatalkan</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="flex-1 px-4 py-2.5 rounded-xl border-2 border-foreground bg-white text-foreground font-medium hover:bg-gray-50 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={clearAllData}
                        className="flex-1 px-4 py-2.5 rounded-xl border-2 border-foreground bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Button */}
          <button
            onClick={() => setActiveModal(null)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-foreground bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
          >
            Selesai
          </button>
        </div>
      </ModalWrapper>

      {/* Header */}
      <header className="rounded-xl sm:rounded-2xl border-2 border-foreground bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-indigo-500 rounded-lg sm:rounded-xl">
            <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Pengaturan</h1>
            <p className="text-xs sm:text-sm text-foreground/60 mt-0.5 sm:mt-1">Kelola preferensi aplikasi</p>
          </div>
        </div>
      </header>

      {/* Settings Menu List */}
      <div className="space-y-3">
        {settingsMenu.map((menu) => {
          const Icon = menu.icon
          const colorClasses = {
            indigo: "bg-indigo-100 text-indigo-600",
            yellow: "bg-yellow-100 text-yellow-600",
            purple: "bg-purple-100 text-purple-600",
            blue: "bg-blue-100 text-blue-600",
            orange: "bg-orange-100 text-orange-600",
            green: "bg-green-100 text-green-600",
          }[menu.color]

          return (
            <button
              key={menu.id}
              onClick={() => setActiveModal(menu.id)}
              className="w-full rounded-xl sm:rounded-2xl border-2 border-foreground bg-white p-4 sm:p-5 shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl ${colorClasses}`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-foreground text-sm sm:text-base">{menu.title}</h3>
                    <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">{menu.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-foreground/40 flex-shrink-0 cursor-pointer" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Info Card */}
      <div className="rounded-xl sm:rounded-2xl border-2 border-foreground bg-blue-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-1">Catatan</h4>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
              Pengaturan tersimpan di browser Anda. Data file ada di localStorage dan pengaturan di sessionStorage.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
