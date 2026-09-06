import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--color-border)] bg-[color:var(--color-paper)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-lg text-[color:var(--color-indigo-deep)]">
            士道
          </span>
          <span className="text-[11px] tracking-[0.2em] text-[color:var(--color-ink-soft)]">
            SHIDO GALLERY PARIS
          </span>
        </Link>
        <Link
          href="/booking"
          className="rounded-full bg-[color:var(--color-red)] px-4 py-1.5 text-xs font-medium tracking-wide text-white transition-opacity hover:opacity-90"
        >
          予約する
        </Link>
      </div>
    </header>
  );
}
