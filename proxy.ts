import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ADMIN_PATHS = ["/manage/login", "/api/admin/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const expected = process.env.ADMIN_PASSWORD;
  const cookiePassword = request.cookies.get("admin_auth")?.value;

  if (!expected || cookiePassword !== expected) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    const loginUrl = new URL("/manage/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/api/admin/:path*"],
};
