import Image from "next/image"
import Link from "next/link"

const navItems = [
  { href: "/dashboard-user", label: "Home" },
  { href: "/dashboard-user/search", label: "Search" },
  { href: "/dashboard-user/upload", label: "Upload" },
  { href: "/dashboard-user/bookmark", label: "Bookmark" },
  { href: "/dashboard-user/setting", label: "Setting" },
]

export default function TopNav() {
  return (
    <header
      className="
        hidden md:block sticky top-0 z-50
        bg-transparent
        backdrop-blur-none
      "
      aria-label="Top navigation"
    >
      {/* Container transparan */}
      <div className="max-w-7xl mx-auto px-4 mt-3">
        <div
          className="
            h-14 flex items-center justify-between
            rounded-2xl border-2 border-black
            bg-white/20 backdrop-blur-lg 
            px-5 transition-all
          "
        >
          {/* Logo kiri */}
          <Link
            href="/dashboard-user"
            className="flex items-center gap-2 shrink-0"
            aria-label="Go to dashboard"
          >
            <Image
              src="https://avatars.githubusercontent.com/u/110589660?v=4"
              alt="Logo"
              width={24}
              height={24}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-sm font-semibold text-gray-800">
              Prev-in
            </span>
          </Link>

          {/* Menu kanan */}
          <nav className="flex items-center gap-1" aria-label="Primary">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="
                  inline-flex items-center gap-2 rounded-md
                  px-3 py-2 text-sm font-medium
                  text-gray-700 hover:text-gray-900
                  hover:bg-white/30 transition-colors
                "
              >
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
