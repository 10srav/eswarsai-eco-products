import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
            fontSize: 300,
            fontFamily: "Georgia, serif",
            fontWeight: 600,
            color: "#95d5b2",
            transform: "translateY(-14px)",
          }}
        >
          N
        </div>
      </div>
    ),
    size
  );
}
