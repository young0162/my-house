import { prisma } from "@/lib/prisma";
import { UserAddressView, CreateUserAddressRequest, UpdateUserAddressRequest } from "@/types/checkout";

const ADDRESS_SELECT = {
  id: true,
  recipientName: true,
  phoneNumber: true,
  zipCode: true,
  address: true,
  detailAddress: true,
  isDefault: true,
} as const;

export const addressDbService = {
  getAddresses: async (userId: string): Promise<UserAddressView[]> => {
    return prisma.userAddress.findMany({
      where: { userId, deletedAt: null },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }, { id: "desc" }],
      select: ADDRESS_SELECT,
    });
  },

  getDefaultAddress: async (userId: string): Promise<UserAddressView | null> => {
    const defaultAddr = await prisma.userAddress.findFirst({
      where: { userId, isDefault: true, deletedAt: null },
      select: ADDRESS_SELECT,
    });
    if (defaultAddr) return defaultAddr;

    return prisma.userAddress.findFirst({
      where: { userId, deletedAt: null },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: ADDRESS_SELECT,
    });
  },

  createAddress: async (userId: string, body: CreateUserAddressRequest): Promise<UserAddressView> => {
    const existingCount = await prisma.userAddress.count({ where: { userId, deletedAt: null } });
    const shouldBeDefault = existingCount === 0 || body.isDefault === true;

    return prisma.$transaction(async (tx) => {
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
  },

  updateAddress: async (
    userId: string,
    addressId: number,
    body: UpdateUserAddressRequest,
  ): Promise<UserAddressView | null> => {
    const existing = await prisma.userAddress.findFirst({
      where: { id: addressId, userId, deletedAt: null },
    });
    if (!existing) return null;

    if (body.isDefault === false && existing.isDefault) {
      throw Object.assign(
        new Error("Cannot unset default address directly"),
        { status: 400 },
      );
    }

    return prisma.$transaction(async (tx) => {
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
  },

  deleteAddress: async (userId: string, addressId: number): Promise<boolean> => {
    const existing = await prisma.userAddress.findFirst({
      where: { id: addressId, userId, deletedAt: null },
    });
    if (!existing) return false;

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
          await tx.userAddress.update({ where: { id: next.id }, data: { isDefault: true } });
        }
      }
    });

    return true;
  },
};
