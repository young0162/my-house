import { prisma } from "./prisma.mjs";

export const runSeed = async (seedFn) => {
  try {
    await seedFn(prisma);
  } finally {
    await prisma.$disconnect();
  }
};
