import { NextResponse } from "next/server";
import { catalogue,readiness,policyFromEnv } from "../../../lib/domain";
import { clock, transaction, demo } from "../../../lib/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const data = await transaction((s) => {const now=clock(),policy=policyFromEnv(process.env);return {...catalogue(s,now,!demo()),pilotOpen:demo()||(policy.pilotEnabled&&policy.bankReady&&readiness(s,now).ready)};});
    return NextResponse.json(
      { ...data, demo: demo() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Chưa tải được món. Vui lòng thử lại." },
      { status: 503 },
    );
  }
}
