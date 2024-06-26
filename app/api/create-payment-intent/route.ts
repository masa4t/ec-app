import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { amount } = await request.json();

  // Check the received amount

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "jpy",
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.log("Stripe Error: ", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
