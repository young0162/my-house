"use client";

import { useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/Common/Icon";
import MdPickCard from "@/components/Product/MdPickCard";
import { MD_PICK_ITEMS } from "@/constants/product";
import styles from "./MdPick.module.scss";

const MdPick = () => {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -280, behavior: "smooth" });
  };

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{"MD's PICK"}</h2>
      <div className={styles.carouselWrap}>
        <ul className={styles.carousel} ref={scrollRef} onScroll={updateArrows}>
          {MD_PICK_ITEMS.map((item) => (
            <li key={item.id} className={styles.cardWrap}>
              <MdPickCard item={item} />
            </li>
          ))}
        </ul>
        {showLeft && (
          <button
            type="button"
            className={`${styles.arrowBtn} ${styles.arrowBtnLeft}`}
            onClick={handleScrollLeft}
            aria-label="이전"
          >
            <ChevronDownIcon />
          </button>
        )}
        {showRight && (
          <button
            type="button"
            className={`${styles.arrowBtn} ${styles.arrowBtnRight}`}
            onClick={handleScrollRight}
            aria-label="다음"
          >
            <ChevronDownIcon />
          </button>
        )}
      </div>
    </section>
  );
};

export default MdPick;
