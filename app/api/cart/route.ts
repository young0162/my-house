import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { cartDbService } from "@/services/cart.db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const sections = await cartDbService.getCartSections(session.user.id);
  return NextResponse.json({ sections });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { productId, optionValueIds } = body;

  if (
    typeof productId !== "number" ||
    !Array.isArray(optionValueIds) ||
    optionValueIds.length === 0 ||
    optionValueIds.some((id) => typeof id !== "number")
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    await cartDbService.addCartItem({ userId: session.user.id, productId, optionValueIds });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status });
  }
}
