"use client";

import { useState } from "react";
import { SearchIcon, ChevronDownIcon } from "@/components/Common/Icon";
import { PERIOD_OPTIONS, ORDER_STATUS_OPTIONS } from "@/constants/mypage";
import type { PeriodOption, OrderStatusOption } from "@/types/mypage";
import styles from "./OrderFilter.module.scss";

const OrderFilter = () => {
  const [period, setPeriod] = useState<PeriodOption>("전체(최대 5년)");
  const [orderStatus, setOrderStatus] = useState<OrderStatusOption>("주문 전체");
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className={styles.root}>
      <div className={styles.selects}>
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodOption)}
            aria-label="기간 선택"
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <span className={styles.chevron} aria-hidden="true">
            <ChevronDownIcon />
          </span>
        </div>

        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value as OrderStatusOption)}
            aria-label="주문 상태 선택"
          >
            {ORDER_STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <span className={styles.chevron} aria-hidden="true">
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      <div className={styles.searchWrap}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="상품명, 옵션명, 브랜드명으로 검색하세요"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          aria-label="주문 검색"
        />
        <button type="button" className={styles.searchBtn} aria-label="검색">
          <SearchIcon />
        </button>
      </div>
    </div>
  );
};

export default OrderFilter;
