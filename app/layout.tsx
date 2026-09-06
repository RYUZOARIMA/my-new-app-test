import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "士道 SHIDO Gallery Paris | 予約・空き状況",
  description:
    "日本武道宮崎パリ支店のギャラリースペース「士道 SHIDO Gallery Paris」の展示ブース予約・空き状況確認サイト",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <div className="flex h-1.5 w-full" aria-hidden="true">
          <div className="flex-1 bg-[color:var(--color-indigo-deep)]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[color:var(--color-red)]" />
        </div>
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
