"use client";

import { useState } from "react";
import { CouponIcon, PointIcon, GradeIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import OrderFilter from "@/components/MyPage/OrderFilter";
import ReviewPointBanner from "@/components/MyPage/ReviewPointBanner";
import OrderItem from "@/components/MyPage/OrderItem";
import { SUB_TABS, ORDER_STEPS } from "@/constants/mypage";
import type { SubTab, Order } from "@/types/mypage";
import styles from "./page.module.scss";

const MOCK_ORDERS: Order[] = [
  {
    id: "20230105-001",
    date: "2023.01.05",
    status: "구매확정",
    deliveryInfo: "1/7(토) 도착 완료",
    product: {
      name: "샤워기 1차 필터 (불순물 차단 필터)",
      option: "1차필터 1set(3개)",
      price: 9900,
      quantity: 1,
      imageUrl: "/image/products/v1-400167436738688.jpg",
    },
  },
];

const ShoppingPage = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("주문배송목록");

  return (
    <div className={styles.root}>
      <div className={styles.subTabsWrap}>
        <div className={styles.subTabsInner}>
          <ul className={styles.subTabs}>
            {SUB_TABS.map((tab) => (
              <li key={tab}>
                <button
                  type="button"
                  className={`${styles.subTab} ${activeSubTab === tab ? styles.subTabActive : ""}`}
                  onClick={() => setActiveSubTab(tab)}
                >
                  <Text fontSize={14} fontWeight={activeSubTab === tab ? 600 : 400} color={activeSubTab === tab ? "primary" : "gray01"}>
                    {tab}
                  </Text>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.statsCard}>
          <div className={styles.statItem}>
            <CouponIcon />
            <Text fontSize={14} color="gray01" className={styles.statLabel}>쿠폰</Text>
            <Text fontSize={14} fontWeight={700} color="primary">0</Text>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <PointIcon />
            <Text fontSize={14} color="gray01" className={styles.statLabel}>포인트</Text>
            <Text fontSize={14} fontWeight={700} color="primary">0P</Text>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <GradeIcon />
            <Text fontSize={14} color="gray01" className={styles.statLabel}>구매등급</Text>
            <Text fontSize={14} fontWeight={700} color="primary">WELCOME</Text>
          </div>
        </div>

        <div className={styles.referralCard}>
          <div className={styles.referralLeft}>
            <Text fontSize={14} color="gray01">나의 추천코드</Text>
            <Text fontSize={15} fontWeight={700} color="gray01" className={styles.referralCode}>WK962OH5</Text>
          </div>
          <div className={styles.referralCenter}>
            <Text fontSize={14} color="gray01">나는 5000P, 친구는 5000원 쿠폰</Text>
          </div>
          <button type="button" className={styles.referralBtn}>
            <Text fontSize={15} fontWeight={700} color="white">추천하기</Text>
          </button>
        </div>

        <section className={styles.orderSection}>
          <h2 className={styles.orderTitle}>
            <Text tag="span" fontSize={16} fontWeight={700} color="gray01">진행중인 주문</Text>
            <Text tag="span" fontSize={13} color="gray01"> (최근 3개월)</Text>
          </h2>
          <div className={styles.orderSteps}>
            {ORDER_STEPS.map((step, i) => (
              <div key={step} className={styles.orderStepGroup}>
                <div className={styles.orderStep}>
                  <Text fontSize={13} color="gray01">{step}</Text>
                  <Text fontSize={18} fontWeight={700} color="primary">0</Text>
                </div>
                {i < ORDER_STEPS.length - 1 && (
                  <Text fontSize={20} color="gray01" className={styles.orderArrow}>›</Text>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className={styles.orderListSection}>
          <OrderFilter />
          <ReviewPointBanner />
          {MOCK_ORDERS.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;
