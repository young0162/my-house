import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { reviewDbService } from "@/services/review.db";
import type { CreateReviewRequest } from "@/types/review";

export const POST = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: CreateReviewRequest = await req.json();
    const data = await reviewDbService.createReview(session.user.id, body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    const status = err.status ?? 500;
    return NextResponse.json({ message: err.message ?? "Internal server error" }, { status });
  }
};
