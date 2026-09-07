import AdminBookingsClient from "@/components/AdminBookingsClient";
import SectionHeading from "@/components/SectionHeading";
import { getAllBookings } from "@/lib/googleSheets";

export const metadata = {
  title: "予約管理 | 士道 SHIDO Gallery Paris",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let bookings: Awaited<ReturnType<typeof getAllBookings>> = [];
  let error: string | null = null;
  try {
    bookings = await getAllBookings();
  } catch {
    error =
      "予約一覧の取得に失敗しました(Googleスプレッドシートの設定を確認してください)";
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <SectionHeading eyebrow="ADMIN" title="予約管理" />
      <AdminBookingsClient initialBookings={bookings} initialError={error} />
    </div>
  );
}
