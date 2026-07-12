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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0e2a1e 0%, #1a4d36 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontFamily: "Georgia, serif",
            fontWeight: 600,
            color: "#95d5b2",
            transform: "translateY(-5px)",
          }}
        >
          N
        </div>
      </div>
    ),
    size
  );
}
