import Text from "@/components/Common/Text";
import { StarIcon } from "@/components/Common/Icon";
import { ReviewSummary } from "@/app/types/review";
import styles from "./ReviewRatingSummary.module.scss";

interface ReviewRatingSummaryProps {
  summary: ReviewSummary;
}

const ReviewRatingSummary = ({ summary }: ReviewRatingSummaryProps) => {
  const maxCount = summary.distribution[0].count;

  return (
    <div className={styles.box}>
      <div className={styles.average}>
        <span className={styles.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} filled={i < Math.round(summary.averageRating)} />
          ))}
        </span>
        <Text tag="strong" className={styles.score}>
          {summary.averageRating}
        </Text>
      </div>

      <div className={styles.bars}>
        {summary.distribution.map(({ score, count }) => (
          <div key={score} className={styles.barRow}>
            <Text tag="span" className={styles.barLabel}>
              {score}점
            </Text>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <Text tag="span" className={`${styles.barCount} ${score === 5 ? styles["barCount--top"] : ""}`}>
              {count.toLocaleString()}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewRatingSummary;
