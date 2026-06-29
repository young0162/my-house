import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { orderDbService } from "@/services/order.db";

export const GET = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await orderDbService.getOrderDetail(session.user.id, id);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    const status = err.status ?? 500;
    return NextResponse.json({ message: err.message ?? "Internal server error" }, { status });
  }
};
