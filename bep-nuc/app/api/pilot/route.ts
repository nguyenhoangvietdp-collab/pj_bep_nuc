import { NextRequest, NextResponse } from "next/server";
import { identity } from "../../../lib/auth";
import { clock, transaction, demo } from "../../../lib/store";
import { act, issue, requireThat, view } from "../../../lib/domain";
import { walking } from "../../../lib/routes";
import { randomUUID } from "node:crypto";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const id = await identity();
    const data = await transaction((s) => {
      const u = s.users.find((u) => u.id === id);
      requireThat(u, "Không có tài khoản");
      if(!u.approved) return {user:u,mealRequests:(s.mealRequests||[]).filter(r=>r.userId===u.id).map(({quoteId,...r})=>r),orders:[],vouchers:[],heldQuotes:[]};
      issue(s, u, clock());
      return view(s, u, clock());
    });
    return NextResponse.json(
      {
        ...data,
        demo: demo(),
        supportEmail: process.env.SUPPORT_EMAIL || null,
        bank: !data.orders.some((o:any)=>o.status==="awaiting_payment" && o.expires>clock()) ? undefined : demo()
          ? { name: "TIỀN GIẢ", account: "KHÔNG CHUYỂN TIỀN", holder: "DEMO" }
          : {
              name: process.env.BANK_NAME,
              account: process.env.BANK_ACCOUNT,
              holder: process.env.BANK_HOLDER,
            },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 });
  }
}
export async function POST(req: NextRequest) {
  try {
    requireThat(
      req.headers.get("origin") ===
        new URL(process.env.APP_URL || "http://127.0.0.1:3200").origin,
      "Origin không hợp lệ",
    );
    const id = await identity();
    const body = await req.json();
    requireThat(
      typeof body.action === "string" &&
        body.args &&
        typeof body.args === "object",
      "Sai yêu cầu",
    );
    let distance: number | null = null;
    if (body.action === "quote" && body.args.fulfillment !== "delivery") {
      const destination = await transaction((s) => {
        const u = s.users.find((x) => x.id === id);
        requireThat(u?.approved && u.role === "student", "Không có quyền");
        const listing = s.listings.find((l) => l.id === body.args.listingId);
        requireThat(listing, "Không có món");
        requireThat(
          s.audit.filter(
            (x) =>
              x.actor === id &&
              x.action === "quote_attempt" &&
              x.at > clock() - 60000,
          ).length < 5,
          "Tối đa 5 báo giá/phút",
        );
        const month = new Date(clock()).toISOString().slice(0, 7);
        const used = s.audit.filter(
          (x) =>
            x.action === "route_request" &&
            new Date(x.at).toISOString().startsWith(month),
        ).length;
        const routeAllowed =
          !!body.args.location &&
          used < Number(process.env.ROUTES_MONTHLY_REQUEST_LIMIT || 1000);
        s.audit.push({
          id: randomUUID(),
          at: clock(),
          actor: id,
          action: "quote_attempt",
          detail: { listingId: listing.id },
        });
        if (routeAllowed)
          s.audit.push({
            id: randomUUID(),
            at: clock(),
            actor: id,
            action: "route_request",
            detail: { listingId: listing.id },
          });
        return {
          shop: s.shops.find((x) => x.id === listing.shopId)!,
          routeAllowed,
        };
      });
      if (destination.routeAllowed)
        distance = await walking(body.args.location, destination.shop);
      delete body.args.location;
    }
    const data = await transaction((s) => {
      const u = s.users.find((x) => x.id === id);
      requireThat(u, "Không có tài khoản");
      issue(s, u, clock());
      return act(s, u, body.action, body.args, clock(), distance);
    });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
