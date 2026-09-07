import { NextResponse } from "next/server";
import { getBookingsForMonth } from "@/lib/googleSheets";

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
