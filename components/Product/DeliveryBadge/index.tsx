import { DeliveryType } from "@/constants/product";
import styles from "./DeliveryBadge.module.scss";

interface DeliveryBadgeProps {
  type: DeliveryType;
}

const DeliveryBadge = ({ type }: DeliveryBadgeProps) => {
  if (type === "원하는날도착") {
    return (
      <span className={`${styles.delivery} ${styles.deliveryExpress}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 12h13M13 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        원하는날도착
      </span>
    );
  }
  if (type === "조건부무료배송") return <span className={styles.delivery}>조건부 무료배송</span>;
  return <span className={styles.delivery}>배송비 별도</span>;
};

export default DeliveryBadge;
