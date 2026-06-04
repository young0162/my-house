import Link from "next/link";
import { HomeQuickMenuIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import { HOME_QUICK_MENU_ITEMS } from "@/constants/home";
import styles from "./HomeQuickMenu.module.scss";

const HomeQuickMenu = () => (
  <nav aria-label="빠른 메뉴">
    <ul className={styles.list}>
      {HOME_QUICK_MENU_ITEMS.map((item) => (
        <li key={item.label}>
          <Link href={item.href} className={styles.link}>
            <span className={styles.iconWrap}><HomeQuickMenuIcon name={item.icon} color={item.color} /></span>
            <Text fontSize={14} fontWeight={500} color="gray01" className={styles.label}>{item.label}</Text>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default HomeQuickMenu;
