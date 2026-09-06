"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { isClosedDay } from "@/lib/galleryData";
import type { BoothId } from "@/lib/galleryData";
import MonthCalendar, { ALL_BOOTH_IDS, buildMonthDays } from "./MonthCalendar";
import BookingForm from "./BookingForm";
import type { BoothStatus } from "./BoothStatusBadge";

type Booking = {
  id: string;
  date: string;
  booth: BoothId;
  status: "仮予約" | "確定" | "却下";
};

function startingYearMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export default function BookingClient() {
  const [{ year, month }, setYearMonth] = useState(startingYearMonth);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/bookings?year=${year}&month=${month}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "取得に失敗しました");
      setBookings(data.bookings ?? []);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "空き状況の取得に失敗しました"
      );
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const statusesByDate = useMemo(() => {
    const map = new Map<string, Record<BoothId, BoothStatus>>();
    for (const b of bookings) {
      if (!map.has(b.date)) {
        const base = {} as Record<BoothId, BoothStatus>;
        for (const id of ALL_BOOTH_IDS) base[id] = "空き";
        map.set(b.date, base);
      }
      const entry = map.get(b.date)!;
      if (b.status === "確定") entry[b.booth] = "確定";
      else if (b.status === "仮予約" && entry[b.booth] !== "確定") {
        entry[b.booth] = "仮予約";
      }
    }
    return map;
  }, [bookings]);

  const statusesForDate = useCallback(
    (dateKey: string): Record<BoothId, BoothStatus> => {
      const existing = statusesByDate.get(dateKey);
      if (existing) return existing;
      const base = {} as Record<BoothId, BoothStatus>;
      for (const id of ALL_BOOTH_IDS) base[id] = "空き";
      return base;
    },
    [statusesByDate]
  );

  const dayInfos = useMemo(
    () => buildMonthDays(year, month, isClosedDay, statusesForDate),
    [year, month, statusesForDate]
  );

  function goToMonth(delta: number) {
    setSelectedDateKey(null);
    setYearMonth(({ year, month }) => {
      const base = new Date(year, month - 1 + delta, 1);
      return { year: base.getFullYear(), month: base.getMonth() + 1 };
    });
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="md:w-1/2">
        <MonthCalendar
          year={year}
          month={month}
          dayInfos={dayInfos}
          selectedDateKey={selectedDateKey}
          onSelectDate={setSelectedDateKey}
          onPrevMonth={() => goToMonth(-1)}
          onNextMonth={() => goToMonth(1)}
        />
        {loading && (
          <p className="mt-2 text-xs text-[color:var(--color-ink-soft)]">
            空き状況を読み込み中...
          </p>
        )}
        {loadError && (
          <p className="mt-2 text-xs text-rose-600">{loadError}</p>
        )}
      </div>

      <div className="md:w-1/2">
        {selectedDateKey ? (
          <BookingForm
            dateKey={selectedDateKey}
            statuses={statusesForDate(selectedDateKey)}
            onSubmitted={loadBookings}
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[color:var(--color-border)] p-8 text-center text-sm text-[color:var(--color-ink-soft)]">
            カレンダーから予約したい日付を選択してください
          </div>
        )}
      </div>
    </div>
  );
}
