import { ImageResponse } from "next/og";
import { company } from "@/lib/company";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${company.name} — Replace Plastic. Save Nature.`;

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          background: "linear-gradient(180deg, #0e2a1e 0%, #1a4d36 70%, #2d6a4f 100%)",
          color: "#faf7ef",
          fontFamily: "ui-serif, Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              background: "#52b788",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0e2a1e",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            ▲
          </div>
          <span style={{ fontSize: 24, letterSpacing: "-0.02em" }}>
            Eswar Sai <span style={{ opacity: 0.7 }}>— Eco Products</span>
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <p style={{ fontSize: 16, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.7, margin: 0 }}>
            Non-woven · Jute · Eco-conscious manufacturing
          </p>
          <h1
            style={{
              fontSize: 96,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              fontWeight: 300,
              margin: 0,
              maxWidth: 1000,
            }}
          >
            Replace plastic. <span style={{ fontStyle: "italic", color: "#95d5b2" }}>Carry a future worth saving.</span>
          </h1>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, opacity: 0.7 }}>
          <span>Kakinada · Andhra Pradesh · India</span>
          <span>{company.url.replace("https://", "")}</span>
        </div>
      </div>
    ),
    size,
  );
}
