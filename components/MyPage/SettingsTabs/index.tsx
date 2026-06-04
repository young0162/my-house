import Text from "@/components/Common/Text";
import { SETTINGS_TABS } from "@/constants/memberSettings";
import type { SettingsTab } from "@/types/memberSettings";
import styles from "./SettingsTabs.module.scss";

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const SettingsTabs = ({ activeTab, onTabChange }: SettingsTabsProps) => (
  <nav className={styles.root} aria-label="설정 메뉴">
    <ul className={styles.list}>
      {SETTINGS_TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <li key={tab}>
            <button
              type="button"
              className={`${styles.tab} ${isActive ? styles.active : ""}`}
              onClick={() => onTabChange(tab)}
              aria-pressed={isActive}
            >
              <Text fontSize={14} fontWeight={600} color={isActive ? "primary" : "gray01"}>
                {tab}
              </Text>
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default SettingsTabs;
