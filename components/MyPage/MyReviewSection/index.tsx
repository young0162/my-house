"use client";

import { useState, useEffect } from "react";
import Text from "@/components/Common/Text";
import { ChevronRightIcon } from "@/components/Common/Icon";
import MyReviewItem from "@/components/MyPage/MyReviewItem";
import { reviewApiService } from "@/services/review.api";
import type { MyReviewItem as MyReviewItemType, MyReviewSortType } from "@/types/review";
import styles from "./MyReviewSection.module.scss";

const SORT_OPTIONS: { value: MyReviewSortType; label: string }[] = [
  { value: "best", label: "베스트순" },
  { value: "newest", label: "최신순" },
];

const PAGE_SIZE = 10;

const MyReviewSection = () => {
  const [sort, setSort] = useState<MyReviewSortType>("newest");
  const [reviews, setReviews] = useState<MyReviewItemType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    reviewApiService.getMyReviews(sort).then((data) => {
      setReviews(data.reviews);
      setTotal(data.total);
      setPage(1);
    });
  }, [sort]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pagedReviews = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSortChange = (value: MyReviewSortType) => {
    setSort(value);
  };

  return (
    <section className={styles.root}>
      <div className={styles.banner}>
        <Text tag="p" fontSize={14} color="gray01">
          앱에서 작성하면{" "}
          <Text tag="span" fontSize={14} color="primary" fontWeight={600}>
            사진 최대 10장
          </Text>
          ,{" "}
          <Text tag="span" fontSize={14} color="primary" fontWeight={600}>
            동영상 최대 1장
          </Text>
          까지 첨부할 수 있어요
        </Text>
      </div>

      <div className={styles.sortBar}>
        {SORT_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`${styles.sortBtn} ${sort === value ? styles.sortBtnActive : ""}`}
            onClick={() => handleSortChange(value)}
            aria-pressed={sort === value}
          >
            <Text tag="span" fontSize={13}>
              {label}
            </Text>
          </button>
        ))}
      </div>

      {pagedReviews.length === 0 ? (
        <div className={styles.empty}>
          <Text fontSize={15} color="gray01">
            내가 남긴 리뷰가 없습니다.
          </Text>
        </div>
      ) : (
        <ul className={styles.list}>
          {pagedReviews.map((review) => (
            <li key={review.id}>
              <MyReviewItem review={review} />
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="페이지 탐색">
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="이전 페이지"
          >
            <span className={styles.chevronLeft}>
              <ChevronRightIcon />
            </span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              className={`${styles.pageNumBtn} ${p === page ? styles.pageNumBtnActive : ""}`}
              onClick={() => setPage(p)}
              aria-current={p === page ? "page" : undefined}
            >
              <Text tag="span" fontSize={13}>
                {p}
              </Text>
            </button>
          ))}

          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="다음 페이지"
          >
            <ChevronRightIcon />
          </button>
        </nav>
      )}
    </section>
  );
};

export default MyReviewSection;
