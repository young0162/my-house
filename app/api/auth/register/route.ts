import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";
import { hashPassword, isValidPassword } from "@/lib/auth/password";
import { getRegisterConflictMessage } from "@/lib/auth/account";
import { RegisterRequestBody } from "@/app/types/auth";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<RegisterRequestBody>;
  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(body.password ?? "");
  const name = body.name ? String(body.name).trim() : null;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ message: "올바른 이메일을 입력해주세요." }, { status: 400 });
  }

  if (!isValidPassword(password)) {
    return NextResponse.json({ message: "비밀번호는 8자 이상 72자 이하로 입력해주세요." }, { status: 400 });
  }

  const existingUser = await prisma.user.findFirst({
    where: { email, deletedAt: null },
    select: {
      id: true,
      passwordHash: true,
      accounts: { select: { provider: true } },
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: getRegisterConflictMessage({ passwordHash: existingUser.passwordHash, accounts: existingUser.accounts }) },
      { status: 409 },
    );
  }

  try {
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "이미 가입된 이메일입니다." }, { status: 409 });
    }

    return NextResponse.json({ message: "회원가입에 실패했습니다." }, { status: 500 });
  }
}
