import { prisma } from "@/lib/prisma";
import { CartSectionType } from "@/types/cart";
import { buildCartOptionLabel, isValidCartOptionSelection } from "@/app/utils/cartOption";

const imageBaseUrl = process.env.PRODUCT_IMAGE_BASE_URL ?? "";
const buildImageUrl = (filename: string) =>
  imageBaseUrl ? `${imageBaseUrl}/${filename}` : filename;

export interface AddCartItemDbParams {
  userId: string;
  productId: number;
  optionValueIds: number[];
}

export interface UpdateCartCountDbParams {
  userId: string;
  cartId: number;
  count: number;
}

export interface UpdateCartOptionsDbParams {
  userId: string;
  cartId: number;
  optionValueIds: number[];
}

export const cartDbService = {
  getCartSections: async (userId: string): Promise<CartSectionType[]> => {
    const carts = await prisma.cart.findMany({
      where: { userId, product: { isActive: true } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        productId: true,
        count: true,
        product: {
          select: {
            image: true,
            name: true,
            price: true,
            isFreeShipping: true,
            brand: { select: { id: true, name: true } },
            productImages: {
              where: { type: "THUMBNAIL" },
              orderBy: { sortOrder: "asc" },
              take: 1,
              select: { url: true },
            },
            productOptions: {
              orderBy: { id: "asc" },
              select: {
                optionType: { select: { name: true } },
                productOptionValues: {
                  select: { optionValue: { select: { id: true, value: true } } },
                },
              },
            },
          },
        },
        cartOptions: {
          orderBy: { id: "asc" },
          select: {
            optionValueId: true,
            optionValue: { select: { value: true, type: { select: { name: true } } } },
          },
        },
      },
    });

    const sectionMap = new Map<number, CartSectionType>();

    for (const cart of carts) {
      const { brand, productImages, image, name, price, isFreeShipping, productOptions } = cart.product;
      const thumbnail = productImages[0]?.url ?? image;
      const optionLabel = buildCartOptionLabel(
        cart.cartOptions.map((co) => ({
          typeName: co.optionValue.type.name,
          value: co.optionValue.value,
        })),
      );

      const item = {
        id: cart.id,
        productId: cart.productId,
        image: buildImageUrl(thumbnail),
        brand: brand.name,
        name,
        optionLabel,
        selectedOptionValueIds: cart.cartOptions.map((co) => co.optionValueId),
        options: productOptions.map((option) => ({
          label: option.optionType.name,
          values: option.productOptionValues.map((pov) => ({
            id: pov.optionValue.id,
            value: pov.optionValue.value,
          })),
        })),
        price,
        quantity: cart.count,
        isFreeShipping,
        deliveryDate: "주문 후 3~5일 이내 출고",
        deliveryMethod: isFreeShipping ? "무료배송" : "일반배송",
      };

      if (sectionMap.has(brand.id)) {
        const section = sectionMap.get(brand.id)!;
        section.items.push(item);
        section.count = section.items.length;
      } else {
        sectionMap.set(brand.id, { id: `brand-${brand.id}`, label: brand.name, count: 1, items: [item] });
      }
    }

    return [...sectionMap.values()];
  },

  getCartCount: async (userId: string): Promise<number> => {
    return prisma.cart.count({
      where: { userId, product: { isActive: true } },
    });
  },

  addCartItem: async ({ userId, productId, optionValueIds }: AddCartItemDbParams): Promise<void> => {
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      select: {
        productOptions: {
          select: { productOptionValues: { select: { optionValueId: true } } },
        },
      },
    });

    if (!product) throw Object.assign(new Error("Product not found"), { status: 404 });

    const validIds = new Set(
      product.productOptions.flatMap((po) => po.productOptionValues.map((pov) => pov.optionValueId)),
    );

    if (optionValueIds.some((id) => !validIds.has(id))) {
      throw Object.assign(new Error("Invalid option value"), { status: 400 });
    }

    if (optionValueIds.length !== product.productOptions.length) {
      throw Object.assign(new Error("All options must be selected"), { status: 400 });
    }

    const requestedSet = new Set<number>(optionValueIds);
    const existingCarts = await prisma.cart.findMany({
      where: { userId, productId },
      select: { id: true, count: true, cartOptions: { select: { optionValueId: true } } },
    });

    const matched = existingCarts.find((cart) => {
      const cartSet = new Set(cart.cartOptions.map((co) => co.optionValueId));
      return cartSet.size === requestedSet.size && [...requestedSet].every((id) => cartSet.has(id));
    });

    if (matched) {
      await prisma.cart.update({ where: { id: matched.id }, data: { count: matched.count + 1 } });
      return;
    }

    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.create({ data: { userId, productId, count: 1 } });
      await tx.cartOption.createMany({
        data: optionValueIds.map((optionValueId) => ({ cartId: cart.id, optionValueId })),
      });
    });
  },

  updateCartCount: async ({ userId, cartId, count }: UpdateCartCountDbParams): Promise<boolean> => {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      select: { userId: true },
    });

    if (!cart || cart.userId !== userId) return false;

    await prisma.cart.update({ where: { id: cartId }, data: { count } });
    return true;
  },

  updateCartOptions: async ({ userId, cartId, optionValueIds }: UpdateCartOptionsDbParams): Promise<boolean> => {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      select: {
        userId: true,
        product: {
          select: {
            productOptions: {
              select: {
                productOptionValues: { select: { optionValue: { select: { id: true } } } },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.userId !== userId) return false;

    const productOptions = cart.product.productOptions.map((option) => ({
      values: option.productOptionValues.map((pov) => ({ id: pov.optionValue.id })),
    }));

    if (!isValidCartOptionSelection(productOptions, optionValueIds)) {
      throw Object.assign(new Error("Invalid option value"), { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.cartOption.deleteMany({ where: { cartId } });
      await tx.cartOption.createMany({
        data: optionValueIds.map((optionValueId) => ({ cartId, optionValueId })),
      });
    });

    return true;
  },

  deleteCartItem: async (userId: string, cartId: number): Promise<boolean> => {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      select: { userId: true },
    });

    if (!cart || cart.userId !== userId) return false;

    await prisma.cart.delete({ where: { id: cartId } });
    return true;
  },
};
