import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export async function POST(request: Request) {
  try {
    const { cartItems } = await request.json();

    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json(
        { error: "カートに商品が入ってません。" },
        { status: 400 }
      );
    }

    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        return NextResponse.json(
          { error: `カートの商品（ID: ${item.id}）は存在しません。` },
          { status: 400 }
        );
      }

      if (product?.stock! < item.count) {
        return NextResponse.json(
          { error: `${product.name}の在庫が不足しています。` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ isInStock: true });
  } catch (error) {
    console.error("Error checking stock:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
