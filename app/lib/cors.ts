import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = ["https://ec-ghejo4w9u-masashits-projects.vercel.app"];

export function withCORS(handler: any) {
  return async (req: NextRequest, ...args: any[]) => {
    const origin = req.headers.get("origin");

    const response = NextResponse.next();

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
    }

    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204 });
    }

    return handler(req, response, ...args);
  };
}
