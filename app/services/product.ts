import axiosInstance from "@/lib/axios";
import { ProductCardProps, SortOption } from "@/app/types/product";

export const getProducts = async (sortBy: SortOption = "recommended"): Promise<ProductCardProps[]> => {
  const { data } = await axiosInstance.get<ProductCardProps[]>("/api/products", {
    params: { sortBy },
  });
  return data;
};
