import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "士道 SHIDO Gallery Paris",
    short_name: "SHIDOギャラリー",
    description:
      "日本武道宮崎パリ支店のギャラリースペース「士道 SHIDO Gallery Paris」の予約・空き状況確認サイト",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f6fc",
    theme_color: "#1d4ed8",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
