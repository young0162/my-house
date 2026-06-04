"use client";

import { useState } from "react";
import MyReviewTabs from "@/components/MyPage/MyReviewTabs";
import ReviewableProductsSection from "@/components/MyPage/ReviewableProductsSection";
import Text from "@/components/Common/Text";
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
          <div className={styles.empty}>
            <Text fontSize={15} color="gray01">내가 남긴 리뷰가 없습니다.</Text>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReviewPage;
