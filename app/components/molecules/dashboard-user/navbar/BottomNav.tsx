"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bookmark, Home, Search, Settings, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard-user", label: "Home", icon: Home },
  { href: "/dashboard-user/search", label: "Search", icon: Search },
  { href: "/dashboard-user/upload", label: "Upload", icon: Upload },
  { href: "/dashboard-user/bookmark", label: "Bookmark", icon: Bookmark },
  { href: "/dashboard-user/setting", label: "Setting", icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()

  // Tentukan item aktif berdasar path saat ini
  const activeIndex = Math.max(
    0,
    navItems.findIndex((i) =>
      i.href === "/dashboard-user"
        ? pathname === i.href || pathname?.startsWith("/dashboard-user")
        : pathname?.startsWith(i.href),
    ),
  )

  return (
    <nav
      className="
        md:hidden fixed inset-x-0 bottom-0 z-50
        pointer-events-none
        bg-transparent
      "
      aria-label="Bottom navigation"
    >
      <div className="max-w-7xl mx-auto px-4 pb-[env(safe-area-inset-bottom)] pointer-events-none">
        <div className="flex justify-center pointer-events-auto">
          <div
            className={cn(
              "relative z-10 w-[min(92%,28rem)]",
              "rounded-2xl border-2 border-foreground bg-background",
              // Shadow dengan underscore dan warna lebih gelap
              "shadow-[4px_3px_0px_0px_rgba(77,170,217,1)]",
              "-translate-y-2.5",
              "px-2 py-1",
            )}
          >
            {/* Indikator aktif bergeser halus (pill biru dengan outline) */}
            <div
              className={cn(
                "pointer-events-none absolute left-0 top-1/2 -translate-y-1/2",
                "h-10 w-[20%] rounded-xl",
                "bg-primary/90 border-2 border-foreground",
                "transition-transform duration-300 ease-out",
              )}
              style={{
                transform: `translateX(${activeIndex * 100}%) translateY(-50%)`,
              }}
              aria-hidden="true"
            />

            {/* Grid item */}
            <div className="relative z-10 grid grid-cols-5 gap-1">
              {navItems.map(({ href, label, icon: Icon }, idx) => {
                const isActive = idx === activeIndex
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group relative isolate",
                      "flex flex-col items-center justify-center gap-1",
                      "h-12 rounded-xl",
                      "text-[11px] leading-none",
                      // Warna dasar
                      "text-foreground/80",
                      // Hover/press micro-interactions
                      "transition-all duration-200 ease-out",
                      "hover:text-foreground active:translate-y-[1px]",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        "group-hover:-translate-y-0.5",
                        isActive ? "text-foreground" : "text-foreground/80",
                      )}
                      aria-hidden="true"
                    />
                    <span className={cn("sr-only sm:not-sr-only sm:contents")}>{label}</span>

                    {/* Badge aksen kecil saat hover, mengikuti palet kuning */}
                    <span
                      className={cn(
                        "absolute -bottom-1.5 h-1.5 w-6 rounded-full",
                        "bg-secondary border border-foreground/70",
                        "opacity-0 group-hover:opacity-100 transition-opacity",
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
