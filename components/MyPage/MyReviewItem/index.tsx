import Text from "@/components/Common/Text";
import { StarIcon } from "@/components/Common/Icon";
import type { MyReviewItem as MyReviewItemType } from "@/types/review";
import styles from "./MyReviewItem.module.scss";

interface MyReviewItemProps {
  review: MyReviewItemType;
}

const MyReviewItem = ({ review }: MyReviewItemProps) => (
  <article className={styles.card}>
    <header className={styles.header}>
      <Text tag="strong" className={styles.productName}>
        {review.productName}
      </Text>
      <button type="button" className={styles.editBtn}>
        <Text tag="span" fontSize={14} color="gray01">
          수정
        </Text>
      </button>
    </header>

    {review.optionLabel && (
      <Text tag="p" className={styles.option}>
        {review.optionLabel}
      </Text>
    )}

    <div className={styles.meta}>
      <span className={styles.stars}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>
            <StarIcon filled={i < review.rating} />
          </span>
        ))}
      </span>
      <Text tag="span" className={styles.date}>
        {review.createdAt}
      </Text>
      <Text tag="span" className={styles.dot} aria-hidden="true">
        |
      </Text>
      <Text tag="span" className={styles.purchaseSource}>
        오늘의집 구매
      </Text>
    </div>

    <Text tag="p" className={styles.content}>
      {review.content}
    </Text>
  </article>
);

export default MyReviewItem;
