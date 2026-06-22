import { readFileSync } from "node:fs";
import { runSeed } from "./seed-runner.mjs";

const parseOptionSeed = (filePath) => {
  const content = readFileSync(filePath, "utf8");
  const typeName = content.match(/typeName:\s*"([^"]+)"/)?.[1];
  const valuesBlock = content.match(/values:\s*\[([\s\S]*?)\]/)?.[1] ?? "";
  const values = [...valuesBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1]);

  if (!typeName) throw new Error(`Option typeName not found in ${filePath}`);
  if (values.length === 0) throw new Error(`Option values not found in ${filePath}`);

  return { typeName, values };
};

export const seedOption = (docPath) =>
  runSeed(async (prisma) => {
    const seed = parseOptionSeed(docPath);
    const before = {
      optionTypes: await prisma.optionType.count(),
      optionValues: await prisma.optionValue.count(),
    };

    const result = await prisma.$transaction(async (tx) => {
      const existingType = await tx.optionType.findUnique({ where: { name: seed.typeName } });
      const optionType = await tx.optionType.upsert({
        where: { name: seed.typeName },
        create: { name: seed.typeName },
        update: {},
      });

      const values = [];
      for (const value of seed.values) {
        const existingValue = await tx.optionValue.findFirst({
          where: { typeId: optionType.id, value },
        });
        const optionValue =
          existingValue ??
          (await tx.optionValue.create({ data: { typeId: optionType.id, value } }));

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
          parsed: { typeName: seed.typeName, values: seed.values.length },
          created: {
            optionTypes: result.optionType.action === "created" ? 1 : 0,
            optionValues: result.values.filter((v) => v.action === "created").length,
          },
          reused: {
            optionTypes: result.optionType.action === "reused" ? 1 : 0,
            optionValues: result.values.filter((v) => v.action === "reused").length,
          },
          result,
        },
        null,
        2,
      ),
    );
  });
