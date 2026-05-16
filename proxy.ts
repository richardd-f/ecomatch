import NextAuth from "next-auth";
import { authConfig } from "./src/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const publicRoutes = ["/", "/catalog", "/about"];
const authRoutes = ["/login", "/register", "/merchantRegister", "/merchantLogin"];

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  
  // If user is logged in, redirect them away from auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      if (role === "MERCHANT") {
        return NextResponse.redirect(new URL("/merchant", nextUrl));
      }
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // Prevent CONSUMER from accessing /merchant pages
  if (nextUrl.pathname.startsWith("/merchant")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/merchantLogin", nextUrl));
    }
    if (role === "CONSUMER") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

// Optionally, don't invoke Proxy on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
