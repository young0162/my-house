import { prisma } from "@/lib/prisma";
import { buildCategoryTree } from "@/app/store/category/categoryTree";
import { CategoryTreeResult } from "@/app/types/category";

export const categoryDbService = {
  getCategoryTree: async (selectedCategoryId: number): Promise<CategoryTreeResult> => {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ depth: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
      select: { id: true, name: true, depth: true, sortOrder: true, parentId: true },
    });
    return buildCategoryTree(categories, selectedCategoryId);
  },

  getDescendantCategoryIds: async (categoryId: number): Promise<number[]> => {
    const all = await prisma.category.findMany({ select: { id: true, parentId: true } });
    const result: number[] = [categoryId];
    const queue = [categoryId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const c of all) {
        if (c.parentId === current) {
          result.push(c.id);
          queue.push(c.id);
        }
      }
    }
    return result;
  },
};
