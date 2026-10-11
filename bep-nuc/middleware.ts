import { NextRequest, NextResponse } from "next/server";
export function middleware(req: NextRequest) {
  if (
    process.env.APP_MODE !== "production" &&
    !["localhost", "127.0.0.1"].includes(req.nextUrl.hostname)
  )
    return new NextResponse("Demo only runs on localhost", { status: 403 });
  return NextResponse.next();
}
export const config = { matcher: ["/api/:path*"] };
