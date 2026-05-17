import NextAuth from "next-auth";
import { authConfig } from "./src/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const authRoutes = ["/login", "/register", "/merchantRegister", "/merchantLogin"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  
  // 1. If user is logged in, redirect them away from auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      // Cleaned up the redirect logic using a simple ternary operator
      return NextResponse.redirect(
        new URL(role === "MERCHANT" ? "/merchant" : "/", nextUrl)
      );
    }
    return NextResponse.next();
  }

  // 2. Prevent non-merchants from accessing /merchant pages
  // FIX 2: Corrected the route matching logic. 
  // (Because authRoutes are checked above, /merchantLogin is already bypassed)
  if (nextUrl.pathname === "/merchant" || nextUrl.pathname.startsWith("/merchant/")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/merchantLogin", nextUrl));
    }
    if (role !== "MERCHANT") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // 3. Protect /cart, /checkout, and /myItems routes
  if (nextUrl.pathname.startsWith("/cart") || nextUrl.pathname.startsWith("/checkout") || nextUrl.pathname.startsWith("/myItems")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    // Optional pragmatic guard: Prevent merchants from trying to buy things using their merchant account
    if (role === "MERCHANT") {
      return NextResponse.redirect(new URL("/merchant", nextUrl));
    }
  }

  return NextResponse.next();
});

// The matcher configuration is perfect as-is.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};