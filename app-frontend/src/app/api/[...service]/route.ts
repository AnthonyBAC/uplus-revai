import { NextRequest, NextResponse } from "next/server";

type Route = { prefix: string; baseUrl: string };

function buildRoutes(): Route[] {
  const auth = process.env.AUTH_SERVICE_URL ?? "";
  const analysis = process.env.ANALYSIS_SERVICE_URL ?? "";

  return [
    { prefix: "/api/auth/", baseUrl: auth },
    { prefix: "/api/roles", baseUrl: auth },
    { prefix: "/api/branches", baseUrl: auth },
    { prefix: "/api/businesses", baseUrl: auth },
    { prefix: "/api/endpoints", baseUrl: auth },
    { prefix: "/api/analysis/", baseUrl: analysis },
  ].filter((r) => r.baseUrl.length > 0);
}

const SKIP_HEADERS = new Set(["host", "connection", "content-length", "transfer-encoding"]);

function matchRoute(path: string, routes: Route[]): Route | undefined {
  const ordered = routes.sort((a, b) => b.prefix.length - a.prefix.length);
  for (const route of ordered) {
    if (path.startsWith(route.prefix)) return route;
  }
  return undefined;
}

async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const query = request.nextUrl.search;

  const routes = buildRoutes();
  const route = matchRoute(path, routes);

  if (!route) {
    const tried = routes.map((r) => r.prefix);
    console.error(`[proxy] No route for ${path}. Registered prefixes: ${tried.join(", ")}`);
    return NextResponse.json(
      { error: `Ruta "${path}" no configurada en el proxy BFF.` },
      { status: 404 }
    );
  }

  const url = `${route.baseUrl}${path}${query}`;

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    if (!SKIP_HEADERS.has(key.toLowerCase())) {
      headers[key] = value;
    }
  });

  const body = request.body
    ? request.method !== "GET" && request.method !== "HEAD"
      ? (await request.text()) || undefined
      : undefined
    : undefined;

  try {
    const upstream = await fetch(url, {
      method: request.method,
      headers,
      body,
    });

    const responseBody = await upstream.text();
    const contentType = upstream.headers.get("content-type") ?? "application/json";

    return new NextResponse(responseBody, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: { "content-type": contentType },
    });
  } catch (err) {
    console.error(`[proxy] fetch failed for ${url}:`, err);
    return NextResponse.json(
      {
        error: "Error al conectar con el servicio backend",
        url,
      },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest) {
  return proxy(req);
}

export async function POST(req: NextRequest) {
  return proxy(req);
}

export async function PUT(req: NextRequest) {
  return proxy(req);
}

export async function PATCH(req: NextRequest) {
  return proxy(req);
}

export async function DELETE(req: NextRequest) {
  return proxy(req);
}

export async function OPTIONS(req: NextRequest) {
  return proxy(req);
}