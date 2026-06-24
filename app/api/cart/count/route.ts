import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { cartDbService } from "@/services/cart.db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ count: 0 });
  }

  const count = await cartDbService.getCartCount(session.user.id);
  return NextResponse.json({ count });
}
