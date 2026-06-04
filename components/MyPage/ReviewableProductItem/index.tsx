import Image from "next/image";
import Text from "@/components/Common/Text";
import type { ReviewableProduct } from "@/types/myReview";
import styles from "./ReviewableProductItem.module.scss";

interface ReviewableProductItemProps {
  product: ReviewableProduct;
  onReviewClick: (id: string) => void;
}

const ReviewableProductItem = ({ product, onReviewClick }: ReviewableProductItemProps) => (
  <article className={styles.item}>
    <div className={styles.thumbnail}>
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={84}
        height={84}
        className={styles.image}
      />
    </div>

    <div className={styles.info}>
      <Text fontSize={12} color="gray01" className={styles.brand}>{product.brand}</Text>
      <Text fontSize={15} fontWeight={700} color="gray01" className={styles.name}>{product.name}</Text>
      <Text fontSize={13} color="gray01" className={styles.option}>{product.option}</Text>
      <Text fontSize={13} fontWeight={700} color="primary">최대 {product.point}P</Text>
    </div>

    <div className={styles.action}>
      <Text fontSize={12} color="gray01" className={styles.purchaseSource}>{product.purchaseSource}</Text>
      <button
        type="button"
        className={styles.reviewBtn}
        onClick={() => onReviewClick(product.id)}
        aria-label={`${product.name} 리뷰 남기기`}
      >
        <Text fontSize={14} fontWeight={600} color="primary">리뷰 남기기</Text>
      </button>
    </div>
  </article>
);

export default ReviewableProductItem;
