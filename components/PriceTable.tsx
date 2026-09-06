import { BOOTHS } from "@/lib/galleryData";

export default function PriceTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-[color:var(--color-border)]">
      <table className="w-full min-w-[480px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-[color:var(--color-indigo-deep)] text-[color:var(--color-paper)]">
            <th className="px-4 py-3 font-medium">ブース</th>
            <th className="px-4 py-3 font-medium">サイズ</th>
            <th className="px-4 py-3 font-medium">平日(火〜金)</th>
            <th className="px-4 py-3 font-medium">土・日</th>
          </tr>
        </thead>
        <tbody>
          {BOOTHS.map((booth, i) => (
            <tr
              key={booth.id}
              className={i % 2 === 0 ? "bg-[color:var(--color-paper)]" : "bg-white"}
            >
              <td className="px-4 py-3 font-semibold text-[color:var(--color-indigo-deep)]">
                {booth.id}
              </td>
              <td className="px-4 py-3">{booth.size}</td>
              <td className="px-4 py-3">€{booth.weekdayPrice.toLocaleString()}</td>
              <td className="px-4 py-3">€{booth.weekendPrice.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-[color:var(--color-border)] px-4 py-3 text-xs text-[color:var(--color-ink-soft)]">
        貸出時間 11:00〜17:00 ／ 月曜定休
      </p>
    </div>
  );
}
