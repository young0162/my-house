import { NextRequest, NextResponse } from "next/server";
import { authDbService } from "@/services/auth.db";
import { RegisterRequestBody } from "@/app/types/auth/index";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<RegisterRequestBody>;

  try {
    const user = await authDbService.registerUser(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "회원가입에 실패했습니다.";
    return NextResponse.json({ message }, { status });
  }
}
