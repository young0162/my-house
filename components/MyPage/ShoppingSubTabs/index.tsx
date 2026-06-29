import Text from "@/components/Common/Text";
import { SUB_TABS } from "@/constants/mypage";
import type { SubTab } from "@/types/mypage";
import styles from "./ShoppingSubTabs.module.scss";

interface ShoppingSubTabsProps {
  activeTab: SubTab;
  onTabChange: (tab: SubTab) => void;
}

const ShoppingSubTabs = ({ activeTab, onTabChange }: ShoppingSubTabsProps) => (
  <div className={styles.wrap}>
    <div className={styles.inner}>
      <ul className={styles.list}>
        {SUB_TABS.map((tab) => (
          <li key={tab}>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
              onClick={() => onTabChange(tab)}
            >
              <Text fontSize={14} fontWeight={activeTab === tab ? 600 : 400} color={activeTab === tab ? "primary" : "gray01"}>
                {tab}
              </Text>
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ShoppingSubTabs;
