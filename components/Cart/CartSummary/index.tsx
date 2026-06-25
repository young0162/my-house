"use client";

import Text from "@/components/Common/Text";
import { formatPrice } from "@/app/utils/format";
import styles from "./CartSummary.module.scss";

interface CartSummaryProps {
  totalPrice: number;
  checkedCount: number;
  onCheckout: () => void;
  isSubmitting?: boolean;
}

const CartSummary = ({ totalPrice, checkedCount, onCheckout, isSubmitting }: CartSummaryProps) => {
  const hasSelected = checkedCount > 0;
  const formattedTotalPrice = `${formatPrice(totalPrice)}원`;

  return (
    <aside className={styles.root}>
      <div className={styles.panel}>
        {hasSelected ? (
          <>
            <div className={styles.priceRow}>
              <Text tag="strong" fontSize={16} fontWeight={700} color="gray01">
                총 금액 ({checkedCount}개) <Text tag="span" className={styles.caret}>⌃</Text>
              </Text>
              <Text tag="strong" fontSize={15} fontWeight={700} color="gray01">
                {formattedTotalPrice}
              </Text>
            </div>

            <div className={styles.detailRows}>
              <div className={styles.detailRow}>
                <Text tag="span" fontSize={14} className={styles.detailLabel}>상품 금액</Text>
                <Text tag="span" fontSize={14} className={styles.detailValue}>{formattedTotalPrice}</Text>
              </div>
              <div className={styles.detailRow}>
                <Text tag="span" fontSize={14} className={styles.detailLabel}>배송비</Text>
                <Text tag="span" fontSize={14} className={styles.detailValue}>0원</Text>
              </div>
            </div>

            <div className={`${styles.priceRow} ${styles.finalRow}`}>
              <Text tag="strong" fontSize={16} fontWeight={800} color="gray01">
                최종 결제 금액
              </Text>
              <Text tag="strong" fontSize={20} fontWeight={800} color="gray01">
                {formattedTotalPrice}
              </Text>
            </div>

            <div className={styles.divider} />

            <Text tag="p" fontSize={14} className={styles.hint}>
              결제수단 혜택 받으면 여기서 더 할인돼요
            </Text>
          </>
        ) : (
          <>
            <div className={styles.header}>
              <Text tag="h2" fontSize={16} fontWeight={700} color="gray01">
                최종 결제 금액
              </Text>
            </div>

            <div className={styles.body}>
              <Text tag="p" fontSize={20} fontWeight={700} color="gray01" className={styles.totalPrice}>
                {formattedTotalPrice}
              </Text>

              <Text tag="p" fontSize={13} className={styles.hint}>
                결제수단 혜택 받으면 여기서 더 할인돼요
              </Text>
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        className={`${styles.checkoutBtn} ${!hasSelected || isSubmitting ? styles.disabled : ""}`}
        disabled={!hasSelected || isSubmitting}
        onClick={onCheckout}
      >
        <Text tag="span" fontSize={15} fontWeight={700} color="white">
          {isSubmitting
            ? "처리 중..."
            : hasSelected
              ? `${checkedCount}개 상품 주문하기`
              : "상품을 선택해주세요"}
        </Text>
      </button>
    </aside>
  );
};

export default CartSummary;
