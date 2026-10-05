import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { client } from "../../../lib/auth";
import { demo } from "../../../lib/store";
export async function POST(req: NextRequest) {
  try {
    if (
      req.headers.get("origin") !==
      new URL(process.env.APP_URL || "http://127.0.0.1:3200").origin
    )
      throw new Error("Origin không hợp lệ");
    const a = await req.json();
    if (demo()) {
      if (!["student", "merchant", "ops"].includes(a.role))
        throw new Error("Sai vai trò");
      (await cookies()).set("bc_demo", a.role, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      return NextResponse.json({ ok: true });
    }
    const c = await client();
    const response = a.token
      ? await c.auth.verifyOtp({
          email: a.email,
          token: a.token,
          type: "email",
        })
      : await c.auth.signInWithOtp({ email: a.email });
    if (response.error) throw response.error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
