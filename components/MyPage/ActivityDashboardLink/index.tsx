import Text from "@/components/Common/Text";
import styles from "./ActivityDashboardLink.module.scss";

const ActivityDashboardLink = () => (
  <button type="button" className={styles.btn} disabled aria-disabled="true">
    <Text fontSize={14} fontWeight={600} color="gray01">활동 대시보드</Text>
  </button>
);

export default ActivityDashboardLink;
