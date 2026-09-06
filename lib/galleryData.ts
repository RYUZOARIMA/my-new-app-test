export type BoothId = "A" | "B" | "C" | "D" | "E" | "F";

export type Booth = {
  id: BoothId;
  size: string;
  weekdayPrice: number;
  weekendPrice: number;
};

export const BOOTHS: Booth[] = [
  { id: "A", size: "200×120cm", weekdayPrice: 300, weekendPrice: 600 },
  { id: "B", size: "180×120cm", weekdayPrice: 250, weekendPrice: 500 },
  { id: "C", size: "180×120cm", weekdayPrice: 250, weekendPrice: 500 },
  { id: "D", size: "180×120cm", weekdayPrice: 200, weekendPrice: 400 },
  { id: "E", size: "180×120cm", weekdayPrice: 200, weekendPrice: 400 },
  { id: "F", size: "165×120cm", weekdayPrice: 200, weekendPrice: 400 },
];

export const GALLERY_INFO = {
  name: "士道 SHIDO Gallery Paris",
  operator: "日本武道宮崎（株）パリ支店",
  address: "3 rue Edmond Gondinet, 75013 Paris",
  access: [
    "オペラよりメトロで27分",
    "エッフェル塔よりメトロで29分",
    "IKEA徒歩10分圏内",
  ],
  facilities: [
    "2025年10月改装済み",
    "Wi-Fiあり",
    "給湯設備あり",
    "地下にトイレあり",
    "日本語対応スタッフ常駐（通訳は含まれません）",
    "必要設備に関しては事前相談",
  ],
  uses: ["展示・販売スペースとして", "イベント会場として", "文化交流の場として"],
  openHours: "11:00〜17:00",
  closedDay: "月曜定休",
};

// 0 = Sunday ... 6 = Saturday. Monday(1) is closed.
export function isClosedDay(date: Date): boolean {
  return date.getDay() === 1;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function priceForBooth(booth: Booth, date: Date): number {
  return isWeekend(date) ? booth.weekendPrice : booth.weekdayPrice;
}
