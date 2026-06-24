import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UpdateUserAddressRequest } from "@/types/checkout";

const ADDRESS_SELECT = {
  id: true,
  recipientName: true,
  phoneNumber: true,
  zipCode: true,
  address: true,
  detailAddress: true,
  isDefault: true,
} as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = await params;
  const addressId = Number(id);

  if (isNaN(addressId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const existing = await prisma.userAddress.findFirst({
    where: { id: addressId, userId, deletedAt: null },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body: UpdateUserAddressRequest = await request.json();

  if (body.isDefault === false && existing.isDefault) {
    return NextResponse.json(
      { error: "Cannot unset default address directly. Set another address as default instead." },
      { status: 400 },
    );
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      if (body.isDefault === true) {
        await tx.userAddress.updateMany({
          where: { userId, isDefault: true, deletedAt: null },
          data: { isDefault: false },
        });
      }

      return tx.userAddress.update({
        where: { id: addressId },
        data: {
          ...(body.recipientName !== undefined && { recipientName: body.recipientName }),
          ...(body.phoneNumber !== undefined && { phoneNumber: body.phoneNumber }),
          ...(body.zipCode !== undefined && { zipCode: body.zipCode }),
          ...(body.address !== undefined && { address: body.address }),
          ...(body.detailAddress !== undefined && { detailAddress: body.detailAddress }),
          ...(body.isDefault === true && { isDefault: true }),
        },
        select: ADDRESS_SELECT,
      });
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/me/addresses/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = await params;
  const addressId = Number(id);

  if (isNaN(addressId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const existing = await prisma.userAddress.findFirst({
    where: { id: addressId, userId, deletedAt: null },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.userAddress.update({
        where: { id: addressId },
        data: { deletedAt: new Date() },
      });

      if (existing.isDefault) {
        const next = await tx.userAddress.findFirst({
          where: { userId, deletedAt: null, id: { not: addressId } },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          select: { id: true },
        });

        if (next) {
          await tx.userAddress.update({
            where: { id: next.id },
            data: { isDefault: true },
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/me/addresses/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
