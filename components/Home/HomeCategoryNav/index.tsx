"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import { HOME_NAV_ITEMS } from "@/constants/home";
import styles from "./index.module.scss";

const HomeCategoryNav = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.root} aria-label="홈 카테고리">
    <div className={styles.inner}>
      <ul className={styles.list}>
        {HOME_NAV_ITEMS.map((item) => {
          const isActive = item.href !== "#" && pathname === item.href;

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`${styles.link} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Text fontSize={14} fontWeight={700} color={isActive ? "primary" : "gray01"}>{item.label}</Text>
              </Link>
            </li>
          );
        })}
      </ul>
      <button type="button" className={styles.trendButton}>
        <Text fontSize={14} fontWeight={700} color="gray01">1</Text>
        <Text fontSize={9} fontWeight={700} className={styles.newText}>NEW</Text>
        <Text fontSize={14} color="gray01">손님용 토퍼</Text>
        <ChevronDownIcon />
      </button>
    </div>
  </nav>
  );
};

export default HomeCategoryNav;
