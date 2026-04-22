"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/Common/NavBar";
import CategoryList from "@/components/Product/CategoryList";
import ProductCard from "@/components/Product/ProductCard";
import Text from "@/components/Common/Text";
import { MOCK_PRODUCTS, PRODUCT_SORT_OPTIONS } from "@/constants/product";
import { DEFAULT_CATEGORY_ID } from "@/constants/category";
import { SortOption } from "@/app/types/product";
import { useState } from "react";
import styles from "./page.module.scss";

const CategoryPageContent = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id") ?? DEFAULT_CATEGORY_ID;
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  return (
    <>
      <NavBar activeHref="/store/category" />
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.layout}>
            <CategoryList activeCategoryId={categoryId} />

            <div className={styles.content}>
              <div className={styles.toolbar}>
                <Text tag="span" className={styles.totalCount}>
                  총 {MOCK_PRODUCTS.length}개
                </Text>
                <div className={styles.sortOptions}>
                  {PRODUCT_SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`${styles.sortBtn} ${sortBy === option.value ? styles["sortBtn--active"] : ""}`}
                      onClick={() => setSortBy(option.value)}
                    >
                      <Text tag="span" className={styles.sortBtnText}>
                        {option.label}
                      </Text>
                    </button>
                  ))}
                </div>
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
