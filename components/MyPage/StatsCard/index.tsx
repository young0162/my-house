import { CouponIcon, PointIcon, GradeIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import styles from "./StatsCard.module.scss";

const StatsCard = () => (
  <div className={styles.root}>
    <div className={styles.item}>
      <CouponIcon />
      <Text fontSize={14} color="gray01" className={styles.label}>쿠폰</Text>
      <Text fontSize={14} fontWeight={700} color="primary">0</Text>
    </div>
    <div className={styles.divider} />
    <div className={styles.item}>
      <PointIcon />
      <Text fontSize={14} color="gray01" className={styles.label}>포인트</Text>
      <Text fontSize={14} fontWeight={700} color="primary">0P</Text>
    </div>
    <div className={styles.divider} />
    <div className={styles.item}>
      <GradeIcon />
      <Text fontSize={14} color="gray01" className={styles.label}>구매등급</Text>
      <Text fontSize={14} fontWeight={700} color="primary">WELCOME</Text>
    </div>
  </div>
);

export default StatsCard;
