import { Settings } from "lucide-react"

export default function SettingPage() {
  return (
    <section className="space-y-6 mx-4 md:mx-0">
      <header className="rounded-2xl border-2 border-foreground bg-background p-5 shadow-[0_8px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-foreground" />
          <h1 className="text-2xl font-semibold text-foreground">Setting</h1>
        </div>
        <p className="mt-1 text-sm text-foreground/70">Pengaturan tampilan (UI only).</p>
      </header>

      <div className="space-y-4">
        <div className="rounded-2xl border-2 border-foreground bg-background p-4 shadow-[0_6px_0_0_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-foreground">Dark Mode</h3>
              <p className="text-sm text-foreground/70">Aktif/nonaktif (dummy)</p>
            </div>
            <button
              type="button"
              className="h-9 rounded-xl border-2 border-foreground bg-yellow-400 px-4 text-sm font-medium text-foreground"
            >
              Toggle
            </button>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-foreground bg-background p-4 shadow-[0_6px_0_0_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-foreground">Email Notifications</h3>
              <p className="text-sm text-foreground/70">Atur preferensi notifikasi (dummy)</p>
            </div>
            <button
              type="button"
              className="h-9 rounded-xl border-2 border-foreground bg-secondary px-4 text-sm font-medium text-foreground"
            >
              Configure
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
