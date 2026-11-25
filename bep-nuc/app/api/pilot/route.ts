import {publicTradingRules,defaultTradingRules} from "../../../lib/trading";
import { NextRequest, NextResponse } from "next/server";
import { identity } from "../../../lib/auth";
import { clock, transaction, demo } from "../../../lib/store";
import { act, issue, requireThat, previewReceiving, view } from "../../../lib/domain";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const id = await identity();
    const data = await transaction((s) => {
      const u = s.users.find((u) => u.id === id);
      requireThat(u, "Không có tài khoản");
      if(!u.approved) return {user:u,tradingRules:publicTradingRules(s.tradingRules??defaultTradingRules()),mealRequests:(s.mealRequests||[]).filter(r=>r.userId===u.id).map(({quoteId,...r})=>r),orders:[],vouchers:[],heldQuotes:[]};
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
    requireThat(Number(req.headers.get("content-length")||0)<=32768,"Yêu cầu quá lớn");
    const text=await req.text();requireThat(new TextEncoder().encode(text).length<=32768,"Yêu cầu quá lớn");
    const body = JSON.parse(text);
    requireThat(
      typeof body.action === "string" &&
        body.args &&
        typeof body.args === "object",
      "Sai yêu cầu",
    );
    delete body.args.location;delete body.args.distance;
    const data = await transaction((s) => {
      const u = s.users.find((x) => x.id === id);
      requireThat(u, "Không có tài khoản");
      if(body.action==="preview_receiving")return previewReceiving(s,u,body.args,clock(),null,!demo());
      if(u.approved)issue(s, u, clock());
      return act(s, u, body.action, body.args, clock(), null);
    });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
