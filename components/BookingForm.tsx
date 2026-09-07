"use client";

import { useState } from "react";
import { BOOTHS, priceForBooth } from "@/lib/galleryData";
import type { BoothId } from "@/lib/galleryData";
import { parseDateKey } from "@/lib/date";
import BoothStatusBadge, { type BoothStatus } from "./BoothStatusBadge";

type Props = {
  dateKey: string;
  statuses: Record<BoothId, BoothStatus>;
  onSubmitted: () => void;
};

export default function BookingForm({ dateKey, statuses, onSubmitted }: Props) {
  const [booth, setBooth] = useState<BoothId | "">("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const date = parseDateKey(dateKey);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!booth) {
      setError("ブースを選択してください");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateKey, booth, name, contact, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "送信に失敗しました");
      setSuccess(true);
      setName("");
      setContact("");
      setNote("");
      setBooth("");
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        仮予約のお申込みを受け付けました。オーナーが内容を確認のうえ、追ってご連絡します。
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="ml-2 underline"
        >
          続けて別の予約を申し込む
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-[color:var(--color-border)] bg-white p-4"
    >
      <h4 className="font-serif text-[color:var(--color-indigo-deep)]">
        {date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日の仮予約
      </h4>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">ブースを選択</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {BOOTHS.map((b) => {
            const status = statuses[b.id];
            const isConfirmed = status === "確定";
            return (
              <label
                key={b.id}
                className={[
                  "flex cursor-pointer flex-col gap-1 rounded-md border p-2 text-sm",
                  isConfirmed
                    ? "cursor-not-allowed border-[color:var(--color-border)] opacity-50"
                    : booth === b.id
                    ? "border-[color:var(--color-red)] bg-[color:var(--color-paper)]"
                    : "border-[color:var(--color-border)]",
                ].join(" ")}
              >
                <span className="flex items-center justify-between">
                  <span className="font-semibold">{b.id}</span>
                  <BoothStatusBadge status={status} />
                </span>
                <span className="text-xs text-[color:var(--color-ink-soft)]">
                  {b.size} / €{priceForBooth(b, date).toLocaleString()}
                </span>
                <input
                  type="radio"
                  name="booth"
                  value={b.id}
                  disabled={isConfirmed}
                  checked={booth === b.id}
                  onChange={() => setBooth(b.id)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
        {booth && statuses[booth] === "仮予約" && (
          <p className="text-xs text-amber-700">
            このブースはすでに仮予約が入っています。送信は可能ですが、二重予約の可能性があるためオーナーが調整のうえご連絡します。
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" htmlFor="name">
          お名前
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" htmlFor="contact">
          メールアドレス
        </label>
        <input
          id="contact"
          type="email"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" htmlFor="note">
          用途・備考(任意)
        </label>
        <textarea
          id="note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-[color:var(--color-indigo-deep)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "送信中..." : "仮予約を申し込む"}
      </button>
    </form>
  );
}
