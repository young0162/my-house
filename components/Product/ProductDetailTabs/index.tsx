"use client";

import { useEffect, useRef, useState } from "react";
import Text from "@/components/Common/Text";
import styles from "./index.module.scss";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface ProductDetailTabsProps {
  reviewCount: number;
  inquiryCount: number;
}

const ProductDetailTabs = ({ reviewCount, inquiryCount }: ProductDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState("product-info");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const isScrollingRef = useRef(false);

  const tabs: Tab[] = [
    { id: "product-info", label: "상품정보" },
    { id: "review", label: "리뷰", count: reviewCount },
    { id: "inquiry", label: "문의", count: inquiryCount },
    { id: "shipping", label: "배송/환불" },
    { id: "recommendation", label: "추천" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    const refs = sectionRefs.current;
    Object.values(refs).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    isScrollingRef.current = true;

    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className={styles.wrapper}>
      <nav className={styles.tabBar} aria-label="상품 상세 탭">
        <ul className={styles.tabList} role="tablist">
          {tabs.map((tab) => (
            <li key={tab.id} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={styles.tabBtn}
                onClick={() => handleTabClick(tab.id)}
              >
                <Text tag="span" className={styles.tabLabel}>
                  {tab.label}
                </Text>
                {tab.count !== undefined ? (
                  <Text tag="span" className={styles.tabCount}>
                    {tab.count.toLocaleString()}
                  </Text>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section id="product-info" ref={setRef("product-info")} className={styles.section} aria-labelledby="tab-product-info">
        <Text tag="h2" className={styles.sectionTitle}>
          상품정보
        </Text>
        <div className={styles.sectionPlaceholder} />
      </section>

      <section id="review" ref={setRef("review")} className={styles.section} aria-labelledby="tab-review">
        <Text tag="h2" className={styles.sectionTitle}>
          리뷰
        </Text>
        <div className={styles.sectionPlaceholder} />
      </section>

      <section id="inquiry" ref={setRef("inquiry")} className={styles.section} aria-labelledby="tab-inquiry">
        <Text tag="h2" className={styles.sectionTitle}>
          문의
        </Text>
        <div className={styles.sectionPlaceholder} />
      </section>

      <section id="shipping" ref={setRef("shipping")} className={styles.section} aria-labelledby="tab-shipping">
        <Text tag="h2" className={styles.sectionTitle}>
          배송/환불
        </Text>
        <div className={styles.sectionPlaceholder} />
      </section>

      <section id="recommendation" ref={setRef("recommendation")} className={styles.section} aria-labelledby="tab-recommendation">
        <Text tag="h2" className={styles.sectionTitle}>
          추천
        </Text>
        <div className={styles.sectionPlaceholder} />
      </section>
    </div>
  );
};

export default ProductDetailTabs;
