"use client";

import Text from "@/components/Common/Text";
import { formatPrice } from "@/app/utils/format";
import styles from "./PaymentSummary.module.scss";

interface PaymentSummaryProps {
  totalProductPrice: number;
  finalPrice: number;
  pointEarned: number;
}

const PaymentSummary = ({ totalProductPrice, finalPrice, pointEarned }: PaymentSummaryProps) => (
  <div className={styles.root}>
    <div className={styles.card}>
      <div className={styles.header}>
        <Text tag="h2" fontSize={22} fontWeight={700} color="gray01">결제금액</Text>
      </div>

      <div className={styles.priceRows}>
        <div className={styles.priceRow}>
          <Text tag="span" fontSize={16} className={styles.priceLabel}>총 상품 금액</Text>
          <Text tag="span" fontSize={16} fontWeight={700} color="gray01">{formatPrice(totalProductPrice)}원</Text>
        </div>
        <div className={styles.priceRow}>
          <Text tag="span" fontSize={16} className={styles.priceLabel}>배송비</Text>
          <Text tag="span" fontSize={16} color="gray01">0원</Text>
        </div>
        <div className={styles.priceRow}>
          <Text tag="span" fontSize={16} className={styles.priceLabel}>쿠폰 사용</Text>
          <Text tag="span" fontSize={16} color="gray01">0원</Text>
        </div>
        <div className={styles.priceRow}>
          <Text tag="span" fontSize={16} className={styles.priceLabel}>포인트 사용</Text>
          <Text tag="span" fontSize={16} color="gray01">0원</Text>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.finalBlock}>
        <Text tag="span" fontSize={18} fontWeight={700} color="gray01">최종 결제 금액</Text>
        <div className={styles.finalRight}>
          <Text tag="strong" fontSize={28} fontWeight={700} color="primary" className={styles.finalAmount}>
            {formatPrice(finalPrice)} 원
          </Text>
          <Text tag="p" fontSize={13} fontWeight={700} className={styles.pointEarned}>
            {formatPrice(pointEarned)} P 적립 예정
          </Text>
        </div>
      </div>

      <div className={styles.legalBox}>
        <Text tag="p" fontSize={14} className={styles.legalText}>
          본인은 만 14세 이상이며, 주문 내용을 확인하였습니다.
        </Text>
        <Text tag="p" fontSize={13} className={styles.legalText}>
          (주)버킷플레이스는 통신판매중개자로 거래 당사자가 아니므로, 판매자가 등록한 상품정보 및 거래 등에 대해 책임을 지지 않습니다. 단, 버킷플레이스가 판매자로 등록 또는 판매한 상품은 판매자로서 책임을 부담합니다.
        </Text>
      </div>
    </div>

    <button type="button" className={styles.payBtn}>
      <Text tag="span" fontSize={16} fontWeight={700} color="white">
        {formatPrice(finalPrice)}원 결제하기
      </Text>
    </button>
  </div>
);

export default PaymentSummary;
