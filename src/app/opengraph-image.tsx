import { ImageResponse } from "next/og";

// Link preview for LinkedIn, WhatsApp and X shares (previously there was none)
export const alt = "Ashique PJ, Frontend Developer in Dubai";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#eef2f6",
          color: "#16202e",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, color: "#5b6878" }}>ashiquedev.netlify.app</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>
            Ashique PJ
          </div>
          <div style={{ fontSize: 44, marginTop: 20 }}>
            Frontend developer in Dubai. React, Next.js and AI integration
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 30 }}>
          <div
            style={{ width: 16, height: 16, borderRadius: 8, background: "#c9a06a", marginRight: 16 }}
          />
          <div style={{ color: "#8a5a1f" }}>Available to join immediately in Dubai, UAE</div>
          <div style={{ marginLeft: "auto", width: 120, height: 8, background: "#2446e0" }} />
        </div>
      </div>
    ),
    size
  );
}
