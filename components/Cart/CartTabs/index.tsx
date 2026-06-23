"use client";

import Text from "@/components/Common/Text";
import styles from "./CartTabs.module.scss";

const TABS = [
  { id: "cart", label: "장바구니" },
  { id: "package", label: "패키지할인" },
  { id: "remain", label: "5개남음" },
];

interface CartTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CartTabs = ({ activeTab, onTabChange }: CartTabsProps) => (
  <nav className={styles.root} aria-label="장바구니 탭">
    <ul className={styles.list}>
      {TABS.map((tab) => (
        <li key={tab.id}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Text tag="span" fontSize={15} fontWeight={activeTab === tab.id ? 700 : 400}>
              {tab.label}
            </Text>
          </button>
        </li>
      ))}
    </ul>
  </nav>
);

export default CartTabs;
