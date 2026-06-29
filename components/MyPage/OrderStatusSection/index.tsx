import Text from "@/components/Common/Text";
import { ORDER_STEPS } from "@/constants/mypage";
import type { ShoppingOrdersResponse } from "@/types/order";
import styles from "./OrderStatusSection.module.scss";

interface OrderStatusSectionProps {
  summary: ShoppingOrdersResponse["summary"] | null;
}

const OrderStatusSection = ({ summary }: OrderStatusSectionProps) => (
  <section className={styles.root}>
    <h2 className={styles.title}>
      <Text tag="span" fontSize={16} fontWeight={700} color="gray01">진행중인 주문</Text>
      <Text tag="span" fontSize={13} color="gray01"> (최근 3개월)</Text>
    </h2>
    <div className={styles.steps}>
      {ORDER_STEPS.map((step, i) => (
        <div key={step} className={styles.stepGroup}>
          <div className={styles.step}>
            <Text fontSize={13} color="gray01">{step}</Text>
            <Text fontSize={18} fontWeight={700} color="primary">{summary?.[step] ?? 0}</Text>
          </div>
          {i < ORDER_STEPS.length - 1 && (
            <Text fontSize={20} color="gray01" className={styles.arrow}>›</Text>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default OrderStatusSection;
