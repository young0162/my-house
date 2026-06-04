"use client";

import { useState } from "react";
import Link from "next/link";
import Text from "@/components/Common/Text";
import styles from "./NavBar.module.scss";

const NAV_ITEMS = [
  { label: "쇼핑홈", href: "/store" },
  { label: "카테고리", href: "/store/category" },
  { label: "베스트", href: "/store/best" },
  { label: "오늘의딜", href: "/store/deal" },
  { label: "단독상품", href: "/store/exclusive" },
  { label: "오마트", href: "/store/omart" },
  { label: "원하는날도착", href: "/store/delivery" },
  { label: "오!쇼룸", href: "/store/showroom" },
  { label: "기획전", href: "/store/exhibition" },
];

interface NavBarProps {
  activeHref?: string;
}

const NavBar = ({ activeHref = "/store" }: NavBarProps) => {
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
