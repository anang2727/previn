'use client'
import { useState, useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Data dummy untuk statistik
const generateData = (days: number) => {
  const data = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const day = date.getDate()
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][date.getMonth()]
    data.push({
      date: `${day} ${month}`,
      viewers: Math.floor(Math.random() * 500) + 100
    })
  }
  return data
}

const formatTime = (date: Date) => {
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  const s = date.getSeconds().toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

const formatDate = (date: Date) => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export default function DashboardUserPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [filter, setFilter] = useState('7')
  const [stats, setStats] = useState(generateData(7))
  const [totalViewers, setTotalViewers] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const days = parseInt(filter)
    const newData = generateData(days)
    setStats(newData)
    setTotalViewers(newData.reduce((sum, item) => sum + item.viewers, 0))
  }, [filter])

  return (
    // 1. **Wrapper Utama**: Gunakan `h-screen overflow-y-auto` untuk mengaktifkan scrolling di level ini. 
    // `overflow-y-auto` pada wrapper dan bukan pada `body` karena kita membutuhkan `flex flex-col`.
    <div className="relative h-screen overflow-y-auto bg-sky-50 flex flex-col">
    
      {/* Header/Welcome: Biarkan tetap di atas dan ikut ter-scroll */}
      <div className="relative px-6 pt-3 pb-4 md:pt-0 md:pb-4 md:px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://i.pravatar.cc/96?img=12" alt="Foto profil Anang Kurniawan" />
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
              <p className="text-gray-600">Anang Kurniawan</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Wrapper Section: Hapus `flex-1` dan buat relatif */}
      <div className="relative"> 
        {/* 3. Section: 
            - Gunakan **`sticky top-0`** agar menempel di bagian atas saat di-scroll.
            - Gunakan **`h-[calc(100vh-X)]`** untuk mengisi sisa viewport di bawah header.
              (Jika header sekitar 100px, maka `h-[calc(100vh-100px)]` akan memastikan bagian bawah section menyentuh batas bawah viewport).
            - Gunakan **`overflow-hidden`** untuk mencegah scrolling di dalam section.
            - **z-10** untuk memastikan section ada di atas jika ada elemen lain.
        */}
        <section 
          className="sticky top-0 bg-white rounded-t-[40px] border-2 border-black 
                     h-[calc(100vh-70px)] lg:h-[calc(100vh-92px)] overflow-hidden 
                     px-6 py-8 z-10"
        >
          <div className="max-w-7xl mx-auto space-y-6 h-full"> {/* h-full di sini penting */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-yellow-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-3xl font-bold text-gray-800">
                  {formatTime(currentTime)}
                </h2>
                <p className="text-gray-700 text-sm mt-1">
                  {formatDate(currentTime)}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-sky-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-xl font-semibold text-gray-800">File Tersimpan</h2>
                <p className="text-gray-700 text-sm mt-1">Belum ada file diunggah.</p>
                <div className="mt-3">
                  <span className="text-3xl font-bold text-gray-800">0</span>
                  <span className="text-sm text-gray-600 ml-2">file</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Statistik Penonton</h2>
                  <p className="text-xs text-gray-600 mt-0.5">Total: <span className="font-bold">{totalViewers.toLocaleString('id-ID')}</span> penonton</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setFilter('7')} className={`px-3 py-1.5 text-sm rounded-lg border-2 border-black font-medium transition-colors ${filter === '7' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}>
                    7 Hari
                  </button>
                  <button onClick={() => setFilter('30')} className={`px-3 py-1.5 text-sm rounded-lg border-2 border-black font-medium transition-colors ${filter === '30' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}>
                    30 Hari
                  </button>
                  <button onClick={() => setFilter('90')} className={`px-3 py-1.5 text-sm rounded-lg border-2 border-black font-medium transition-colors ${filter === '90' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}>
                    90 Hari
                  </button>
                </div>
              </div>

              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="date" stroke="#374151" style={{ fontSize: '10px' }} />
                    <YAxis stroke="#374151" style={{ fontSize: '10px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #000', borderRadius: '8px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="viewers" stroke="#7c3aed" strokeWidth={2} dot={{ fill: '#7c3aed', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Ruang kosong yang memastikan section setinggi viewport dan kontennya tidak terpotong (jika ada) */}
          </div>
        </section>
      </div>

      {/* 4. Padding tambahan di bagian bawah agar ada ruang scroll. Ini **penting**
         agar header bisa menghilang. Padding ini efektif menggantikan konten dummy. */}
      <div className="h-[200px] bg-sky-50"></div>
    </div>
  )
}