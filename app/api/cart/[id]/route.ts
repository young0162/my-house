import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    select: { userId: true },
  });

  if (!cart || cart.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.cart.update({
    where: { id: cartId },
    data: { count },
  });

  return NextResponse.json({ success: true });
}
