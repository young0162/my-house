"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/Product/ProductCard";
import Text from "@/components/Common/Text";
import { PRODUCT_SORT_OPTIONS, PRODUCT_BANNERS } from "@/constants/product";
import { ProductCardProps, SortOption } from "@/app/types/product";
import { getProducts } from "@/app/services/product";
import styles from "./page.module.scss";
import NavBar from "@/components/Common/NavBar";
import BannerSlider from "@/components/Common/BannerSlider";

const ProductPage = () => {
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [products, setProducts] = useState<ProductCardProps[]>([]);

  useEffect(() => {
    getProducts(sortBy).then(setProducts);
  }, [sortBy]);

  return (
    <>
      <NavBar activeHref="/store" />
      <BannerSlider items={PRODUCT_BANNERS} />
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
              총 {products.length}개
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
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard {...product} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
