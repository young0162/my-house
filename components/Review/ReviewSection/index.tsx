"use client";

import { useState } from "react";
import Text from "@/components/Common/Text";
import ReviewRatingSummary from "@/components/Review/ReviewRatingSummary";
import ReviewSortBar from "@/components/Review/ReviewSortBar";
import ReviewCard from "@/components/Review/ReviewCard";
import { ReviewSortType } from "@/app/types/review";
import { MOCK_REVIEW_SUMMARY, MOCK_REVIEWS } from "@/constants/review";
import styles from "./ReviewSection.module.scss";

interface ReviewSectionProps {
  totalCount: number;
}

const ReviewSection = ({ totalCount }: ReviewSectionProps) => {
  const [sortType, setSortType] = useState<ReviewSortType>("best");

  const sortedReviews = sortType === "newest"
    ? [...MOCK_REVIEWS].sort((a, b) => b.date.localeCompare(a.date))
    : [...MOCK_REVIEWS].sort((a, b) => b.helpfulCount - a.helpfulCount);

  return (
    <div className={styles.section}>
      <header className={styles.header}>
        <Text tag="h2" className={styles.title}>
          리뷰{" "}
          <Text tag="strong" className={styles.titleCount}>
            {totalCount.toLocaleString()}
          </Text>
        </Text>
        <button type="button" className={styles.writeBtn}>
          <Text tag="span">리뷰 남기기</Text>
        </button>
      </header>

      <ReviewRatingSummary summary={MOCK_REVIEW_SUMMARY} />

      <ReviewSortBar sortType={sortType} onSortChange={setSortType} />

      <div className={styles.appBanner}>
        <Text tag="p" className={styles.appBannerText}>
          앱에서는{" "}
          <Text tag="strong" className={styles.appBannerHighlight}>
            더 많은 사진과 동영상 리뷰
          </Text>
          를 볼 수 있어요
        </Text>
      </div>

      <ul className={styles.reviewList}>
        {sortedReviews.map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewSection;
