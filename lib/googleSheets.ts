import { google } from "googleapis";
import type { BoothId } from "./galleryData";

const SHEET_NAME = "予約";
const HEADER_ROW = [
  "予約ID",
  "申込日時",
  "希望日",
  "ブース",
  "氏名",
  "連絡先",
  "用途備考",
  "ステータス",
  "金額",
  "Stripe決済ID",
  "申請番号",
] as const;

export type BookingStatus = "仮予約" | "確定" | "却下";

export type Booking = {
  id: string;
  submittedAt: string;
  date: string; // YYYY-MM-DD
  booth: BoothId;
  name: string;
  contact: string;
  note: string;
  status: BookingStatus;
  amount: number; // EUR
  stripeSessionId: string;
  number: number; // 申請番号(通し番号。何件目の申込みか)
};

function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY が設定されていません"
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

function getSpreadsheetId() {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEET_ID が設定されていません");
  return id;
}

function rowToBooking(row: string[]): Booking | null {
  const [
    id,
    submittedAt,
    date,
    booth,
    name,
    contact,
    note,
    status,
    amount,
    stripeSessionId,
    number,
  ] = row;
  if (!id || !date || !booth) return null;
  return {
    id,
    submittedAt: submittedAt ?? "",
    date,
    booth: booth as BoothId,
    name: name ?? "",
    contact: contact ?? "",
    note: note ?? "",
    status: (status as BookingStatus) ?? "仮予約",
    amount: Number(amount) || 0,
    stripeSessionId: stripeSessionId ?? "",
    number: Number(number) || 0,
  };
}

export async function getBookingsForMonth(
  year: number,
  month: number // 1-12
): Promise<Booking[]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `${SHEET_NAME}!A2:K`,
  });

  const rows = res.data.values ?? [];
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;

  return rows
    .map((row) => rowToBooking(row as string[]))
    .filter((b): b is Booking => b !== null && b.date.startsWith(monthPrefix))
    .filter((b) => b.status !== "却下");
}

// 管理画面向け: 全期間・全ステータスの予約申込みを、新しいものから順に取得する
export async function getAllBookings(): Promise<Booking[]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `${SHEET_NAME}!A2:K`,
  });

  const rows = res.data.values ?? [];

  return rows
    .map((row) => rowToBooking(row as string[]))
    .filter((b): b is Booking => b !== null)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function appendBooking(input: {
  date: string;
  booth: BoothId;
  name: string;
  contact: string;
  note: string;
  amount: number;
  stripeSessionId: string;
}): Promise<Booking> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  // 申請番号は「これまでの申込み件数+1」の通し番号。同時申込みが重なると
  // 番号が前後する可能性があるが、この規模の運用では実用上問題にならない。
  const countRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A2:A`,
  });
  const nextNumber = (countRes.data.values?.length ?? 0) + 1;

  const booking: Booking = {
    id: `${Date.now()}`,
    submittedAt: new Date().toISOString(),
    date: input.date,
    booth: input.booth,
    name: input.name,
    contact: input.contact,
    note: input.note,
    status: "仮予約",
    amount: input.amount,
    stripeSessionId: input.stripeSessionId,
    number: nextNumber,
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAME}!A:K`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          booking.id,
          booking.submittedAt,
          booking.date,
          booking.booth,
          booking.name,
          booking.contact,
          booking.note,
          booking.status,
          booking.amount,
          booking.stripeSessionId,
          booking.number,
        ],
      ],
    },
  });

  return booking;
}

// 管理画面向け: 予約のステータス(仮予約→確定/却下)を更新する
export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const idsRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A2:A`,
  });
  const ids = (idsRes.data.values ?? []).map((row) => row[0]);
  const rowIndex = ids.indexOf(id);
  if (rowIndex === -1) {
    throw new Error(`予約ID ${id} が見つかりません`);
  }
  const rowNumber = rowIndex + 2; // ヘッダー行(1行目)を考慮した実際の行番号

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!H${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[status]] },
  });
}

export { HEADER_ROW };
