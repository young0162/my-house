import CategoryPageContent from "@/components/Product/CategoryPageContent";
import { categoryDbService } from "@/services/category.db";

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
  const categoryTree = await categoryDbService.getCategoryTree(selectedCategoryId);

  return <CategoryPageContent categoryTree={categoryTree} />;
};

export default CategoryPage;
