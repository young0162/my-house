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
  const { count } = body;
  if (typeof count !== "number" || count < 1) {
    return NextResponse.json({ error: "Invalid count" }, { status: 400 });
  }

  const updated = await cartDbService.updateCartCount({ userId: session.user.id, cartId, count });
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
