"use client";

import { useCallback, useMemo, useState } from "react";
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

type Props = {
  initialYear: number;
  initialMonth: number;
  initialBookings: Booking[];
  initialError: string | null;
};

export default function BookingClient({
  initialYear,
  initialMonth,
  initialBookings,
  initialError,
}: Props) {
  const [{ year, month }, setYearMonth] = useState({
    year: initialYear,
    month: initialMonth,
  });
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(initialError);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  // Fetches for a given month. Always called from an event handler (month
  // navigation, or after a successful booking submission) — never from an
  // effect — since the initial month's data is rendered on the server.
  const loadBookings = useCallback(async (y: number, m: number) => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/bookings?year=${y}&month=${m}`);
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
  }, []);

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
    const base = new Date(year, month - 1 + delta, 1);
    const nextYear = base.getFullYear();
    const nextMonth = base.getMonth() + 1;
    setYearMonth({ year: nextYear, month: nextMonth });
    loadBookings(nextYear, nextMonth);
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
            onSubmitted={() => loadBookings(year, month)}
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
