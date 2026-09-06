import { GALLERY_INFO } from "@/lib/galleryData";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-indigo-ink)] text-[color:var(--color-paper)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-6 py-8 text-xs">
        <p className="font-serif text-base">{GALLERY_INFO.name}</p>
        <p className="text-[color:var(--color-paper)]/70">{GALLERY_INFO.operator}</p>
        <p className="text-[color:var(--color-paper)]/70">{GALLERY_INFO.address}</p>
      </div>
      <div className="flex h-1 w-full" aria-hidden="true">
        <div className="flex-1 bg-[color:var(--color-indigo-deep)]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[color:var(--color-red)]" />
      </div>
    </footer>
  );
}
