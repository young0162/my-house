"use client";

import Text from "@/components/Common/Text";
import { formatPrice } from "@/app/utils/format";
import styles from "./CartSummary.module.scss";

interface CartSummaryProps {
  totalPrice: number;
  checkedCount: number;
}

const CartSummary = ({ totalPrice, checkedCount }: CartSummaryProps) => {
  const hasSelected = checkedCount > 0;

  return (
    <aside className={styles.root}>
      <div className={styles.header}>
        <Text tag="h2" fontSize={16} fontWeight={700} color="gray01">
          최종 결제 금액
        </Text>
      </div>

      <div className={styles.body}>
        <Text tag="p" fontSize={28} fontWeight={700} color="gray01" className={styles.totalPrice}>
          {formatPrice(totalPrice)}원
        </Text>

        {!hasSelected && (
          <Text tag="p" fontSize={13} className={styles.hint}>
            결제수단 혜택 받으면 여기서 더 할인돼요
          </Text>
        )}
      </div>

      <button
        type="button"
        className={`${styles.checkoutBtn} ${!hasSelected ? styles.disabled : ""}`}
        disabled={!hasSelected}
      >
        <Text tag="span" fontSize={15} fontWeight={700} color="white">
          {hasSelected ? `${checkedCount}개 상품 주문하기` : "상품을 선택해주세요"}
        </Text>
      </button>
    </aside>
  );
};

export default CartSummary;
