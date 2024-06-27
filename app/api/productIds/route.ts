// app/api/productIds/route.ts
import { client } from "@/app/lib/client";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const response = await client.get({ endpoint: "sup" });
    const products = response.contents;

    const productIds = products.map((product: { id: string }) => product.id);
    return NextResponse.json(productIds);
  } catch (error) {
    console.error("Error fetching product IDs:", error);
    return NextResponse.json(
      { message: "Failed to fetch product IDs" },
      { status: 500 }
    );
  }
}
