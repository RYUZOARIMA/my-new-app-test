import Image from "next/image";
import Link from "next/link";
import PriceTable from "@/components/PriceTable";
import FloorPlan from "@/components/FloorPlan";
import SectionHeading from "@/components/SectionHeading";
import { GALLERY_INFO } from "@/lib/galleryData";

const INTERIOR_PHOTOS = [
  { src: "/gallery/interior-1.jpg", alt: "ギャラリー内観1" },
  { src: "/gallery/interior-2.jpg", alt: "ギャラリー内観2(壁面)" },
  { src: "/gallery/interior-3.jpg", alt: "ギャラリー内観3(階段側)" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative flex min-h-[440px] items-end overflow-hidden sm:min-h-[560px]">
        <Image
          src="/gallery/storefront.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-indigo-ink)] via-[color:var(--color-indigo-ink)]/70 to-[color:var(--color-indigo-deep)]/10" />
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 pb-14 pt-24 text-[color:var(--color-paper)]">
          <p className="text-xs font-medium tracking-[0.3em] text-[color:var(--color-paper)]/70">
            PARIS 13E &middot; GALERIE &amp; ATELIER
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl">{GALLERY_INFO.name}</h1>
          <p className="max-w-xl text-sm text-[color:var(--color-paper)]/85">
            {GALLERY_INFO.operator} &mdash;
            パリ13区、日本のブランド・アーティストのための展示・販売・文化交流スペース。
          </p>
          <Link
            href="/booking"
            className="mt-2 inline-block w-fit rounded-full bg-[color:var(--color-red)] px-6 py-2.5 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90"
          >
            空き状況を見る・予約する
          </Link>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-14 px-6 py-16">
        <div>
          <SectionHeading eyebrow="GALLERY" title="店舗写真" />
          <div className="grid grid-cols-3 gap-3">
            {INTERIOR_PHOTOS.map((photo) => (
              <div
                key={photo.src}
                className="overflow-hidden rounded-lg border border-[color:var(--color-border)] shadow-sm"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={600}
                  height={450}
                  className="h-auto w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <SectionHeading eyebrow="ACCESS" title="アクセス" />
            <p className="mb-2 text-sm">{GALLERY_INFO.address}</p>
            <ul className="list-inside list-disc text-sm text-[color:var(--color-ink-soft)]">
              {GALLERY_INFO.access.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading eyebrow="FACILITIES" title="設備" />
            <ul className="list-inside list-disc text-sm text-[color:var(--color-ink-soft)]">
              {GALLERY_INFO.facilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="MAP" title="地図" />
          <div className="h-72 overflow-hidden rounded-lg border border-[color:var(--color-border)] shadow-sm sm:h-96">
            <iframe
              className="h-full w-full border-0"
              src="https://www.google.com/maps?q=3+rue+Edmond+Gondinet,+75013+Paris&output=embed"
              title="士道 SHIDO Gallery Parisの地図"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="DIRECTIONS" title="駅からの道のり" />
          <div className="aspect-video overflow-hidden rounded-lg border border-[color:var(--color-border)] shadow-sm">
            <iframe
              className="h-full w-full"
              src="https://www.youtube-nocookie.com/embed/o2gkVSnU34A"
              title="駅から士道 SHIDO Gallery Parisまでの道のり"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="USE CASES" title="用途" />
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
          <SectionHeading eyebrow="FLOOR PLAN" title="フロア配置" />
          <FloorPlan />
        </div>

        <div>
          <SectionHeading eyebrow="PRICING" title="料金表" />
          <PriceTable />
        </div>

        <div>
          <Link
            href="/booking"
            className="inline-block rounded-full bg-[color:var(--color-indigo-deep)] px-6 py-2.5 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90"
          >
            空き状況を見る・予約する
          </Link>
        </div>
      </section>
    </div>
  );
}
