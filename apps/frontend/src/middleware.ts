import { Routes } from "@task-forge/shared/constant";

import { auth } from "@/modules/auth/auth";

const authEntryRoutes = [Routes.LOGIN, Routes.SIGNUP];

function isAuthEntryRoute(pathname: string): boolean {
  return authEntryRoutes.some(
    (route) => pathname === (route as string) || pathname.startsWith(`${route as string}/`),
  );
}

function isInviteRoute(pathname: string): boolean {
  return pathname.startsWith(`${Routes.INVITE}/`);
}

export default auth((request) => {
  const { nextUrl } = request;
  const isLoggedIn = Boolean(request.auth);
  const { pathname } = nextUrl;

  if (isInviteRoute(pathname)) {
    return;
  }

  if (isAuthEntryRoute(pathname)) {
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
