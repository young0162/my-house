"use client";

import { useState } from "react";
import Link from "next/link";
import Text from "@/components/Common/Text";
import styles from "./index.module.scss";

const NAV_ITEMS = [
  { label: "쇼핑홈", href: "/product" },
  { label: "카테고리", href: "/product/category" },
  { label: "베스트", href: "/product/best" },
  { label: "오늘의딜", href: "/product/deal" },
  { label: "단독상품", href: "/product/exclusive" },
  { label: "오마트", href: "/product/omart" },
  { label: "원하는날도착", href: "/product/delivery" },
  { label: "오!쇼룸", href: "/product/showroom" },
  { label: "기획전", href: "/product/exhibition" },
];

interface NavBarProps {
  activeHref?: string;
}

const NavBar = ({ activeHref = "/product" }: NavBarProps) => {
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  return (
    <nav className={styles.root} aria-label="스토어 내비게이션">
      <div className={styles.inner}>
        <ul className={styles.list}>
          {NAV_ITEMS.map(({ label, href }) => {
            const isActive = activeHref === href;
            const isHovered = hoveredHref === href;

            return (
              <li key={href} className={styles.item}>
                <Link
                  href={href}
                  className={`${styles.link} ${isActive ? styles.active : ""}`}
                  onMouseEnter={() => setHoveredHref(href)}
                  onMouseLeave={() => setHoveredHref(null)}
                >
                  <Text tag="span" fontSize={16} fontWeight={700} color={isActive || isHovered ? "primary" : "gray01"}>
                    {label}
                  </Text>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
