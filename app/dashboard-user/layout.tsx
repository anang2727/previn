import type { ReactNode } from "react"
import TopNav from "@/app/components/molecules/dashboard-user/navbar/TopNav"
import BottomNav from "@/app/components/molecules/dashboard-user/navbar/BottomNav"

export default function DashboardUserLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-sky-50"> 
      {/* bg di sini agar full 100% width & height */}
      <TopNav />

      <main
        className="
          flex-1
          relative
          pt-4
          max-w-7xl mx-auto
          w-full
        "
      >
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
