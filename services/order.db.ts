import { prisma } from "@/lib/prisma";
import { CreateOrderRequest, CreateOrderResponse } from "@/types/order";

const imageBaseUrl = process.env.PRODUCT_IMAGE_BASE_URL ?? "";
const buildImageUrl = (filename: string) =>
  imageBaseUrl ? `${imageBaseUrl}/${filename}` : filename;

export const orderDbService = {
  createOrder: async (
    userId: string,
    params: CreateOrderRequest,
  ): Promise<CreateOrderResponse> => {
    const checkout = await prisma.checkout.findUnique({
      where: { id: params.checkoutId },
      select: {
        id: true,
        userId: true,
        source: true,
        status: true,
        items: {
          select: {
            id: true,
            quantity: true,
            cartId: true,
            product: {
              select: {
                name: true,
                price: true,
                originalPrice: true,
                isFreeShipping: true,
                image: true,
                brand: { select: { name: true } },
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

    if (!checkout || checkout.userId !== userId) {
      throw Object.assign(new Error("Checkout not found"), { status: 404 });
    }
    if (checkout.status !== "PENDING") {
      throw Object.assign(new Error("Checkout already used"), { status: 409 });
    }

    const totalProductPrice = checkout.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const finalPrice = totalProductPrice;

    const order = await prisma.order.create({
      data: {
        userId,
        checkoutId: checkout.id,
        ordererName: params.ordererName,
        ordererEmail: params.ordererEmail,
        ordererPhone: params.ordererPhone,
        recipientName: params.recipientName,
        recipientPhone: params.recipientPhone,
        zipCode: params.zipCode ?? null,
        address: params.address,
        detailAddress: params.detailAddress ?? null,
        deliveryRequest: params.deliveryRequest ?? null,
        paymentMethod: params.paymentMethod,
        totalProductPrice,
        shippingFee: 0,
        couponDiscount: 0,
        pointDiscount: 0,
        finalPrice,
        pointEarned: Math.floor(finalPrice * 0.001),
      },
    });

    for (const item of checkout.items) {
      const { product } = item;
      const thumbnail = product.productImages[0]?.url ?? product.image;
      const optionLabel = item.options
        .map((o) => `${o.optionValue.type.name}: ${o.optionValue.value}`)
        .join(" / ");

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productName: product.name,
          brandName: product.brand.name,
          productImage: buildImageUrl(thumbnail),
          optionLabel: optionLabel || null,
          price: product.price,
          originalPrice: product.originalPrice ?? null,
          quantity: item.quantity,
          isFreeShipping: product.isFreeShipping,
          deliveryMethod: product.isFreeShipping ? "무료배송" : "일반배송",
        },
      });
    }

    const cartIds = checkout.items
      .map((item) => item.cartId)
      .filter((id): id is number => id !== null);

    await prisma.checkout.update({
      where: { id: checkout.id },
      data: { status: "ORDERED" },
    });

    if (cartIds.length > 0) {
      await prisma.cart.deleteMany({ where: { id: { in: cartIds }, userId } });
    }

    return { orderId: order.id };
  },
};
