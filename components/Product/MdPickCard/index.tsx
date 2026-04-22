import Image from "next/image";
import { BookmarkIcon } from "@/components/Common/Icon";
import DeliveryBadge from "@/components/Product/DeliveryBadge";
import { MdPickItem } from "@/constants/product";
import { formatPrice } from "@/app/utils/format";
import styles from "./index.module.scss";

interface MdPickCardProps {
  item: MdPickItem;
}

const MdPickCard = ({ item }: MdPickCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image src={item.image} alt={item.name} fill sizes="260px" className={styles.image} />
        <button type="button" className={styles.bookmarkBtn} aria-label="저장">
          <BookmarkIcon />
        </button>
      </div>

      <div className={styles.info}>
        <span className={styles.brand}>{item.brand}</span>
        <p className={styles.name}>{item.name}</p>

        <div className={styles.priceRow}>
          {item.discountRate && (
            <span className={styles.discountRate}>{item.discountRate}%</span>
          )}
          <span className={styles.price}>{formatPrice(item.price)}원</span>
        </div>

        <div className={styles.ratingRow}>
          <span className={styles.star}>★</span>
          <span className={styles.rating}>{item.rating.toFixed(1)}</span>
          <span className={styles.reviewCount}>리뷰 {item.reviewCount.toLocaleString()}</span>
        </div>

        <DeliveryBadge type={item.deliveryType} />

        <div className={styles.tagRow}>
          {item.deliveryType === "조건부무료배송" && (
            <span className={styles.tagFree}>무료배송</span>
          )}
          {item.isSpecial && <span className={styles.tagSpecial}>특가</span>}
          {item.coupon && (
            <span className={styles.tagCoupon}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#e84040" aria-hidden="true">
                <rect x="1" y="6" width="22" height="12" rx="2" />
                <circle cx="6" cy="12" r="2" fill="white" />
                <circle cx="18" cy="12" r="2" fill="white" />
              </svg>
              {item.coupon}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default MdPickCard;
