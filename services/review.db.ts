import { prisma } from "@/lib/prisma";
import type { CreateReviewRequest, CreateReviewResponse, MyReviewSortType, MyReviewListResponse } from "@/types/review";

export const reviewDbService = {
  getMyReviews: async (userId: string, sort: MyReviewSortType): Promise<MyReviewListResponse> => {
    const orderBy = sort === "best" ? { rating: "desc" as const } : { createdAt: "desc" as const };

    const reviews = await prisma.review.findMany({
      where: { userId },
      orderBy,
      include: {
        orderItem: { select: { productName: true, optionLabel: true } },
      },
    });

    return {
      reviews: reviews.map((r) => ({
        id: r.id,
        productName: r.orderItem.productName,
        optionLabel: r.orderItem.optionLabel,
        rating: r.rating,
        createdAt: r.createdAt.toISOString().slice(0, 10).replace(/-/g, "."),
        content: r.description,
        image: r.image,
      })),
      total: reviews.length,
    };
  },

  createReview: async (userId: string, params: CreateReviewRequest): Promise<CreateReviewResponse> => {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: params.orderItemId },
      select: { id: true, order: { select: { userId: true } } },
    });

    if (!orderItem || orderItem.order.userId !== userId) {
      throw Object.assign(new Error("Order item not found"), { status: 404 });
    }

    const existing = await prisma.review.findUnique({
      where: { orderItemId: params.orderItemId },
    });
    if (existing) {
      throw Object.assign(new Error("Already reviewed"), { status: 409 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const review = await prisma.review.create({
      data: {
        userId,
        orderItemId: params.orderItemId,
        name: user?.name ?? "",
        rating: params.rating,
        description: params.content,
        image: params.imageUrl ?? null,
      },
    });

    return { id: review.id };
  },
};
