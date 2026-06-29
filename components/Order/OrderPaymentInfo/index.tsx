import Text from "@/components/Common/Text";
import styles from "./OrderPaymentInfo.module.scss";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  card: "신용카드",
  kakao: "카카오페이",
  toss: "토스페이",
  "ohouse-pay": "오늘의집 페이",
  "bank-transfer": "무통장입금",
};

interface OrderPaymentInfoProps {
  totalProductPrice: number;
  shippingFee: number;
  couponDiscount: number;
  pointDiscount: number;
  finalPrice: number;
  paymentMethod: string;
}

const OrderPaymentInfo = ({
  totalProductPrice,
  shippingFee,
  couponDiscount,
  pointDiscount,
  finalPrice,
  paymentMethod,
}: OrderPaymentInfoProps) => (
  <section className={styles.root}>
    <h2 className={styles.title}>
      <Text fontSize={17} fontWeight={700} color="gray01">결제정보</Text>
    </h2>
    <div className={styles.card}>
      <div className={styles.row}>
        <Text fontSize={14} className={styles.muted}>상품금액</Text>
        <Text fontSize={14} color="gray01">{totalProductPrice.toLocaleString()}원</Text>
      </div>
      <div className={styles.row}>
        <Text fontSize={14} className={styles.muted}>배송비</Text>
        <Text fontSize={14} color="gray01">{shippingFee.toLocaleString()}원</Text>
      </div>
      {couponDiscount > 0 && (
        <div className={styles.row}>
          <Text fontSize={14} className={styles.muted}>쿠폰 할인</Text>
          <Text fontSize={14} color="gray01">-{couponDiscount.toLocaleString()}원</Text>
        </div>
      )}
      {pointDiscount > 0 && (
        <div className={styles.row}>
          <Text fontSize={14} className={styles.muted}>포인트 사용</Text>
          <Text fontSize={14} color="gray01">-{pointDiscount.toLocaleString()}원</Text>
        </div>
      )}
      <div className={styles.divider} />
      <div className={styles.row}>
        <Text fontSize={15} fontWeight={700} color="gray01">주문금액</Text>
        <Text fontSize={17} fontWeight={700} color="gray01">{finalPrice.toLocaleString()}원</Text>
      </div>
      <div className={styles.row}>
        <Text fontSize={14} className={styles.muted}>
          {PAYMENT_METHOD_LABEL[paymentMethod] ?? paymentMethod}
        </Text>
        <Text fontSize={14} color="gray01">{finalPrice.toLocaleString()}원</Text>
      </div>
    </div>
  </section>
);

export default OrderPaymentInfo;
