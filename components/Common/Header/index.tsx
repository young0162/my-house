"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Text from "@/components/Common/Text";
import { SearchIcon, HeartIcon, CartIcon, BellIcon } from "@/components/Common/Icon";
import { HOME_NAV_ITEMS } from "@/constants/home";
import styles from "./index.module.scss";
import { LogoIcon } from "../Icon/LogoIcon";

const NAV_ITEMS = [
  { label: "집구경", href: "/" },
  { label: "쇼핑", href: "/store" },
  { label: "인테리어/생활", href: "#" },
];

const Header = () => {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const { status } = useSession();
  const isHomeCategoryPath = HOME_NAV_ITEMS.some(({ href }) => href !== "#" && pathname === href);

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
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === "/"
                ? isHomeCategoryPath
                : !isHomeCategoryPath && item.href !== "#" && pathname.startsWith(item.href);

              return (
                <li key={item.label}>
                  <Link href={item.href} className={styles.navLink} aria-current={isActive ? "page" : undefined}>
                    <Text
                      fontSize={18}
                      fontWeight="bold"
                      color={isActive ? "primary" : "gray01"}
                    >
                      {item.label}
                    </Text>
                  </Link>
                </li>
              );
            })}
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
          {status === "authenticated" ? (
            <>
              <Link href="/my/shopping" className={styles.profileBtn} aria-label="마이페이지">
                <Image
                  src="/image/user_default_image.jpg"
                  alt="프로필"
                  width={32}
                  height={32}
                  className={styles.profileImg}
                />
              </Link>
              <button type="button" className={styles.loginBtn} onClick={() => signOut({ callbackUrl: "/" })}>
                <Text tag="span" fontSize={14} fontWeight={600} color="white">
                  로그아웃
                </Text>
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.loginBtn}>
              <Text tag="span" fontSize={14} fontWeight={600} color="white">
                로그인
              </Text>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
