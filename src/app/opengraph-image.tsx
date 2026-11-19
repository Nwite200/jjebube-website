import { ImageResponse } from "next/og";

export const alt = "JJ Ebube Enterprise — Quality Products. Better Life.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#071A3A",
          color: "#F7F4ED",
          padding: "64px 72px",
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(217,172,66,0.30) 0%, rgba(217,172,66,0.04) 55%, transparent 70%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 9999,
              border: "2px solid #D9AC42",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              color: "#D9AC42",
            }}
          >
            JJ
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 22, letterSpacing: 3 }}>JJ EBUBE</span>
            <span style={{ fontSize: 11, letterSpacing: 7, color: "#D9AC42", fontFamily: "Arial, sans-serif" }}>
              ENTERPRISE
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 42, height: 1, background: "#D9AC42" }} />
            <span style={{ fontSize: 15, letterSpacing: 5, color: "#F1D58B", fontFamily: "Arial, sans-serif" }}>
              YOUR TRUSTED STORE FOR QUALITY PRODUCTS
            </span>
          </div>
          <span style={{ fontSize: 82, lineHeight: 1.02, letterSpacing: -1 }}>Quality Products.</span>
          <span style={{ fontSize: 82, lineHeight: 1.02, color: "#F1D58B", fontStyle: "italic", letterSpacing: -1 }}>
            Better Life.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(247,244,237,0.15)",
            paddingTop: 22,
            fontSize: 15,
            letterSpacing: 3,
            color: "rgba(247,244,237,0.55)",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <span>RETAIL · WHOLESALE · BULK ORDERS</span>
          <span style={{ color: "#D9AC42" }}>DELIVERY ACROSS NIGERIA</span>
        </div>
      </div>
    ),
    size,
  );
}
