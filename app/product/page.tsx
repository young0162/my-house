"use client";

import { useState } from "react";
import ProductCard from "@/components/Product/ProductCard";
import Text from "@/components/Common/Text";
import { MOCK_PRODUCTS, PRODUCT_SORT_OPTIONS } from "@/constants/product";
import { SortOption } from "@/app/types/product";
import styles from "./page.module.scss";

const ProductPage = () => {
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.pageHeader}>
          <Text tag="h1" className={styles.title}>
            스토어
          </Text>
          <Text tag="p" className={styles.subtitle}>
            오늘의집이 엄선한 인테리어 제품을 만나보세요
          </Text>
        </header>

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
  );
};

export default ProductPage;
