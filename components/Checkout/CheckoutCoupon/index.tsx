"use client";

import Text from "@/components/Common/Text";
import styles from "./CheckoutCoupon.module.scss";

const CheckoutCoupon = () => (
  <section className={styles.root}>
    <div className={styles.header}>
      <Text tag="h2" fontSize={18} fontWeight={700} color="gray01">장바구니 쿠폰</Text>
      <Text tag="span" fontSize={12} className={styles.emptyText}>사용 가능한 쿠폰이 없어요.</Text>
    </div>

    <button type="button" className={styles.couponButton}>
      <Text tag="span" fontSize={12} className={styles.couponText}>쿠폰코드가 있으신가요?</Text>
      <Text tag="span" fontSize={12} className={styles.chevron}>⌄</Text>
    </button>
  </section>
);

export default CheckoutCoupon;
