import Text from "@/components/Common/Text";
import { PROFILE_ACTIVITY_TABS } from "@/constants/mypage";
import type { ProfileActivityTab } from "@/types/mypage";
import styles from "./index.module.scss";

interface ProfileActivityTabsProps {
  activeTab: ProfileActivityTab;
  onTabChange: (tab: ProfileActivityTab) => void;
}

const ProfileActivityTabs = ({ activeTab, onTabChange }: ProfileActivityTabsProps) => (
  <nav className={styles.wrap} aria-label="프로필 활동 탭">
    <div className={styles.inner}>
      <ul className={styles.list}>
        {PROFILE_ACTIVITY_TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <li key={tab}>
              <button
                type="button"
                className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                onClick={() => onTabChange(tab)}
                aria-pressed={isActive}
              >
                <Text fontSize={14} fontWeight={isActive ? 700 : 500} color={isActive ? "primary" : "gray01"}>
                  {tab}
                </Text>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  </nav>
);

export default ProfileActivityTabs;
