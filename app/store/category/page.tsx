"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/Common/NavBar";
import CategoryList from "@/components/Product/CategoryList";
import ProductCard from "@/components/Product/ProductCard";
import Breadcrumb from "@/components/Common/Breadcrumb";
import MdPick from "@/components/Product/MdPick";
import FilterBar from "@/components/Product/FilterBar";
import SortDropdown from "@/components/Product/SortDropdown";
import { CATEGORIES, DEFAULT_CATEGORY_ID } from "@/constants/category";
import { ProductCardProps, SortOption } from "@/app/types/product";
import styles from "./page.module.scss";
import Divider from "@/components/Common/Divider";

const CategoryPageContent = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id") ?? DEFAULT_CATEGORY_ID;
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [products, setProducts] = useState<ProductCardProps[]>([]);

  const currentCategory = CATEGORIES.find((c) => c.id === categoryId);

  useEffect(() => {
    fetch(`/api/products?sortBy=${sortBy}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [sortBy]);

  return (
    <>
      <NavBar activeHref="/store/category" />
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.layout}>
            <CategoryList activeCategoryId={categoryId} />

            <div className={styles.content}>
              <div className={styles.breadcrumbRow}>
                <Breadcrumb
                  items={[{ label: "스토어", href: "/store" }, { label: currentCategory?.label ?? "카테고리" }]}
                />
              </div>

              <Divider height={25} />
              <MdPick />

              <Divider height={30} />
              <FilterBar />

              <Divider height={30} />
              <div className={styles.toolbar}>
                <span className={styles.totalCount}>전체 {products.length}개</span>
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>

              <ul className={styles.grid}>
                {products.map((product) => (
                  <li key={product.id}>
                    <ProductCard {...product} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CategoryPage = () => {
  return (
    <Suspense>
      <CategoryPageContent />
    </Suspense>
  );
};

export default CategoryPage;
