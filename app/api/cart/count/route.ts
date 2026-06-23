import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ count: 0 });
  }

  const count = await prisma.cart.count({
    where: {
      userId: session.user.id,
      product: { isActive: true },
    },
  });

  return NextResponse.json({ count });
}
