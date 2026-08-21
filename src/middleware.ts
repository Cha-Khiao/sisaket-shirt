import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    // @ts-ignore
    const role = token?.role;

    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    const userOnlyPaths = ["/dashboard", "/profile", "/cart", "/checkout", "/order", "/orders"];
    if (role === "admin" && userOnlyPaths.some(p => req.nextUrl.pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/admin/orders", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // ต้องมี Token ถึงจะผ่านได้
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/order/:path*",
    "/orders/:path*",
    "/admin/orders/:path*",
    "/admin/products/:path*",
    "/admin/stock/:path*",
  ],
};