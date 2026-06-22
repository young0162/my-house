import "dotenv/config";
import { readFileSync } from "node:fs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../app/generated/prisma/index.js";

const COLOR_OPTION_SEED_DOC = "docs/db_seed/option/2026-06-22_color_option_seed_plan.md";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

const parseColorOptionSeed = (filePath) => {
  const content = readFileSync(filePath, "utf8");
  const typeName = content.match(/typeName:\s*"([^"]+)"/)?.[1];
  const valuesBlock = content.match(/values:\s*\[([\s\S]*?)\]/)?.[1] ?? "";
  const values = [...valuesBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1]);

  if (!typeName) {
    throw new Error(`Option typeName not found in ${filePath}`);
  }

  if (values.length === 0) {
    throw new Error(`Option values not found in ${filePath}`);
  }

  return { typeName, values };
};

try {
  const seed = parseColorOptionSeed(COLOR_OPTION_SEED_DOC);
  const before = {
    optionTypes: await prisma.optionType.count(),
    optionValues: await prisma.optionValue.count(),
  };

  const result = await prisma.$transaction(async (tx) => {
    const existingType = await tx.optionType.findUnique({
      where: { name: seed.typeName },
    });

    const optionType = await tx.optionType.upsert({
      where: { name: seed.typeName },
      create: { name: seed.typeName },
      update: {},
    });

    const values = [];

    for (const value of seed.values) {
      const existingValue = await tx.optionValue.findFirst({
        where: {
          typeId: optionType.id,
          value,
        },
      });

      const optionValue =
        existingValue ??
        (await tx.optionValue.create({
          data: {
            typeId: optionType.id,
            value,
          },
        }));

      values.push({
        id: optionValue.id,
        value: optionValue.value,
        action: existingValue === null ? "created" : "reused",
      });
    }

    return {
      optionType: {
        id: optionType.id,
        name: optionType.name,
        action: existingType === null ? "created" : "reused",
      },
      values,
    };
  });

  const after = {
    optionTypes: await prisma.optionType.count(),
    optionValues: await prisma.optionValue.count(),
  };

  console.log(
    JSON.stringify(
      {
        before,
        after,
        parsed: {
          typeName: seed.typeName,
          values: seed.values.length,
        },
        created: {
          optionTypes: result.optionType.action === "created" ? 1 : 0,
          optionValues: result.values.filter((value) => value.action === "created").length,
        },
        reused: {
          optionTypes: result.optionType.action === "reused" ? 1 : 0,
          optionValues: result.values.filter((value) => value.action === "reused").length,
        },
        result,
      },
      null,
      2,
    ),
  );
} finally {
  await prisma.$disconnect();
}
