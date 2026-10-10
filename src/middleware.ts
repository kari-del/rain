import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 受保护的路径前缀
const ADMIN_PATHS = ["/admin", "/api/admin"];
const AUTH_REQUIRED_PATHS = ["/api/submissions"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否是管理路径
  const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const isAuthRequired = AUTH_REQUIRED_PATHS.some((p) => pathname.startsWith(p));

  if (!isAdminPath && !isAuthRequired) {
    return NextResponse.next();
  }

  // 从 cookie 读取 session token
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    // 未登录
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { code: 401, message: "请先登录" },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 注意：管理员权限的二次校验在每个 API/页面内部通过 auth() 完成
  // 这里只做基础的登录态拦截，避免 Edge Runtime 导入 Prisma/NextAuth

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/submissions",
  ],
};
