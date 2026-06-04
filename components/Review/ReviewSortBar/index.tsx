"use client";

import Text from "@/components/Common/Text";
import { ChevronDownIcon } from "@/components/Common/Icon";
import { ReviewSortType } from "@/app/types/review";
import { REVIEW_SORT_OPTIONS } from "@/constants/review";
import styles from "./ReviewSortBar.module.scss";

interface ReviewSortBarProps {
  sortType: ReviewSortType;
  onSortChange: (sort: ReviewSortType) => void;
}

const ReviewSortBar = ({ sortType, onSortChange }: ReviewSortBarProps) => (
  <div className={styles.bar}>
    <ul className={styles.sortList}>
      {REVIEW_SORT_OPTIONS.map(({ value, label }) => (
        <li key={value}>
          <button
            type="button"
            role="tab"
            aria-selected={sortType === value}
            className={styles.sortBtn}
            onClick={() => onSortChange(value)}
          >
            <Text tag="span" className={styles.sortLabel}>
              {label}
            </Text>
          </button>
        </li>
      ))}
    </ul>

    <div className={styles.filters}>
      <button type="button" className={styles.filterBtn}>
        <Text tag="span">별점</Text>
        <ChevronDownIcon />
      </button>
      <button type="button" className={styles.filterBtn}>
        <Text tag="span">옵션</Text>
        <ChevronDownIcon />
      </button>
    </div>
  </div>
);

export default ReviewSortBar;
