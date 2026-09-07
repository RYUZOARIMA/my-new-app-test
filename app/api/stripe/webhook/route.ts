import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { appendBooking } from "@/lib/googleSheets";
import { sendBookingNotification } from "@/lib/notifyEmail";
import type { BoothId } from "@/lib/galleryData";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET が設定されていません");
    return NextResponse.json({ error: "サーバー設定エラー" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "署名がありません" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe Webhookの署名検証に失敗しました", error);
    return NextResponse.json({ error: "署名検証エラー" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (!metadata?.date || !metadata?.booth || !metadata?.name || !metadata?.contact) {
      console.error("Stripe Checkout Sessionのmetadataが不足しています", metadata);
      return NextResponse.json({ received: true });
    }

    try {
      const booking = await appendBooking({
        date: metadata.date,
        booth: metadata.booth as BoothId,
        name: metadata.name,
        contact: metadata.contact,
        note: metadata.note ?? "",
        amount: session.amount_total != null ? session.amount_total / 100 : Number(metadata.amount) || 0,
        stripeSessionId: session.id,
      });
      await sendBookingNotification(booking);
    } catch (error) {
      console.error("決済完了後の予約登録に失敗しました", error);
      return NextResponse.json({ error: "予約登録に失敗しました" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
