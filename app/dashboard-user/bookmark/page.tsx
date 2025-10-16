import { Bookmark } from "lucide-react"

export default function BookmarkPage() {
  return (
    <section className="space-y-6 mx-4 md:mx-0">
      <header className="rounded-2xl border-2 border-foreground bg-background p-5 shadow-[0_8px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <Bookmark className="h-5 w-5 text-foreground" />
          <h1 className="text-2xl font-semibold text-foreground">Bookmark</h1>
        </div>
        <p className="mt-1 text-sm text-foreground/70">Daftar item tersimpan (dummy).</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(8)].map((_, i) => (
          <article
            key={i}
            className="rounded-2xl border-2 border-foreground bg-background p-4 shadow-[0_6px_0_0_rgba(0,0,0,1)]"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-foreground">Item {i + 1}</h3>
              <span className="rounded-full border border-foreground bg-secondary px-2 py-0.5 text-xs text-foreground">
                Saved
              </span>
            </div>
            <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
              Deskripsi singkat untuk item yang dibookmark.
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
