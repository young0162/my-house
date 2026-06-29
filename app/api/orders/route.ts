import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { orderDbService } from "@/services/order.db";
import { CreateOrderRequest } from "@/types/order";

export const GET = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await orderDbService.getShoppingOrders(session.user.id);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: CreateOrderRequest = await req.json();
    const data = await orderDbService.createOrder(session.user.id, body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    const status = err.status ?? 500;
    return NextResponse.json({ message: err.message ?? "Internal server error" }, { status });
  }
};
