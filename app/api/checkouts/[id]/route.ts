import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkoutDbService } from "@/services/checkout.db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const checkout = await checkoutDbService.getPendingCheckout(id, session.user.id);
    if (!checkout) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(checkout);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status });
  }
}
