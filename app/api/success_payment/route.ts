import { itemTypes } from "@/app/types";
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { cartItems, customer, paymentIntent, total } = await request.json();

    if (!customer) {
      throw new Error("Customer data is undefined");
    }

    const result = await prisma.$transaction(async (prisma) => {
      // 顧客情報をデータベースに保存 (upsertを使用)
      const user = await prisma.customer.upsert({
        where: { email: customer.email },
        update: {
          name: `${customer.lastName} ${customer.firstName}`,
          phone: customer.phoneNumber,
          address: customer.address,
          city: customer.city,
          building: customer.building,
          prefecture: customer.prefecture,
          zip: customer.postalCode,
          updatedAt: new Date(),
        },
        create: {
          email: customer.email,
          name: `${customer.lastName} ${customer.firstName}`,
          phone: customer.phoneNumber,
          address: customer.address,
          city: customer.city,
          building: customer.building,
          prefecture: customer.prefecture,
          zip: customer.postalCode,
          country: "日本",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // 注文情報をデータベースに保存
      const order = await prisma.order.create({
        data: {
          customerId: user.id,
          total: total,
          paymentIntentId: paymentIntent.id,
          orderItems: {
            create: cartItems.map((item: itemTypes) => ({
              productId: item.id,
              quantity: item.count,
            })),
          },
        },
      });

      // 在庫の更新
      for (const item of cartItems) {
        await prisma.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.count } },
        });
      }

      return { user, order };
    });

    return NextResponse.json({ message: "Success", result });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Error processing payment" },
      { status: 500 }
    );
  }
}
