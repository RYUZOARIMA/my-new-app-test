import { BOOTHS } from "@/lib/galleryData";
import type { BoothId } from "@/lib/galleryData";

const sizeOf = (id: BoothId) => BOOTHS.find((b) => b.id === id)?.size ?? "";

function Booth({
  id,
  x,
  y,
  w,
  h,
}: {
  id: BoothId;
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill="var(--color-paper)"
        stroke="var(--color-indigo-deep)"
        strokeWidth={1.5}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 - 4}
        textAnchor="middle"
        fontSize={18}
        fontWeight={600}
        fill="var(--color-indigo-deep)"
      >
        {id}
      </text>
      <text
        x={x + w / 2}
        y={y + h / 2 + 14}
        textAnchor="middle"
        fontSize={9}
        fill="var(--color-ink-soft)"
      >
        {sizeOf(id)}
      </text>
    </g>
  );
}

function Pillar({ x, y }: { x: number; y: number }) {
  return (
    <rect
      x={x}
      y={y}
      width={12}
      height={12}
      fill="var(--color-ink-soft)"
      opacity={0.5}
    />
  );
}

export default function FloorPlan() {
  return (
    <div className="overflow-x-auto rounded-lg border border-[color:var(--color-border)] bg-white p-4">
      <svg viewBox="0 0 640 400" className="mx-auto w-full max-w-xl">
        <text
          x={320}
          y={20}
          textAnchor="middle"
          fontSize={11}
          letterSpacing={2}
          fill="var(--color-red)"
        >
          歩道 ── STREET SIDE
        </text>

        {/* Room outline */}
        <rect
          x={40}
          y={40}
          width={560}
          height={320}
          fill="none"
          stroke="var(--color-indigo-deep)"
          strokeWidth={2}
        />

        {/* Show windows along the street-facing wall, split by the entrance */}
        <rect x={40} y={32} width={230} height={16} fill="var(--color-indigo-deep)" />
        <rect x={370} y={32} width={230} height={16} fill="var(--color-indigo-deep)" />
        <text x={155} y={44} textAnchor="middle" fontSize={9} fill="white">
          ショーウインド
        </text>
        <text x={485} y={44} textAnchor="middle" fontSize={9} fill="white">
          ショーウインド
        </text>

        {/* Front row: B, A near the show windows */}
        <Booth id="B" x={70} y={64} w={150} h={90} />
        <Booth id="A" x={420} y={64} w={130} h={90} />
        <Pillar x={230} y={100} />
        <Pillar x={400} y={100} />

        {/* Middle row: D (left wall), C (center), E (right wall) */}
        <Booth id="D" x={70} y={168} w={110} h={100} />
        <Booth id="C" x={255} y={168} w={130} h={100} />
        <Booth id="E" x={460} y={168} w={110} h={100} />

        {/* Wall display strip along the right wall */}
        <rect
          x={578}
          y={168}
          width={14}
          height={180}
          fill="var(--color-red)"
          opacity={0.15}
          stroke="var(--color-red)"
        />
        <text
          x={585}
          y={260}
          textAnchor="middle"
          fontSize={8}
          fill="var(--color-red)"
          transform="rotate(90 585 260)"
        >
          壁面ディスプレイ
        </text>

        {/* Back row: F, support desk (left, under E), 140cm display shelf + stairs (right, under D) */}
        <Booth id="F" x={255} y={290} w={130} h={60} />

        <rect
          x={70}
          y={300}
          width={110}
          height={40}
          rx={4}
          fill="none"
          stroke="var(--color-ink-soft)"
          strokeDasharray="3 3"
        />
        <text x={125} y={323} textAnchor="middle" fontSize={9} fill="var(--color-ink-soft)">
          サポートデスク
        </text>

        <rect
          x={460}
          y={310}
          width={80}
          height={30}
          rx={4}
          fill="none"
          stroke="var(--color-ink-soft)"
          strokeDasharray="3 3"
        />
        <text x={500} y={329} textAnchor="middle" fontSize={9} fill="var(--color-ink-soft)">
          階段
        </text>

        <rect x={430} y={350} width={150} height={16} fill="var(--color-gold, #a97a26)" opacity={0.3} />
        <text x={505} y={362} textAnchor="middle" fontSize={8} fill="var(--color-ink-soft)">
          140cm高さの飾り台
        </text>
      </svg>
      <p className="mt-2 text-center text-xs text-[color:var(--color-ink-soft)]">
        ※実際の縮尺とは異なる簡易イメージ図です
      </p>
    </div>
  );
}
