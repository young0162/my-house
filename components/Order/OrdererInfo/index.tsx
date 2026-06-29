import Text from "@/components/Common/Text";
import styles from "./OrdererInfo.module.scss";

interface OrdererInfoProps {
  ordererName: string;
  ordererPhone: string;
  ordererEmail: string;
}

const OrdererInfo = ({ ordererName, ordererPhone, ordererEmail }: OrdererInfoProps) => (
  <section className={styles.root}>
    <h2 className={styles.title}>
      <Text fontSize={17} fontWeight={700} color="gray01">주문자정보</Text>
    </h2>
    <div className={styles.card}>
      <div className={styles.info}>
        <div className={styles.row}>
          <Text fontSize={14} className={styles.label}>주문자</Text>
          <Text fontSize={14} color="gray01">{ordererName}</Text>
        </div>
        <div className={styles.row}>
          <Text fontSize={14} className={styles.label}>연락처</Text>
          <Text fontSize={14} color="gray01">{ordererPhone}</Text>
        </div>
        <div className={styles.row}>
          <Text fontSize={14} className={styles.label}>이메일</Text>
          <Text fontSize={14} color="gray01">{ordererEmail}</Text>
        </div>
      </div>
      <div className={styles.customerService}>
        <Text fontSize={13} className={styles.muted}>오늘의집 고객센터 </Text>
        <Text fontSize={13} fontWeight={600} color="gray01">1670-0876</Text>
      </div>
    </div>
  </section>
);

export default OrdererInfo;
