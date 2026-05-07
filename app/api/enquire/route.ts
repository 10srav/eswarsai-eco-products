import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().regex(/^[+0-9\s\-()]{7,}$/i),
  business: z.string().max(160).optional().nullable(),
  requirement: z.string().min(1).max(160),
  quantity: z.string().max(80).optional().nullable(),
  time: z.string().max(60).optional().nullable(),
  notes: z.string().max(800).optional().nullable(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Lead capture: log structured data; replace with KV/DB/email integration in production.
  const lead = {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for") ?? "unknown",
    userAgent: req.headers.get("user-agent") ?? "unknown",
  };
  console.log("[enquiry]", JSON.stringify(lead));

  return NextResponse.json({ ok: true });
}
