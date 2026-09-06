import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#1d4ed8",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f2f6fc",
            fontSize: 78,
            fontFamily: "serif",
          }}
        >
          SG
        </div>
        <div style={{ display: "flex", height: 14, width: "100%" }}>
          <div style={{ flex: 1, background: "#1d4ed8" }} />
          <div style={{ flex: 1, background: "#ffffff" }} />
          <div style={{ flex: 1, background: "#d21e2b" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
