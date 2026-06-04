import { useState } from "react";
import { RatingStarIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import styles from "./index.module.scss";

interface ReviewRatingFieldProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  error?: string;
  firstStarRef?: React.RefObject<HTMLButtonElement | null>;
}

const ReviewRatingField = ({ rating, onRatingChange, error, firstStarRef }: ReviewRatingFieldProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onRatingChange(Math.min(5, rating + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onRatingChange(Math.max(0, rating - 1));
    } else if (e.key >= "1" && e.key <= "5") {
      onRatingChange(Number(e.key));
    }
  };

  return (
    <div className={styles.root}>
      <Text fontSize={15} fontWeight={700} color="gray01">이 상품 어떠셨나요?</Text>
      <div
        className={styles.stars}
        onMouseLeave={() => setHoverRating(0)}
        role="group"
        aria-label="별점 선택"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            ref={i === 0 ? firstStarRef : undefined}
            type="button"
            className={styles.starBtn}
            aria-label={`${i + 1}점`}
            aria-pressed={rating === i + 1}
            data-star={i + 1}
            onClick={() => onRatingChange(i + 1)}
            onMouseEnter={() => setHoverRating(i + 1)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            <RatingStarIcon size={54} filled={i < displayRating} />
          </button>
        ))}
      </div>
      {error && <Text fontSize={12} className={styles.error}>{error}</Text>}
    </div>
  );
};

export default ReviewRatingField;
