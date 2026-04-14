"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Text from "@/components/Common/Text";
import styles from "./index.module.scss";
import { BannerSliderProps } from "@/app/types/bannerSlider";

const BannerSlider = ({ items, autoPlayInterval = 4000 }: BannerSliderProps) => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const total = items.length;

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((index + total) % total);
      setTimeout(() => setIsTransitioning(false), 450);
    },
    [isTransitioning, total],
  );

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    goTo(current - 1);
  };

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);

  const goNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    goNext();
  };

  useEffect(() => {
    const timer = setInterval(goNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [goNext, autoPlayInterval]);

  return (
    <div className={styles.root} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* 슬라이드 트랙 */}
      <div className={styles.viewport}>
        <div className={styles.track} style={{ transform: `translateX(-${current * 100}%)` }}>
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className={styles.slide}
              style={{ backgroundColor: item.bgColor }}
              aria-label={`${item.title} 배너`}
              tabIndex={index === current ? 0 : -1}
            >
              <div className={styles.slideInner}>
                {/* 텍스트 영역 */}
                <div className={styles.content}>
                  <Text tag="p" fontSize={14} fontWeight={500} color="gray01">
                    {item.subtitle}
                  </Text>
                  <div className={styles.titleRow}>
                    <Text tag="span" fontSize={36} fontWeight={800} color="gray01">
                      {item.title}
                    </Text>
                    {item.titleBadge && (
                      <span className={styles.badge}>
                        <Text tag="span" fontSize={28} fontWeight={700} color="white">
                          {item.titleBadge}
                        </Text>
                      </span>
                    )}
                  </div>
                  <Text tag="p" fontSize={15} fontWeight={400} color="gray01">
                    {item.description}
                  </Text>
                </div>

                {/* 이미지 영역 */}
                <div className={styles.imageWrap}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    priority={index === 0}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 컨트롤 오버레이 (화살표) */}
        <div className={`${styles.controls} ${isHovered ? styles.controlsVisible : ""}`}>
          <div className={styles.controlsInner}>
            {/* Prev Button */}
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowPrev}`}
              onClick={goPrev}
              aria-label="이전 배너"
            >
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                <path d="M9 1L1 9L9 17" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowNext}`}
              onClick={goNextClick}
              aria-label="다음 배너"
            >
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                <path d="M1 1L9 9L1 17" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* 카운터 (항상 표시) */}
        <div className={styles.counterWrapper}>
          <div className={styles.counterInner}>
            <div className={styles.counter}>
              <Text tag="span" fontSize={12} fontWeight={600} color="white">
                {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
