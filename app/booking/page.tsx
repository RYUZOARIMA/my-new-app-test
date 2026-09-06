import Link from "next/link";
import BookingClient from "@/components/BookingClient";
import { getBookingsForMonth } from "@/lib/googleSheets";

export const metadata = {
  title: "予約・空き状況 | 士道 SHIDO Gallery Paris",
};

// Booking availability changes frequently and must reflect the live
// spreadsheet on every request, not just at build/deploy time.
export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  let bookings: Awaited<ReturnType<typeof getBookingsForMonth>> = [];
  let error: string | null = null;
  try {
    bookings = await getBookingsForMonth(year, month);
  } catch {
    error = "空き状況の取得に失敗しました(Googleスプレッドシートの設定を確認してください)";
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <Link
          href="/"
          className="text-sm text-[color:var(--color-indigo-deep)] hover:underline"
        >
          ← ギャラリー紹介に戻る
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-[color:var(--color-indigo-deep)] sm:text-3xl">
          予約・空き状況
        </h1>
        <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">
          カレンダーから希望日を選び、ブースを選択して仮予約をお申込みください。最終的なご予約確定はオーナーより折り返しご連絡します。
        </p>
      </div>

      <BookingClient
        initialYear={year}
        initialMonth={month}
        initialBookings={bookings}
        initialError={error}
      />
    </div>
  );
}
