import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyRequest(request: NextRequest, pathSegments: string[]): Promise<NextResponse> {
  const targetPath = pathSegments.join("/");
  const targetUrl = `${API_BASE_URL}/api/${targetPath}${request.nextUrl.search}`;
  const headers = new Headers(request.headers);

  headers.delete("host");
  headers.delete("connection");

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const upstream = await fetch(targetUrl, init);
  const responseHeaders = new Headers();

  upstream.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey === "set-cookie") {
      return;
    }
    if (["transfer-encoding", "content-encoding", "content-length"].includes(lowerKey)) {
      return;
    }
    responseHeaders.set(key, value);
  });

  upstream.headers.getSetCookie().forEach((cookie) => {
    responseHeaders.append("Set-Cookie", cookie);
  });

  const body = await upstream.arrayBuffer();

  return new NextResponse(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

async function handle(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { path } = await context.params;
  if (path[0] === "auth") {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  return proxyRequest(request, path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
