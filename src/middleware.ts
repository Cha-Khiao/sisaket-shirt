// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // เช็คว่าเป็น Admin ไหม
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextUrl.pathname !== "/admin/login") {
      const token = req.nextauth.token;
      // @ts-ignore
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url)); // ถ้าไม่ใช่ Admin ดีดกลับหน้าแรก
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // ต้อง Login ก่อนถึงจะผ่านได้
    },
  }
);

// กำหนดหน้าที่จะให้ Middleware ทำงาน
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/order/:path*", "/orders/:path*"],
};