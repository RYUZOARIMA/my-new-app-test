"use client";

import { BOOTHS } from "@/lib/galleryData";
import type { BoothId } from "@/lib/galleryData";
import { formatDateKey, startOfToday, WEEKDAY_LABELS } from "@/lib/date";
import type { BoothStatus } from "./BoothStatusBadge";

export type DayInfo = {
  date: Date;
  dateKey: string;
  inCurrentMonth: boolean;
  isClosed: boolean;
  isPast: boolean;
  statuses: Record<BoothId, BoothStatus>;
};

type Props = {
  year: number;
  month: number; // 1-12
  dayInfos: DayInfo[];
  selectedDateKey: string | null;
  onSelectDate: (dateKey: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

function summarize(statuses: Record<BoothId, BoothStatus>): BoothStatus {
  const values = Object.values(statuses);
  if (values.every((s) => s === "確定")) return "確定";
  if (values.some((s) => s === "確定" || s === "仮予約")) return "仮予約";
  return "空き";
}

const SUMMARY_DOT: Record<BoothStatus, string> = {
  空き: "bg-emerald-500",
  仮予約: "bg-amber-500",
  確定: "bg-rose-500",
};

export default function MonthCalendar({
  year,
  month,
  dayInfos,
  selectedDateKey,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: Props) {
  return (
    <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          className="rounded px-3 py-1 text-sm text-[color:var(--color-indigo-deep)] hover:bg-[color:var(--color-paper)]"
        >
          ← 前月
        </button>
        <h3 className="font-serif text-lg text-[color:var(--color-indigo-deep)]">
          {year}年{month}月
        </h3>
        <button
          type="button"
          onClick={onNextMonth}
          className="rounded px-3 py-1 text-sm text-[color:var(--color-indigo-deep)] hover:bg-[color:var(--color-paper)]"
        >
          翌月 →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-[color:var(--color-ink-soft)]">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1 font-medium">
            {label}
          </div>
        ))}
        {dayInfos.map((day) => {
          const isSelected = day.dateKey === selectedDateKey;
          const disabled = !day.inCurrentMonth || day.isClosed || day.isPast;
          const summary = summarize(day.statuses);

          return (
            <button
              key={day.dateKey}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDate(day.dateKey)}
              className={[
                "flex flex-col items-center gap-1 rounded-md py-2 text-sm transition-colors",
                !day.inCurrentMonth ? "text-transparent" : "",
                disabled
                  ? "cursor-not-allowed text-[color:var(--color-ink-soft)]/50"
                  : "cursor-pointer hover:bg-[color:var(--color-paper)]",
                isSelected
                  ? "ring-2 ring-[color:var(--color-gold)] bg-[color:var(--color-paper)]"
                  : "",
              ].join(" ")}
            >
              <span>{day.date.getDate()}</span>
              {day.inCurrentMonth && !day.isClosed && !day.isPast && (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${SUMMARY_DOT[summary]}`}
                />
              )}
              {day.inCurrentMonth && day.isClosed && (
                <span className="text-[10px]">定休</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-[color:var(--color-ink-soft)]">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />空き
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          一部仮予約あり
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          満枠(確定)
        </span>
      </div>
    </div>
  );
}

export function buildMonthDays(
  year: number,
  month: number,
  isClosedFn: (d: Date) => boolean,
  statusesForDate: (dateKey: string) => Record<BoothId, BoothStatus>
): DayInfo[] {
  const firstOfMonth = new Date(year, month - 1, 1);
  const startWeekday = firstOfMonth.getDay();
  const gridStart = new Date(year, month - 1, 1 - startWeekday);
  const today = startOfToday();

  const days: DayInfo[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i
    );
    const dateKey = formatDateKey(date);
    days.push({
      date,
      dateKey,
      inCurrentMonth: date.getMonth() === month - 1,
      isClosed: isClosedFn(date),
      isPast: date < today,
      statuses: statusesForDate(dateKey),
    });
  }
  return days;
}

export const ALL_BOOTH_IDS: BoothId[] = BOOTHS.map((b) => b.id);
