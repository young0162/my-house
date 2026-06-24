import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateUserAddressRequest } from "@/types/checkout";

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

  const addresses = await prisma.userAddress.findMany({
    where: { userId: session.user.id, deletedAt: null },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }, { id: "desc" }],
    select: ADDRESS_SELECT,
  });

  return NextResponse.json({ addresses });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body: CreateUserAddressRequest = await request.json();

  if (!body.recipientName || !body.phoneNumber || !body.address) {
    return NextResponse.json({ error: "recipientName, phoneNumber, address are required" }, { status: 400 });
  }

  try {
    const existingCount = await prisma.userAddress.count({
      where: { userId, deletedAt: null },
    });

    const shouldBeDefault = existingCount === 0 || body.isDefault === true;

    const address = await prisma.$transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx.userAddress.updateMany({
          where: { userId, isDefault: true, deletedAt: null },
          data: { isDefault: false },
        });
      }

      return tx.userAddress.create({
        data: {
          userId,
          recipientName: body.recipientName,
          phoneNumber: body.phoneNumber,
          zipCode: body.zipCode ?? null,
          address: body.address,
          detailAddress: body.detailAddress ?? null,
          isDefault: shouldBeDefault,
        },
        select: ADDRESS_SELECT,
      });
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error("[POST /api/me/addresses]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
