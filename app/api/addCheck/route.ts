import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productId, quantity } = await request.json();
    const checkItem = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (checkItem?.stock! >= quantity) {
      return NextResponse.json({ isAvailable: true });
    }
  } catch (err) {
    return NextResponse.json({ isAvailable: false });
  }
}
