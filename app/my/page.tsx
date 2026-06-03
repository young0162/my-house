"use client";

import { useState } from "react";
import { CouponIcon, PointIcon, GradeIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import { TOP_TABS, SUB_TABS, ORDER_STEPS } from "@/constants/mypage";
import type { TopTab, SubTab } from "@/types/mypage";
import styles from "./page.module.scss";

const MyPage = () => {
  const [activeTopTab, setActiveTopTab] = useState<TopTab>("나의 쇼핑");
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("주문배송목록");

  return (
    <div className={styles.root}>
      <div className={styles.topTabsWrap}>
        <ul className={styles.topTabs}>
          {TOP_TABS.map((tab) => (
            <li key={tab}>
              <button
                type="button"
                className={`${styles.topTab} ${activeTopTab === tab ? styles.topTabActive : ""}`}
                onClick={() => setActiveTopTab(tab)}
              >
                <Text fontSize={16} fontWeight={activeTopTab === tab ? 700 : 500} color={activeTopTab === tab ? "primary" : "gray01"}>
                  {tab}
                </Text>
              </button>
            </li>
          ))}
        </ul>
      </div>

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

        <div className={styles.banner}>
          <div className={styles.bannerMain}>
            <p className={styles.bannerText}>
              <Text tag="strong" fontWeight={800} color="white">절요한세일</Text>
              <Text color="white"> 알림 신청하고 </Text>
              <Text tag="strong" fontWeight={800} color="white">990원 시크릿딜 링크 받기</Text>
              <Text fontSize={22} fontWeight={700} color="white"> ›</Text>
            </p>
            <div className={styles.bannerDots}>
              <span className={`${styles.dot} ${styles.dotActive}`} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
          <div className={styles.bannerGift}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <rect x="15" y="35" width="50" height="38" rx="3" fill="#ff8fab" />
              <rect x="10" y="28" width="60" height="14" rx="3" fill="#ff6b9d" />
              <rect x="36" y="28" width="8" height="45" fill="#fff" opacity="0.6" />
              <path d="M40 28 C40 28 28 22 28 14 C28 9 33 6 38 10 C40 12 40 28 40 28 Z" fill="#ff6b9d" />
              <path d="M40 28 C40 28 52 22 52 14 C52 9 47 6 42 10 C40 12 40 28 40 28 Z" fill="#e0457b" />
              <circle cx="58" cy="30" r="4" fill="#ffe066" opacity="0.7" />
              <circle cx="64" cy="22" r="2.5" fill="#ffe066" opacity="0.5" />
            </svg>
          </div>
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
      </div>
    </div>
  );
};

export default MyPage;
