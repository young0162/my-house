import Text from "@/components/Common/Text";
import styles from "./ReferralCard.module.scss";

const ReferralCard = () => (
  <div className={styles.root}>
    <div className={styles.left}>
      <Text fontSize={14} color="gray01">나의 추천코드</Text>
      <Text fontSize={15} fontWeight={700} color="gray01" className={styles.code}>WK962OH5</Text>
    </div>
    <div className={styles.center}>
      <Text fontSize={14} color="gray01">나는 5000P, 친구는 5000원 쿠폰</Text>
    </div>
    <button type="button" className={styles.btn}>
      <Text fontSize={15} fontWeight={700} color="white">추천하기</Text>
    </button>
  </div>
);

export default ReferralCard;
