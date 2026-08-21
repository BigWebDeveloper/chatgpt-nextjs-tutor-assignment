import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/profile/:path*", "/api/orders/:path*", "/api/admin/:path*"],
  role: {
    type: String,
    enum: ["user", "editor", "admin"],
    default: "user",
  },
};
