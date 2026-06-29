import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/app/generated/prisma";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  ShoppingOrderStep,
  ShoppingOrdersResponse,
} from "@/types/order";

const imageBaseUrl = process.env.PRODUCT_IMAGE_BASE_URL ?? "";
const buildImageUrl = (filename: string) =>
  imageBaseUrl ? `${imageBaseUrl}/${filename}` : filename;

const formatOrderDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const ORDER_STEP_BY_STATUS: Partial<Record<OrderStatus, ShoppingOrderStep>> = {
  PAID: "결제완료",
  SHIPPING: "배송중",
  DELIVERED: "구매확정",
};

const STATUS_LABEL_BY_STATUS = {
  PAID: "결제완료",
  SHIPPING: "배송중",
  DELIVERED: "구매확정",
  CANCELLED: "주문취소",
  REFUNDED: "환불완료",
} as const satisfies Record<OrderStatus, string>;

const DELIVERY_INFO_BY_STATUS = {
  PAID: "배송준비중",
  SHIPPING: "배송중",
  DELIVERED: "배송 완료",
  CANCELLED: "주문취소",
  REFUNDED: "환불완료",
} as const satisfies Record<OrderStatus, string>;

const createEmptySummary = (): Record<ShoppingOrderStep, number> => ({
  입금대기: 0,
  결제완료: 0,
  배송준비: 0,
  배송중: 0,
  배송완료: 0,
  구매확정: 0,
});

export const orderDbService = {
  getShoppingOrders: async (userId: string): Promise<ShoppingOrdersResponse> => {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: [{ orderedAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        status: true,
        orderedAt: true,
        items: {
          orderBy: { id: "asc" },
          select: {
            id: true,
            productName: true,
            productImage: true,
            optionLabel: true,
            price: true,
            quantity: true,
          },
        },
      },
    });

    const summary = createEmptySummary();

    const shoppingOrders = orders.map((order) => {
      const orderStep = ORDER_STEP_BY_STATUS[order.status];
      if (orderStep) summary[orderStep] += 1;

      return {
        id: order.id,
        date: formatOrderDate(order.orderedAt),
        status: STATUS_LABEL_BY_STATUS[order.status],
        deliveryInfo: DELIVERY_INFO_BY_STATUS[order.status],
        products: order.items.map((item) => ({
          name: item.productName,
          option: item.optionLabel ?? "옵션 없음",
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.productImage,
        })),
      };
    });

    return {
      orders: shoppingOrders,
      summary,
    };
  },

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
