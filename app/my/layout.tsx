"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Text from "@/components/Common/Text";
import styles from "./layout.module.scss";

const TAB_ITEMS = [
  { label: "나의 쇼핑", href: "/my/shopping" },
  { label: "프로필", href: "/my/profile" },
  { label: "나의 리뷰", href: "/my/review" },
  { label: "설정", href: "/my/edit" },
] as const;

const MyLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div>
      <div className={styles.topTabsWrap}>
        <ul className={styles.topTabs}>
          {TAB_ITEMS.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link href={href} className={`${styles.topTab} ${isActive ? styles.topTabActive : ""}`}>
                  <Text fontSize={16} fontWeight={isActive ? 700 : 500} color={isActive ? "primary" : "gray01"}>
                    {label}
                  </Text>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {children}
    </div>
  );
};

export default MyLayout;
