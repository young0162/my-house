"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/Common/NavBar";
import CategoryList from "@/components/Product/CategoryList";
import ProductCard from "@/components/Product/ProductCard";
import Breadcrumb from "@/components/Common/Breadcrumb";
import MdPick from "@/components/Product/MdPick";
import FilterBar from "@/components/Product/FilterBar";
import SortDropdown from "@/components/Product/SortDropdown";
import { MOCK_PRODUCTS } from "@/constants/product";
import { CATEGORIES, DEFAULT_CATEGORY_ID } from "@/constants/category";
import { SortOption } from "@/app/types/product";
import { useState } from "react";
import styles from "./page.module.scss";
import Divider from "@/components/Common/Divider";

const CategoryPageContent = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id") ?? DEFAULT_CATEGORY_ID;
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  const currentCategory = CATEGORIES.find((c) => c.id === categoryId);

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

              <Divider />
              <FilterBar />

              <div className={styles.toolbar}>
                <span className={styles.totalCount}>전체 {MOCK_PRODUCTS.length}개</span>
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>

              <ul className={styles.grid}>
                {MOCK_PRODUCTS.map((product) => (
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
