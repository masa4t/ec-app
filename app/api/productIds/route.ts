// app/api/productIds/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true },
    });
    const productIds = products.map((product) => product.id);
    return NextResponse.json(productIds);
  } catch (error) {
    console.error("Error fetching product IDs:", error);
    return NextResponse.json(
      { message: "Failed to fetch product IDs" },
      { status: 500 }
    );
  }
}
