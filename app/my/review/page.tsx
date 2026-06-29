"use client";

import { useState } from "react";
import MyReviewTabs from "@/components/MyPage/MyReviewTabs";
import ReviewableProductsSection from "@/components/MyPage/ReviewableProductsSection";
import MyReviewSection from "@/components/MyPage/MyReviewSection";
import { MOCK_REVIEWABLE_PRODUCTS } from "@/constants/myReview";
import type { MyReviewTab } from "@/types/myReview";
import styles from "./page.module.scss";

const ReviewPage = () => {
  const [activeTab, setActiveTab] = useState<MyReviewTab>("리뷰 남기기");

  return (
    <div className={styles.root}>
      <MyReviewTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <main className={styles.container}>
        {activeTab === "리뷰 남기기" ? (
          <ReviewableProductsSection products={MOCK_REVIEWABLE_PRODUCTS} />
        ) : (
          <MyReviewSection />
        )}
      </main>
    </div>
  );
};

export default ReviewPage;
