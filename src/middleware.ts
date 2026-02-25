import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnLogin = req.nextUrl.pathname === "/login";
  const isOnApi = req.nextUrl.pathname.startsWith("/api");
  const isOnPublic = req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/(public)");

  // API rotaları için auth kontrolü (admin API'leri hariç seed)
  if (isOnApi) {
    // Auth seed endpoint'i herkese açık
    if (req.nextUrl.pathname === "/api/auth/seed") {
      return NextResponse.next();
    }
    // NextAuth API'leri
    if (req.nextUrl.pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }
    // Admin API'leri için auth gerekli
    if (req.nextUrl.pathname.startsWith("/api/admin")) {
      // Auth kontrolü route handler'da yapılıyor
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // Dashboard'a giriş yapmadan erişim
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Zaten giriş yapmış kullanıcı login sayfasına giderse
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Public sayfalar
  if (isOnPublic) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|uploads).*)"],
};
