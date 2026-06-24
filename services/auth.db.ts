import { Prisma } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";
import { hashPassword, isValidPassword } from "@/lib/auth/password";
import { getRegisterConflictMessage } from "@/lib/auth/account";
import { RegisterRequestBody, RegisterResponseBody } from "@/app/types/auth/index";

export const authDbService = {
  registerUser: async (body: Partial<RegisterRequestBody>): Promise<RegisterResponseBody> => {
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const name = body.name ? String(body.name).trim() : null;

    if (!email || !email.includes("@")) {
      throw Object.assign(new Error("올바른 이메일을 입력해주세요."), { status: 400 });
    }

    if (!isValidPassword(password)) {
      throw Object.assign(new Error("비밀번호는 8자 이상 72자 이하로 입력해주세요."), { status: 400 });
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
      throw Object.assign(
        new Error(getRegisterConflictMessage({ passwordHash: existingUser.passwordHash, accounts: existingUser.accounts })),
        { status: 409 },
      );
    }

    try {
      const passwordHash = await hashPassword(password);
      const created = await prisma.user.create({
        data: { email, name, passwordHash },
        select: { id: true, email: true, name: true },
      });
      return { id: created.id, email: created.email ?? email, name: created.name };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw Object.assign(new Error("이미 가입된 이메일입니다."), { status: 409 });
      }
      throw Object.assign(new Error("회원가입에 실패했습니다."), { status: 500 });
    }
  },
};
