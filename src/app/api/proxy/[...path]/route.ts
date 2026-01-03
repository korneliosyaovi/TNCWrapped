import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_BASE = process.env.API_BASE_URL || "https://api.therootshive.com/V1/events";

function buildAuthHeader() {
  const username = process.env.API_USERNAME;
  const password = process.env.API_PASSWORD;
  if (!username || !password) return null;
  const encoded = Buffer.from(`${username}:${password}`).toString("base64");
  return `Basic ${encoded}`;
}

async function forwardRequest(path: string, init: RequestInit) {
  const authHeader = buildAuthHeader();
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Server misconfigured: missing API credentials" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = `${EXTERNAL_API_BASE}${path}`;
  const headers = new Headers(init.headers);
  headers.set("Authorization", authHeader);
  const res = await fetch(url, { ...init, headers });
  const contentType = res.headers.get("content-type") || "application/json";
  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": contentType },
  });}

export async function GET(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  try {
    const { path } = await context.params;
    const pathname = "/" + (path?.join("/") ?? "");
    const search = req.nextUrl.search || "";
    return forwardRequest(`${pathname}${search}`, { method: "GET" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  try {
    const { path } = await context.params;
    const pathname = "/" + (path?.join("/") ?? "");
    const body = await req.json().catch(() => null);
    return forwardRequest(pathname, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
