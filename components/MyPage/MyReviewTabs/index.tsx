import Text from "@/components/Common/Text";
import { MY_REVIEW_TABS } from "@/constants/myReview";
import type { MyReviewTab } from "@/types/myReview";
import styles from "./index.module.scss";

interface MyReviewTabsProps {
  activeTab: MyReviewTab;
  onTabChange: (tab: MyReviewTab) => void;
}

const MyReviewTabs = ({ activeTab, onTabChange }: MyReviewTabsProps) => (
  <nav className={styles.wrap} aria-label="리뷰 서브 탭">
    <div className={styles.inner}>
      <ul className={styles.list}>
        {MY_REVIEW_TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <li key={tab}>
              <button
                type="button"
                className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
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
    </div>
  </nav>
);

export default MyReviewTabs;
