import { Routes } from "@task-forge/shared/constant";

import { auth } from "@/modules/auth/auth";

const publicRoutes = [Routes.LOGIN, Routes.SIGNUP];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === (route as string) || pathname.startsWith(`${route as string}/`),
  );
}

export default auth((request) => {
  const { nextUrl } = request;
  const isLoggedIn = Boolean(request.auth);
  const { pathname } = nextUrl;

  if (isPublicRoute(pathname)) {
    if (isLoggedIn) {
      return Response.redirect(new URL(Routes.DASHBOARD, nextUrl));
    }
    return;
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL(Routes.LOGIN, nextUrl));
  }

  if (pathname === "/") {
    return Response.redirect(new URL(Routes.DASHBOARD, nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
