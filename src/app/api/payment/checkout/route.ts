import { NextResponse } from "next/server";
import { createCheckoutSessionAction } from "@/features/checkout/actions/checkout.actions";

export async function POST() {
  try {
    const res = await createCheckoutSessionAction();
    if (res.error) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }
    return NextResponse.json(res);
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
