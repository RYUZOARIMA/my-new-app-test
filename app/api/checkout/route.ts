import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { BOOTHS, isClosedDay, priceForBooth } from "@/lib/galleryData";
import type { BoothId } from "@/lib/galleryData";

const BOOTH_IDS = BOOTHS.map((b) => b.id);

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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim())) {
    return NextResponse.json(
      { error: "メールアドレスの形式が正しくありません" },
      { status: 400 }
    );
  }
  const boothDef = BOOTHS.find((b) => b.id === booth)!;
  if (isClosedDay(new Date(`${date}T00:00:00`))) {
    return NextResponse.json(
      { error: "月曜日は定休日のため予約できません" },
      { status: 400 }
    );
  }

  const amount = priceForBooth(boothDef, new Date(`${date}T00:00:00`));
  const origin = new URL(request.url).origin;

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: contact.trim(),
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `士道 SHIDO Gallery Paris ブース${booth} 利用料(${date})`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        date,
        booth,
        name: name.trim(),
        contact: contact.trim(),
        note: note?.trim() ?? "",
        amount: String(amount),
      },
      success_url: `${origin}/booking?payment=success`,
      cancel_url: `${origin}/booking?payment=cancelled`,
    });

    if (!session.url) {
      throw new Error("Stripe Checkout Sessionのurlが取得できませんでした");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "決済ページの作成に失敗しました" },
      { status: 500 }
    );
  }
}
