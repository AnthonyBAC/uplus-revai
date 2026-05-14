import { NextRequest, NextResponse } from "next/server";

const SERVICE_MAP: Record<string, string | undefined> = {
  auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
  analysis: process.env.NEXT_PUBLIC_ANALYSIS_SERVICE_URL,
};

console.log('[proxy] SERVICE_MAP loaded:', {
  auth: SERVICE_MAP.auth ? `${SERVICE_MAP.auth.slice(0, 30)}...` : 'undefined',
  analysis: SERVICE_MAP.analysis ? `${SERVICE_MAP.analysis.slice(0, 30)}...` : 'undefined',
});

const SKIP_HEADERS = new Set(["host", "connection", "content-length", "transfer-encoding"]);

async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const segments = path.replace("/api/", "").split("/");
  const service = segments[0];
  const rest = segments.length > 1 ? `/${segments.slice(1).join("/")}` : "";
  const query = request.nextUrl.search;

  const baseUrl = SERVICE_MAP[service];
  if (!baseUrl) {
    const missing = service === 'auth'
      ? 'NEXT_PUBLIC_AUTH_SERVICE_URL'
      : service === 'analysis'
        ? 'NEXT_PUBLIC_ANALYSIS_SERVICE_URL'
        : `NEXT_PUBLIC_${service.toUpperCase()}_SERVICE_URL`;
    console.error(`[proxy] Missing env var: ${missing}`);
    return NextResponse.json(
      { error: `Servicio "${service}" no configurado. Falta la variable ${missing} en Vercel (Settings → Environment Variables → marcar Production, Preview y Development).` },
      { status: 404 }
    );
  }

  const url = `${baseUrl}/api/${service}${rest}${query}`;

  console.log(`[proxy] ${request.method} ${path} → ${url}`);

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
        service,
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
