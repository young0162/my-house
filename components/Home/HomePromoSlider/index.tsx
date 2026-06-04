"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Text from "@/components/Common/Text";
import type { HomePromoItem } from "@/types/home";
import styles from "./HomePromoSlider.module.scss";

const HomePromoSlider = ({ items }: { items: HomePromoItem[] }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setCurrent((value) => (value + 1) % items.length), 4000);
    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  return (
    <section
      className={styles.root}
      aria-label="프로모션 배너"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={styles.track} style={{ transform: `translateX(-${current * 100}%)` }}>
        {items.map((item, index) => (
          <Link key={item.id} href={item.href} className={styles.slide} tabIndex={index === current ? 0 : -1}>
            <Image src={item.imageUrl} alt={item.title.replace("\n", " ")} fill sizes="290px" className={styles.image} />
            <div className={styles.topGradient} />
            <div className={styles.bottomGradient} />
            <div className={styles.heading}>
              <Text fontSize={11} fontWeight={600} color="white" className={styles.badge}>{item.badge}</Text>
              <Text fontSize={14} fontWeight={600} color="gray01">{item.eyebrow}</Text>
              <Text tag="h2" fontSize={25} fontWeight={800} color="gray01" lineHeight={1.35} className={styles.title}>{item.title}</Text>
            </div>
            <div className={styles.meta}>
              <Text fontSize={12} fontWeight={600} color="white">{item.author}</Text>
              <Text fontSize={12} fontWeight={700} color="white" className={styles.counter}>{current + 1}/{items.length} +</Text>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomePromoSlider;
