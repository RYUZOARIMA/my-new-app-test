import { NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/googleSheets";
import type { BookingStatus } from "@/lib/googleSheets";

const VALID_STATUSES: BookingStatus[] = ["仮予約", "確定", "却下"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status as BookingStatus | undefined;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "ステータスが不正です" }, { status: 400 });
  }

  try {
    await updateBookingStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}
