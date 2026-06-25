import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { cartDbService } from "@/services/cart.db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const cartId = Number(id);
  if (isNaN(cartId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await request.json();
  const { count, optionValueIds } = body;

  if (Array.isArray(optionValueIds)) {
    if (optionValueIds.length === 0 || optionValueIds.some((optionValueId) => typeof optionValueId !== "number")) {
      return NextResponse.json({ error: "Invalid option value" }, { status: 400 });
    }

    try {
      const updated = await cartDbService.updateCartOptions({ userId: session.user.id, cartId, optionValueIds });
      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    } catch (error) {
      const status = (error as { status?: number }).status ?? 500;
      const message = error instanceof Error ? error.message : "Internal server error";
      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json({ success: true });
  }

  if (typeof count !== "number" || count < 1) {
    return NextResponse.json({ error: "Invalid count" }, { status: 400 });
  }

  const updated = await cartDbService.updateCartCount({ userId: session.user.id, cartId, count });
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const cartId = Number(id);
  if (isNaN(cartId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const deleted = await cartDbService.deleteCartItem(session.user.id, cartId);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
