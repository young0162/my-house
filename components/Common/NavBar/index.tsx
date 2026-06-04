"use client";

import { useState } from "react";
import Link from "next/link";
import Text from "@/components/Common/Text";
import styles from "./NavBar.module.scss";

const NAV_ITEMS = [
  { label: "쇼핑홈", href: "/store" },
  { label: "카테고리", href: "/store/category" },
  { label: "베스트", href: "/store/best" },
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
