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
};

function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

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
  const [id, submittedAt, date, booth, name, contact, note, status] = row;
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
  };
}

export async function getBookingsForMonth(
  year: number,
  month: number // 1-12
): Promise<Booking[]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `${SHEET_NAME}!A2:H`,
  });

  const rows = res.data.values ?? [];
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;

  return rows
    .map((row) => rowToBooking(row as string[]))
    .filter((b): b is Booking => b !== null && b.date.startsWith(monthPrefix))
    .filter((b) => b.status !== "却下");
}

export async function appendBooking(input: {
  date: string;
  booth: BoothId;
  name: string;
  contact: string;
  note: string;
}): Promise<Booking> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const booking: Booking = {
    id: `${Date.now()}`,
    submittedAt: new Date().toISOString(),
    date: input.date,
    booth: input.booth,
    name: input.name,
    contact: input.contact,
    note: input.note,
    status: "仮予約",
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAME}!A:H`,
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
        ],
      ],
    },
  });

  return booking;
}

export { HEADER_ROW };
