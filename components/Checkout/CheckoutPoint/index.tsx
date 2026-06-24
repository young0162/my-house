"use client";

import Text from "@/components/Common/Text";
import styles from "./CheckoutPoint.module.scss";

const CheckoutPoint = () => (
  <section className={styles.root}>
    <div className={styles.header}>
      <Text tag="h2" fontSize={18} fontWeight={700} color="gray01">포인트</Text>
    </div>

    <div className={styles.pointControls}>
      <input type="text" value="0" readOnly className={styles.pointInput} aria-label="사용 포인트" />
      <button type="button" className={styles.useAllButton}>
        <Text tag="span" fontSize={12}>전액 사용</Text>
      </button>
    </div>

    <Text tag="p" fontSize={12} className={styles.availablePoint}>
      사용 가능 포인트 <Text tag="strong" fontSize={12} fontWeight={700} color="primary">0 P</Text>
    </Text>
  </section>
);

export default CheckoutPoint;
