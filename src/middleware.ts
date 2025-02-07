import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Kiểm tra nếu route bắt đầu bằng "/admin"
  const isAdminRoute = pathname.startsWith("/dashboard");

  // Thêm header "x-is-admin" để phân biệt
  const response = NextResponse.next();
  response.headers.set("x-is-admin", isAdminRoute ? "true" : "false");
  return response;
}

// Áp dụng middleware cho tất cả route
export const config = {
  matcher: "/:path*", // Áp dụng middleware cho mọi route
};
