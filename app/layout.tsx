import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "士道 SHIDO Gallery Paris | 予約・空き状況",
  description:
    "日本武道宮崎パリ支店のギャラリースペース「士道 SHIDO Gallery Paris」の展示ブース予約・空き状況確認サイト",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
