import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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

      const product = await prisma.product.findUnique({
        where: { id: productId, isActive: true },
        select: {
          productOptions: {
            select: { productOptionValues: { select: { optionValueId: true } } },
          },
        },
      });

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      const validOptionValueIds = new Set(
        product.productOptions.flatMap((po) =>
          po.productOptionValues.map((pov) => pov.optionValueId),
        ),
      );

      if (optionValueIds.some((id: number) => !validOptionValueIds.has(id))) {
        return NextResponse.json({ error: "Invalid option value" }, { status: 400 });
      }

      if (optionValueIds.length !== product.productOptions.length) {
        return NextResponse.json({ error: "All options must be selected" }, { status: 400 });
      }

      const checkout = await prisma.$transaction(async (tx) => {
        const created = await tx.checkout.create({
          data: { userId, source: "PRODUCT_DETAIL" },
        });

        const item = await tx.checkoutItem.create({
          data: { checkoutId: created.id, productId, quantity },
        });

        if (optionValueIds.length > 0) {
          await tx.checkoutItemOption.createMany({
            data: optionValueIds.map((optionValueId: number) => ({
              checkoutItemId: item.id,
              optionValueId,
            })),
          });
        }

        return created;
      });

      return NextResponse.json({
        checkoutId: checkout.id,
        redirectUrl: `/checkout?checkoutId=${checkout.id}`,
      });
    }

    if (body.source === "CART") {
      const { cartIds } = body;

      if (!Array.isArray(cartIds) || cartIds.length === 0) {
        return NextResponse.json({ error: "cartIds must be a non-empty array" }, { status: 400 });
      }

      const carts = await prisma.cart.findMany({
        where: { id: { in: cartIds }, userId },
        select: {
          id: true,
          productId: true,
          count: true,
          cartOptions: { select: { optionValueId: true } },
        },
      });

      if (carts.length !== cartIds.length) {
        return NextResponse.json({ error: "Some cart items not found" }, { status: 400 });
      }

      const checkout = await prisma.$transaction(async (tx) => {
        const created = await tx.checkout.create({
          data: { userId, source: "CART" },
        });

        for (let idx = 0; idx < carts.length; idx++) {
          const cart = carts[idx];

          const item = await tx.checkoutItem.create({
            data: {
              checkoutId: created.id,
              productId: cart.productId,
              cartId: cart.id,
              quantity: cart.count,
              sortOrder: idx,
            },
          });

          if (cart.cartOptions.length > 0) {
            await tx.checkoutItemOption.createMany({
              data: cart.cartOptions.map((co) => ({
                checkoutItemId: item.id,
                optionValueId: co.optionValueId,
              })),
            });
          }
        }

        return created;
      });

      return NextResponse.json({
        checkoutId: checkout.id,
        redirectUrl: `/checkout?checkoutId=${checkout.id}`,
      });
    }

    return NextResponse.json({ error: "Invalid source" }, { status: 400 });
  } catch (error) {
    console.error("[POST /api/checkouts]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
