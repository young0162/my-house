import { prisma } from "@/lib/prisma";
import {
  CreateCheckoutProductRequest,
  CreateCheckoutCartRequest,
  CreateCheckoutResponse,
  CheckoutResponse,
  CheckoutSection,
} from "@/types/checkout";

const imageBaseUrl = process.env.PRODUCT_IMAGE_BASE_URL ?? "";
const buildImageUrl = (filename: string) =>
  imageBaseUrl ? `${imageBaseUrl}/${filename}` : filename;

export const checkoutDbService = {
  createFromProductDetail: async (
    userId: string,
    params: Omit<CreateCheckoutProductRequest, "source">,
  ): Promise<CreateCheckoutResponse> => {
    const { productId, optionValueIds, quantity } = params;

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

    const checkout = await prisma.$transaction(async (tx) => {
      const created = await tx.checkout.create({ data: { userId, source: "PRODUCT_DETAIL" } });
      const item = await tx.checkoutItem.create({
        data: { checkoutId: created.id, productId, quantity },
      });
      if (optionValueIds.length > 0) {
        await tx.checkoutItemOption.createMany({
          data: optionValueIds.map((optionValueId) => ({ checkoutItemId: item.id, optionValueId })),
        });
      }
      return created;
    });

    return { checkoutId: checkout.id, redirectUrl: `/checkout?checkoutId=${checkout.id}` };
  },

  createFromCart: async (
    userId: string,
    params: Omit<CreateCheckoutCartRequest, "source">,
  ): Promise<CreateCheckoutResponse> => {
    const { cartIds } = params;

    const carts = await prisma.cart.findMany({
      where: { id: { in: cartIds }, userId },
      select: {
        id: true,
        productId: true,
        count: true,
        cartOptions: { select: { optionValueId: true } },
      },
    });

    if (carts.length !== cartIds.length) {
      throw Object.assign(new Error("Some cart items not found"), { status: 400 });
    }

    const checkout = await prisma.$transaction(async (tx) => {
      const created = await tx.checkout.create({ data: { userId, source: "CART" } });
      for (let idx = 0; idx < carts.length; idx++) {
        const cart = carts[idx];
        const item = await tx.checkoutItem.create({
          data: {
            checkoutId: created.id,
            productId: cart.productId,
            cartId: cart.id,
            quantity: cart.count,
            sortOrder: idx,
          },
        });
        if (cart.cartOptions.length > 0) {
          await tx.checkoutItemOption.createMany({
            data: cart.cartOptions.map((co) => ({
              checkoutItemId: item.id,
              optionValueId: co.optionValueId,
            })),
          });
        }
      }
      return created;
    });

    return { checkoutId: checkout.id, redirectUrl: `/checkout?checkoutId=${checkout.id}` };
  },

  getPendingCheckout: async (checkoutId: string, userId: string): Promise<CheckoutResponse | null> => {
    const checkout = await prisma.checkout.findUnique({
      where: { id: checkoutId },
      select: {
        id: true,
        userId: true,
        source: true,
        status: true,
        items: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            productId: true,
            quantity: true,
            product: {
              select: {
                name: true,
                price: true,
                isFreeShipping: true,
                image: true,
                brand: { select: { id: true, name: true } },
                productImages: {
                  where: { type: "THUMBNAIL" },
                  orderBy: { sortOrder: "asc" },
                  take: 1,
                  select: { url: true },
                },
              },
            },
            options: {
              select: {
                optionValue: { select: { value: true, type: { select: { name: true } } } },
              },
            },
          },
        },
      },
    });

    if (!checkout || checkout.userId !== userId) return null;
    if (checkout.status !== "PENDING") throw Object.assign(new Error("Checkout unavailable"), { status: 409 });

    const sectionMap = new Map<number, CheckoutSection>();

    for (const item of checkout.items) {
      const { product } = item;
      const thumbnail = product.productImages[0]?.url ?? product.image;
      const optionLabel = item.options
        .map((o) => `${o.optionValue.type.name}: ${o.optionValue.value}`)
        .join(" / ");

      const itemView = {
        id: item.id,
        productId: item.productId,
        image: buildImageUrl(thumbnail),
        brand: product.brand.name,
        name: product.name,
        optionLabel,
        price: product.price,
        quantity: item.quantity,
        isFreeShipping: product.isFreeShipping,
        deliveryMethod: product.isFreeShipping ? "무료배송" : "일반배송",
      };

      const brandId = product.brand.id;
      if (sectionMap.has(brandId)) {
        const section = sectionMap.get(brandId)!;
        section.items.push(itemView);
        section.count = section.items.length;
      } else {
        sectionMap.set(brandId, {
          id: `brand-${brandId}`,
          label: product.brand.name,
          count: 1,
          items: [itemView],
        });
      }
    }

    const sections = [...sectionMap.values()];
    const totalProductPrice = sections
      .flatMap((s) => s.items)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = 0;
    const finalPrice = totalProductPrice + shippingFee;

    return {
      id: checkout.id,
      source: checkout.source,
      status: checkout.status,
      totalProductPrice,
      shippingFee,
      finalPrice,
      pointEarned: Math.floor(finalPrice * 0.001),
      sections,
    };
  },
};
