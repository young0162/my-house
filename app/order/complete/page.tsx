"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Text from "@/components/Common/Text";
import styles from "./page.module.scss";

const OrderCompletePage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
            <circle cx="28" cy="28" r="28" fill="#00a1ff" />
            <path
              d="M16 28.5L23.5 36L40 20"
              stroke="#fff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <Text tag="h1" fontSize={26} fontWeight={700} color="gray01" className={styles.title}>
          주문이 완료되었습니다
        </Text>
        <Text tag="p" fontSize={15} className={styles.subtitle}>
          결제가 정상적으로 처리되었습니다.
        </Text>

        {orderId && (
          <div className={styles.orderIdBox}>
            <Text tag="span" fontSize={13} className={styles.orderIdLabel}>주문번호</Text>
            <Text tag="span" fontSize={13} fontWeight={600} color="gray01" className={styles.orderIdValue}>
              {orderId}
            </Text>
          </div>
        )}

        <div className={styles.actions}>
          <Link href="/my/shopping" className={styles.primaryBtn}>
            <Text tag="span" fontSize={15} fontWeight={700} color="white">주문 내역 보기</Text>
          </Link>
          <Link href="/" className={styles.secondaryBtn}>
            <Text tag="span" fontSize={15} fontWeight={600} color="gray01">홈으로 가기</Text>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletePage;
