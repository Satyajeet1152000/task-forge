import { auth } from "./auth/auth";

const publicRoutes = ["/login", "/register"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);

  const loginUrl = new URL("/login", nextUrl.origin);

  if (!isPublicRoutes && !isLoggedIn) {
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
