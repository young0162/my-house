"use client";

import { useState } from "react";
import Text from "@/components/Common/Text";
import ReviewProductSearchForm from "@/components/MyPage/ReviewProductSearchForm";
import ReviewableProductList from "@/components/MyPage/ReviewableProductList";
import ReviewWriteModal from "@/components/MyPage/ReviewWriteModal";
import type { ReviewableProduct, ReviewDraft } from "@/types/myReview";
import styles from "./ReviewableProductsSection.module.scss";

interface ReviewableProductsSectionProps {
  products: ReviewableProduct[];
}

const ReviewableProductsSection = ({ products }: ReviewableProductsSectionProps) => {
  const [query, setQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleReviewClick = (id: string) => setSelectedProductId(id);

  const handleModalClose = () => setSelectedProductId(null);

  const handleModalSubmit = (_draft: ReviewDraft) => handleModalClose();

  const filtered = query
    ? products.filter(
        (p) =>
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.name.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  const selectedProduct = products.find((p) => p.id === selectedProductId) ?? null;

  return (
    <section className={styles.section}>
      <Text tag="h1" fontSize={18} fontWeight={700} color="gray01" className={styles.title}>
        내가 사용하는 상품 리뷰쓰기
      </Text>
      <ReviewProductSearchForm onSearch={setQuery} />
      <ReviewableProductList
        products={filtered}
        isSearched={query.length > 0}
        onReviewClick={handleReviewClick}
      />

      {selectedProduct && (
        <ReviewWriteModal
          product={selectedProduct}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </section>
  );
};

export default ReviewableProductsSection;
