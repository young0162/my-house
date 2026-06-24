import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADDRESS_SELECT = {
  id: true,
  recipientName: true,
  phoneNumber: true,
  zipCode: true,
  address: true,
  detailAddress: true,
  isDefault: true,
} as const;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const defaultAddress = await prisma.userAddress.findFirst({
    where: { userId, isDefault: true, deletedAt: null },
    select: ADDRESS_SELECT,
  });

  if (defaultAddress) {
    return NextResponse.json({ address: defaultAddress });
  }

  const fallback = await prisma.userAddress.findFirst({
    where: { userId, deletedAt: null },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: ADDRESS_SELECT,
  });

  return NextResponse.json({ address: fallback ?? null });
}
