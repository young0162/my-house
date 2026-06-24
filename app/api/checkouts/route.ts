import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkoutDbService } from "@/services/checkout.db";
import { CreateCheckoutRequest } from "@/types/checkout";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body: CreateCheckoutRequest = await request.json();

  try {
    if (body.source === "PRODUCT_DETAIL") {
      const { productId, optionValueIds, quantity } = body;

      if (
        typeof productId !== "number" ||
        typeof quantity !== "number" ||
        quantity < 1 ||
        !Array.isArray(optionValueIds) ||
        optionValueIds.some((id) => typeof id !== "number")
      ) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }

      const result = await checkoutDbService.createFromProductDetail(userId, {
        productId,
        optionValueIds,
        quantity,
      });
      return NextResponse.json(result);
    }

    if (body.source === "CART") {
      const { cartIds } = body;

      if (!Array.isArray(cartIds) || cartIds.length === 0) {
        return NextResponse.json({ error: "cartIds must be a non-empty array" }, { status: 400 });
      }

      const result = await checkoutDbService.createFromCart(userId, { cartIds });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid source" }, { status: 400 });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[POST /api/checkouts]", error);
    return NextResponse.json({ error: message }, { status });
  }
}
