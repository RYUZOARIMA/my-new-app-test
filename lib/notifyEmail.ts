import { Resend } from "resend";
import type { Booking } from "./googleSheets";

const NOTIFY_TO = "nipponbudomiyazaki@gmail.com";

export async function sendBookingNotification(booking: Booking) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "RESEND_API_KEY が設定されていないため、予約通知メールを送信できませんでした"
    );
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  try {
    await resend.emails.send({
      from: `士道 SHIDO Gallery Paris 予約システム <${from}>`,
      to: NOTIFY_TO,
      subject: `【新規予約】${booking.date} ブース${booking.booth} / ${booking.name}様`,
      text: [
        "新しい予約申込みがありました。",
        "",
        `希望日: ${booking.date}`,
        `ブース: ${booking.booth}`,
        `氏名: ${booking.name}`,
        `連絡先: ${booking.contact}`,
        `用途備考: ${booking.note || "(なし)"}`,
        `ステータス: ${booking.status}`,
        `申込日時: ${booking.submittedAt}`,
        `予約ID: ${booking.id}`,
      ].join("\n"),
    });
  } catch (error) {
    console.error("予約通知メールの送信に失敗しました", error);
  }
}
