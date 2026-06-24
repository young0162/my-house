import { api } from "@/lib/api";
import { ProductCardProps, SortOption } from "@/app/types/product/index";
import { ProductDetail } from "@/app/types/productDetail/index";

export interface ProductListQuery {
  sortBy?: SortOption;
  categoryId?: number | string;
}

export const productApiService = {
  getProducts: async (params?: ProductListQuery): Promise<ProductCardProps[]> => {
    const res = await api.get<ProductCardProps[]>("/products", { params });
    return res.data;
  },

  getProductDetail: async (id: number): Promise<ProductDetail> => {
    const res = await api.get<ProductDetail>(`/products/${id}`);
    return res.data;
  },
};
