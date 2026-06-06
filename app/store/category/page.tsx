import CategoryPageContent from "@/components/Product/CategoryPageContent";
import { prisma } from "@/lib/prisma";
import { buildCategoryTree } from "./categoryTree";

interface CategoryPageProps {
  searchParams: Promise<{
    category_id?: string | string[];
  }>;
}

const parseCategoryId = (value: string | string[] | undefined) => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const categoryId = Number.parseInt(rawValue ?? "", 10);

  return Number.isNaN(categoryId) ? 0 : categoryId;
};

const CategoryPage = async ({ searchParams }: CategoryPageProps) => {
  const { category_id } = await searchParams;
  const selectedCategoryId = parseCategoryId(category_id);
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ depth: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
      depth: true,
      sortOrder: true,
      parentId: true,
    },
  });
  const categoryTree = buildCategoryTree(categories, selectedCategoryId);

  

  return <CategoryPageContent categoryTree={categoryTree} />;
};

export default CategoryPage;
