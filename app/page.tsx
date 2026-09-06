import Link from "next/link";
import PriceTable from "@/components/PriceTable";
import { GALLERY_INFO } from "@/lib/galleryData";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-[color:var(--color-indigo-deep)] text-[color:var(--color-paper)]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-16">
          <p className="text-sm tracking-wide text-[color:var(--color-gold)]">
            {GALLERY_INFO.operator}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl">{GALLERY_INFO.name}</h1>
          <p className="max-w-xl text-sm text-[color:var(--color-paper)]/80">
            パリ13区、日本のブランド・アーティストのための展示・販売・文化交流スペース。
          </p>
          <Link
            href="/booking"
            className="mt-2 inline-block w-fit rounded-md bg-[color:var(--color-gold)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-indigo-deep)] transition-opacity hover:opacity-90"
          >
            空き状況を見る・予約する
          </Link>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 font-serif text-xl text-[color:var(--color-indigo-deep)]">
              アクセス
            </h2>
            <p className="mb-2 text-sm">{GALLERY_INFO.address}</p>
            <ul className="list-inside list-disc text-sm text-[color:var(--color-ink-soft)]">
              {GALLERY_INFO.access.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-serif text-xl text-[color:var(--color-indigo-deep)]">
              設備
            </h2>
            <ul className="list-inside list-disc text-sm text-[color:var(--color-ink-soft)]">
              {GALLERY_INFO.facilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-serif text-xl text-[color:var(--color-indigo-deep)]">
            用途
          </h2>
          <div className="flex flex-wrap gap-2">
            {GALLERY_INFO.uses.map((use) => (
              <span
                key={use}
                className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-paper)] px-3 py-1 text-xs text-[color:var(--color-indigo-deep)]"
              >
                {use}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-serif text-xl text-[color:var(--color-indigo-deep)]">
            料金表
          </h2>
          <PriceTable />
        </div>

        <div>
          <Link
            href="/booking"
            className="inline-block rounded-md bg-[color:var(--color-indigo-deep)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            空き状況を見る・予約する
          </Link>
        </div>
      </section>
    </div>
  );
}
