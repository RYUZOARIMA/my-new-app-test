import { NextResponse } from "next/server";
import { appendBooking, getBookingsForMonth } from "@/lib/googleSheets";
import { sendBookingNotification } from "@/lib/notifyEmail";
import { BOOTHS, isClosedDay } from "@/lib/galleryData";
import type { BoothId } from "@/lib/galleryData";

const BOOTH_IDS = BOOTHS.map((b) => b.id);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));

  if (!year || !month || month < 1 || month > 12) {
    return NextResponse.json(
      { error: "year, month クエリパラメータが不正です" },
      { status: 400 }
    );
  }

  try {
    const bookings = await getBookingsForMonth(year, month);
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "予約状況の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const { date, booth, name, contact, note } = body as Record<string, string>;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "希望日が不正です" }, { status: 400 });
  }
  if (!booth || !BOOTH_IDS.includes(booth as BoothId)) {
    return NextResponse.json({ error: "ブースが不正です" }, { status: 400 });
  }
  if (!name?.trim() || !contact?.trim()) {
    return NextResponse.json(
      { error: "氏名・連絡先は必須です" },
      { status: 400 }
    );
  }
  if (isClosedDay(new Date(`${date}T00:00:00`))) {
    return NextResponse.json(
      { error: "月曜日は定休日のため予約できません" },
      { status: 400 }
    );
  }

  try {
    const booking = await appendBooking({
      date,
      booth: booth as BoothId,
      name: name.trim(),
      contact: contact.trim(),
      note: note?.trim() ?? "",
    });
    await sendBookingNotification(booking);
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "予約の送信に失敗しました" },
      { status: 500 }
    );
  }
}
