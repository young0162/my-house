"use client";

import { useState } from "react";
import Image from "next/image";
import Text from "@/components/Common/Text";
import { StarIcon, ThumbUpIcon } from "@/components/Common/Icon";
import { ReviewItem } from "@/app/types/review";
import styles from "./ReviewCard.module.scss";

interface ReviewCardProps {
  review: ReviewItem;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [isHelpful, setIsHelpful] = useState(false);

  const handleHelpful = () => {
    const next = !isHelpful;
    setIsHelpful(next);
    setHelpfulCount((c) => (next ? c + 1 : c - 1));
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.avatar} aria-hidden="true">
          <Text tag="span" className={styles.avatarInitial}>
            {review.username[0].toUpperCase()}
          </Text>
        </div>

        <div className={styles.meta}>
          <Text tag="strong" className={styles.username}>
            {review.username}
          </Text>
          <div className={styles.ratingRow}>
            <span className={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} filled={i < review.rating} />
              ))}
            </span>
            <Text tag="span" className={styles.date}>
              {review.date}
            </Text>
            <Text tag="span" className={styles.dot} aria-hidden="true">
              ·
            </Text>
            <Text tag="span" className={styles.purchaseType}>
              {review.purchaseType}
            </Text>
          </div>
        </div>
      </header>

      {review.selectedOption ? (
        <Text tag="p" className={styles.selectedOption}>
          {review.selectedOption}
        </Text>
      ) : null}

      {review.images && review.images.length > 0 ? (
        <ul className={styles.imageList}>
          {review.images.map((src, i) => (
            <li key={i} className={styles.imageItem}>
              <Image
                src={src}
                alt={`리뷰 이미지 ${i + 1}`}
                width={120}
                height={120}
                className={styles.reviewImage}
              />
            </li>
          ))}
        </ul>
      ) : null}

      <Text tag="p" className={styles.content}>
        {review.content}
      </Text>

      <footer className={styles.footer}>
        <button
          type="button"
          className={`${styles.helpfulBtn} ${isHelpful ? styles["helpfulBtn--active"] : ""}`}
          onClick={handleHelpful}
          aria-pressed={isHelpful}
        >
          <ThumbUpIcon />
          <Text tag="span">도움돼요</Text>
          <Text tag="span" className={styles.helpfulCount}>
            {helpfulCount}
          </Text>
        </button>
      </footer>
    </article>
  );
};

export default ReviewCard;
