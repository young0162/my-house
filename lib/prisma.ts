import { PrismaClient } from "@/app/generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "prisma/config";

const adapter = new PrismaMariaDb({
  host: env("DATABASE_HOST"),
  user: env("DATABASE_USER"),
  password: env("DATABASE_PASSWORD"),
  database: env("DATABASE_NAME"),
  port: Number(env("DATABASE_PORT")),
  connectionLimit: 5,
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
