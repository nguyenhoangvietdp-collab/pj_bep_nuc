import { NextResponse } from "next/server";
import { identity } from "../../../lib/auth";
import { transaction } from "../../../lib/store";
import { requireThat } from "../../../lib/domain";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const id = await identity();
    const data = await transaction((s) => {
      const u = s.users.find((x) => x.id === id);
      requireThat(u?.role === "ops" && u.approved, "Chỉ vận hành được xuất");
      return {
        ...s,
        requests: undefined,
        orders: s.orders.map(({ code, ...o }) => o),
      };
    });
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": 'attachment; filename="buachot-pilot.json"',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }
}
