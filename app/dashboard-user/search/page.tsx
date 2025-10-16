import { Search } from "lucide-react"

export default function SearchPage() {
  return (
    <section className="space-y-6 mx-4 md:mx-0">
      <header className="rounded-2xl border-2 border-foreground bg-background p-5 shadow-[0_8px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 flex-1 items-center rounded-xl border-2 border-foreground bg-background px-3">
            <Search className="mr-2 h-4 w-4 text-foreground/80" aria-hidden="true" />
            <span className="text-sm text-foreground/60">Search anything…</span>
          </div>
          <button
            className="h-10 rounded-xl border-2 border-foreground bg-sky-300 font-[poppins] px-4 text-sm font-medium text-foreground"
            type="button"
          >
            Search
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <article
            key={i}
            className="rounded-2xl border-2 border-foreground bg-background p-4 shadow-[0_6px_0_0_rgba(0,0,0,1)]"
          >
            <h3 className="font-medium text-foreground">Result {i + 1}</h3>
            <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
              Deskripsi singkat hasil pencarian untuk tampilan gaya playful.
            </p>
            <div className="mt-3 h-2 w-20 rounded-full border border-foreground bg-secondary" />
          </article>
        ))}
      </div>
    </section>
  )
}
