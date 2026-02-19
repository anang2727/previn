"use client"
import { useState, useEffect } from "react"
import { User } from "@supabase/supabase-js"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { createClient } from "@/utils/supabase/client"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

const STORAGE_KEY = "uploadedFiles"

interface DashboardContentProps {
    user: User;
}

const getUploadFilesCount = (): number => {
    if (typeof window === "undefined") return 0

    const storageData = window.localStorage.getItem(STORAGE_KEY)

    try {
        const parsed = storageData ? JSON.parse(storageData) : []
        return Array.isArray(parsed) ? parsed.length : 0
    } catch (error) {
        console.error("Error parsing uploaded files from localStorage:", error)
        return 0
    }
}

const getUsedStorageBytes = (): number => {
    if (typeof window === "undefined") return 0

    const storedData = window.localStorage.getItem(STORAGE_KEY)
    return storedData ? storedData.length * 2 : 0
}

const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

const generateData = (days: number) => {
    const data = []
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const day = date.getDate()
        const month = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][date.getMonth()]
        data.push({
            date: `${day} ${month}`,
            viewers: Math.floor(Math.random() * 500) + 100,
        })
    }
    return data
}

const formatTime = (date: Date) => {
    const h = date.getHours().toString().padStart(2, "0")
    const m = date.getMinutes().toString().padStart(2, "0")
    const s = date.getSeconds().toString().padStart(2, "0")
    return `${h}:${m}:${s}`
}

