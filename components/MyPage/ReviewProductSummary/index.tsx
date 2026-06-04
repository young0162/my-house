import Image from "next/image";
import Text from "@/components/Common/Text";
import type { ReviewableProduct } from "@/types/myReview";
import styles from "./index.module.scss";

interface ReviewProductSummaryProps {
  product: ReviewableProduct;
}

const ReviewProductSummary = ({ product }: ReviewProductSummaryProps) => (
  <div className={styles.root}>
    <div className={styles.thumbnail}>
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={76}
        height={76}
        className={styles.image}
      />
    </div>
    <div className={styles.info}>
      <Text fontSize={12} className={styles.brand}>{product.brand}</Text>
      <Text fontSize={14} fontWeight={600} color="gray01" className={styles.name}>{product.name}</Text>
      <Text fontSize={13} className={styles.option}>{product.option}</Text>
      <span className={styles.badge}>
        <Text fontSize={12} fontWeight={600} color="gray01">최대 {product.point}P</Text>
      </span>
    </div>
  </div>
);

export default ReviewProductSummary;
