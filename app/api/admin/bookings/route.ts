import { NextResponse } from "next/server";
import { getAllBookings } from "@/lib/googleSheets";

export async function GET() {
  try {
    const bookings = await getAllBookings();
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "予約一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
