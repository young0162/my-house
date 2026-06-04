import { ExclamationCircleIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import styles from "./ReviewPointBanner.module.scss";

const ReviewPointBanner = () => (
  <div className={styles.root}>
    <div className={styles.left}>
      <span className={styles.icon}>
        <ExclamationCircleIcon />
      </span>
      <Text fontSize={13} color="gray01">리뷰 남기고 받을 수 있는 포인트</Text>
    </div>
    <button type="button" className={styles.pointBtn}>
      <Text fontSize={13} fontWeight={600} color="primary">총 600P</Text>
      <Text fontSize={13} color="primary"> &gt;</Text>
    </button>
  </div>
);

export default ReviewPointBanner;
