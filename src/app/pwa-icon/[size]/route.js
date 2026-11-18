import { ImageResponse } from "next/og";

const allowed = [180, 192, 512];

export async function GET(request, { params }) {
  const { size } = await params;
  const px = Number(size);
  if (!allowed.includes(px)) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2563eb",
          color: "#ffffff",
          fontSize: px * 0.6,
          fontWeight: 700,
        }}
      >
        B
      </div>
    ),
    { width: px, height: px }
  );
}