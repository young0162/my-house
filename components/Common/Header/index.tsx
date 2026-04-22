"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Text from "@/components/Common/Text";
import { SearchIcon, HeartIcon, CartIcon, BellIcon } from "@/components/Common/Icon";
import styles from "./index.module.scss";
import { LogoIcon } from "../Icon/LogoIcon";

const NAV_ITEMS = [
  { label: "스토어", href: "/store" },
  { label: "커뮤니티", href: "#" },
  { label: "전문가", href: "#" },
  { label: "집들이", href: "#" },
  { label: "인테리어", href: "#" },
];

const Header = () => {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="오늘의집 홈">
          <LogoIcon />
        </Link>

        {/* Nav */}
        <nav className={styles.nav} aria-label="주요 메뉴">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={styles.navLink}>
                  <Text
                    fontSize={18}
                    fontWeight="bold"
                    color={pathname.startsWith(item.href) && item.href !== "#" ? "primary" : "gray01"}
                  >
                    {item.label}
                  </Text>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Search */}
        <div className={`${styles.searchWrap} ${searchFocused ? styles.focused : ""}`}>
          <SearchIcon />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="오늘의집에서 검색해보세요"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            aria-label="검색"
          />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button type="button" className={styles.actionBtn} aria-label="좋아요 목록">
            <HeartIcon />
          </button>
          <button type="button" className={styles.actionBtn} aria-label="장바구니">
            <CartIcon />
          </button>
          <button type="button" className={styles.actionBtn} aria-label="알림">
            <BellIcon />
          </button>
          <Link href="/login" className={styles.loginBtn}>
            <Text tag="span" fontSize={14} fontWeight={600} color="white">
              로그인
            </Text>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
