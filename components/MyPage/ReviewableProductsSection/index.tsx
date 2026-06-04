"use client";

import { useState } from "react";
import Text from "@/components/Common/Text";
import ReviewProductSearchForm from "@/components/MyPage/ReviewProductSearchForm";
import ReviewableProductList from "@/components/MyPage/ReviewableProductList";
import type { ReviewableProduct } from "@/types/myReview";
import styles from "./index.module.scss";

interface ReviewableProductsSectionProps {
  products: ReviewableProduct[];
}

const ReviewableProductsSection = ({ products }: ReviewableProductsSectionProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = (q: string) => setQuery(q);

  const handleReviewClick = (_id: string) => {};

  const filtered = query
    ? products.filter(
        (p) =>
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.name.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  return (
    <section className={styles.section}>
      <Text tag="h1" fontSize={18} fontWeight={700} color="gray01" className={styles.title}>
        내가 사용하는 상품 리뷰쓰기
      </Text>
      <ReviewProductSearchForm onSearch={handleSearch} />
      <ReviewableProductList
        products={filtered}
        isSearched={query.length > 0}
        onReviewClick={handleReviewClick}
      />
    </section>
  );
};

export default ReviewableProductsSection;