const formatDate = (date: Date) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ]
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export default function DashboardContent({ user }: DashboardContentProps) {
    const router = useRouter()
    // const supabase = createBrowserClient(
    //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // )
    const supabase = createClient()
    
    const [currentTime, setCurrentTime] = useState<Date>(new Date())
    const [filter, setFilter] = useState("7")
    const [stats, setStats] = useState(generateData(7))
    const [totalViewers, setTotalViewers] = useState(0)
    const [totalFiles, setTotalFiles] = useState(0)
    const [usedStorageText, setUsedStorageText] = useState("0 Bytes")
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [notifications, setNotifications] = useState([
        { id: 1, message: "File baru berhasil diunggah", time: "5 menit lalu", read: false },
        { id: 2, message: "Kuota penyimpanan hampir penuh", time: "1 jam lalu", read: false },
        { id: 3, message: "Sistem maintenance selesai", time: "2 jam lalu", read: true },
    ])

    const FREE_QUOTA_BYTES = 5 * 1024 * 1024 * 1024
    const FREE_QUOTA_TEXT = formatBytes(FREE_QUOTA_BYTES)

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            alert("Gagal logout: " + error.message)
        } else {
            router.push("/login")
            router.refresh()
        }
    }

    // HANYA SATU BLOK useEffect UNTUK MENGURUS SEMUA LOGIKA STORAGE (Total Files & Used Bytes)
    useEffect(() => {
        setIsClient(true)
        const updateStorageData = () => {
            const fileCount = getUploadFilesCount()
            setTotalFiles(fileCount) // 👈 Mengurus totalFiles di sini

            const currentUsedBytes = getUsedStorageBytes()
            setUsedStorageText(formatBytes(currentUsedBytes)) // 👈 Mengurus usedStorageText di sini
        }

        updateStorageData()

        const handleStorageChange = () => {
            updateStorageData()
        }

        // Hanya satu listener yang terdaftar
        window.addEventListener("storage", handleStorageChange)

        return () => {
            window.removeEventListener("storage", handleStorageChange)
        }
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const days = Number.parseInt(filter)
        const newData = generateData(days)
        setStats(newData)
        setTotalViewers(newData.reduce((sum, item) => sum + item.viewers, 0))
    }, [filter])

    const getGreeting = () => {
        const hour = currentTime.getHours()
        if (hour < 12) return "Selamat Pagi"
        if (hour < 17) return "Selamat Siang"
        if (hour < 19) return "Selamat Sore"
        return "Selamat Malam"
    }

    const markNotificationAsRead = (id: number) => {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (!target.closest("[data-dropdown]")) {
                setShowNotifications(false)
                setShowUserMenu(false)
            }
        }
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    return (
        <div className="relative min-h-screen bg-sky-50 flex flex-col">
            <div className="relative px-6 pt-6 pb-6 md:pt-8 md:pb-8 md:px-10 bg-gradient-to-r from-sky-50 to-blue-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-14 w-14 border-2 border-black">
                                <AvatarImage src="https://i.pravatar.cc/96?img=12" alt="Foto profil Anang Kurniawan" />
                                <AvatarFallback>AK</AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{getGreeting()}</h1>
                            <p className="text-sm text-gray-600">{user?.user_metadata?.full_name || user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Notification Button */}
                        <div className="relative" data-dropdown>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2.5 hover:bg-white rounded-full transition-colors border-2 border-transparent hover:border-black"
                            >
                                <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                {notifications.some((n) => !n.read) && (
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50">
                                    <div className="p-4 border-b-2 border-black">
                                        <h3 className="font-bold text-gray-900">Notifikasi</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => markNotificationAsRead(notif.id)}
                                                    className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.read ? "bg-blue-50" : ""}`}
                                                >
                                                    <div className="flex items-start gap-2">
                                                        {!notif.read && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="text-sm text-gray-900 font-medium">{notif.message}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500 text-sm">Tidak ada notifikasi</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Menu Button */}
                        <div className="relative" data-dropdown>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="cursor-pointer p-2.5 hover:bg-white rounded-full transition-colors border-2 border-transparent hover:border-black"
                            >
                                <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </button>

                            {/* User Menu Dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50">
                                    <div className="p-4 border-b-2 border-black">
                                        <p className="text-sm font-semibold text-gray-900">{user?.user_metadata?.full_name || user?.email}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <button className="cursor-pointer w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                            👤 Profil
                                        </button>
                                        <button className="cursor-pointer w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                            ⚙️ Pengaturan
                                        </button>
                                        <button className="cursor-pointer w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                            💾 Penyimpanan
                                        </button>
                                    </div>
                                    <div className="border-t-2 border-black p-2 cursor-pointer"
                                        onClick={handleLogout}>
                                        <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                                            🚪 Keluar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative flex-1">
                <section
                    className="relative bg-white rounded-t-[40px] border-2 border-black 
                     overflow-y-auto px-6 py-8 z-10"
                >
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="grid grid-cols-1 gap-4 md:gap-6">
                                <div className="p-4 rounded-2xl bg-yellow-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <h2 className="text-2xl font-bold text-gray-800">{formatTime(currentTime)}</h2>
                                    <p className="text-gray-700 text-xs mt-0.5">{formatDate(currentTime)}</p>
                                </div>

                                <div className="p-4 rounded-2xl bg-sky-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <h2 className="text-lg font-semibold text-gray-800">File Tersimpan</h2>
                                    <p className="text-gray-700 text-xs mt-0.5">
                                        {totalFiles === 0 ? "Belum ada file yang diunggah." : "Jumlah File yang diunggah"}
                                    </p>
                                    <div className="mt-2">
                                        <span className="text-2xl font-bold text-gray-800">{totalFiles.toLocaleString("id-ID")}</span>
                                        <span className="text-xs text-gray-600 ml-1">file</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-red-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">

                                {/* Konten Atas (akan didorong ke atas) */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Kuota Penyimpanan</h2>
                                    <p className="text-gray-700 text-xs mt-0.5">Upgrade untuk kapasitas file lebih besar!</p>
                                    <div className="mt-2">
                                        <span className="text-2xl font-bold text-gray-800">{usedStorageText}</span>
                                        <span className="text-xs text-gray-600 ml-1">/ {FREE_QUOTA_TEXT}</span>
                                    </div>

                                    <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ width: `${((getUsedStorageBytes() / FREE_QUOTA_BYTES) * 100).toFixed(2)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Tombol Bawah (akan didorong ke paling bawah) */}
                                <div className="mt-auto"> {/* mt-auto memastikan ada ruang vertikal penuh di atas tombol */}
                                    <button className="cursor-pointer mt-2 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-3 rounded-lg border-2 border-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5 transition-all">
                                        Upgrade ke Premium
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-purple-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Statistik Penonton</h2>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        Total: <span className="font-bold">{totalViewers.toLocaleString("id-ID")}</span> penonton
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilter("7")}
                                        className={`px-3 py-1.5 text-sm rounded-lg border-2 border-black font-medium transition-colors ${filter === "7" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                                    >
                                        7 Hari
                                    </button>
                                    <button
                                        onClick={() => setFilter("30")}
                                        className={`px-3 py-1.5 text-sm rounded-lg border-2 border-black font-medium transition-colors ${filter === "30" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                                    >
                                        30 Hari
                                    </button>
                                    <button
                                        onClick={() => setFilter("90")}
                                        className={`px-3 py-1.5 text-sm rounded-lg border-2 border-black font-medium transition-colors ${filter === "90" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
                                    >
                                        90 Hari
                                    </button>
                                </div>
                            </div>

                            <div className="h-40 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                        <XAxis dataKey="date" stroke="#374151" style={{ fontSize: "10px" }} />
                                        <YAxis stroke="#374151" style={{ fontSize: "10px" }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#fff",
                                                border: "2px solid #000",
                                                borderRadius: "8px",
                                                fontSize: "12px",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="viewers"
                                            stroke="#7c3aed"
                                            strokeWidth={2}
                                            dot={{ fill: "#7c3aed", strokeWidth: 2, r: 3 }}
                                            activeDot={{ r: 5 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="h-20"></div>
                    </div>
                </section>
            </div>
        </div>
    )
}
