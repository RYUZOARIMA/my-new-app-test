"use client";

import { useState } from "react";

type BookingStatus = "仮予約" | "確定" | "却下";

type Booking = {
  id: string;
  submittedAt: string;
  date: string;
  booth: string;
  name: string;
  contact: string;
  note: string;
  status: BookingStatus;
  amount: number;
  stripeSessionId: string;
  number: number;
};

const STATUS_STYLES: Record<BookingStatus, string> = {
  仮予約: "bg-amber-50 text-amber-700 border-amber-200",
  確定: "bg-emerald-50 text-emerald-700 border-emerald-200",
  却下: "bg-slate-100 text-slate-500 border-slate-200",
};

type Filter = "全て" | BookingStatus;

const FILTERS: Filter[] = ["仮予約", "確定", "却下", "全て"];

export default function AdminBookingsClient({
  initialBookings,
  initialError,
}: {
  initialBookings: Booking[];
  initialError: string | null;
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState<Filter>("仮予約");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState(initialError);

  const filtered =
    filter === "全て" ? bookings : bookings.filter((b) => b.status === filter);

  async function updateStatus(id: string, status: BookingStatus) {
    setUpdatingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "更新に失敗しました");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? "border-[color:var(--color-indigo-deep)] bg-[color:var(--color-indigo-deep)] text-white"
                : "border-[color:var(--color-border)] text-[color:var(--color-ink-soft)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-rose-600">{error}</p>}

      {filtered.length === 0 && (
        <p className="text-sm text-[color:var(--color-ink-soft)]">
          該当する申込みはありません。
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {filtered.map((b) => (
          <li
            key={b.id}
            className="rounded-lg border border-[color:var(--color-border)] bg-white/60 p-4 text-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-[color:var(--color-ink-soft)]">
                  第{b.number}件目
                </p>
                <p className="font-medium text-[color:var(--color-indigo-deep)]">
                  {b.date} ／ ブース{b.booth}
                </p>
              </div>
              <span
                className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[b.status]}`}
              >
                {b.status}
              </span>
            </div>

            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs text-[color:var(--color-ink-soft)]">
              <dt>氏名</dt>
              <dd>{b.name}</dd>
              <dt>連絡先</dt>
              <dd className="break-all">{b.contact}</dd>
              {b.note && (
                <>
                  <dt>備考</dt>
                  <dd>{b.note}</dd>
                </>
              )}
              <dt>金額</dt>
              <dd>€{b.amount.toLocaleString()}</dd>
              <dt>申込日時</dt>
              <dd>{new Date(b.submittedAt).toLocaleString("ja-JP")}</dd>
            </dl>

            {b.status === "仮予約" && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => updateStatus(b.id, "確定")}
                  disabled={updatingId === b.id}
                  className="flex-1 rounded-full bg-[color:var(--color-indigo-deep)] px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  確定にする
                </button>
                <button
                  onClick={() => updateStatus(b.id, "却下")}
                  disabled={updatingId === b.id}
                  className="flex-1 rounded-full border border-[color:var(--color-border)] px-3 py-2 text-xs font-medium text-[color:var(--color-ink-soft)] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  却下にする
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
