import Text from "@/components/Common/Text";
import styles from "./OrderDeliveryInfo.module.scss";

interface OrderDeliveryInfoProps {
  recipientName: string;
  recipientPhone: string;
  address: string;
  deliveryRequest?: string | null;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className={styles.row}>
    <Text fontSize={14} className={styles.label}>{label}</Text>
    <Text fontSize={14} color="gray01">{value}</Text>
  </div>
);

const OrderDeliveryInfo = ({ recipientName, recipientPhone, address, deliveryRequest }: OrderDeliveryInfoProps) => (
  <section className={styles.root}>
    <h2 className={styles.title}>
      <Text fontSize={17} fontWeight={700} color="gray01">배송지정보</Text>
    </h2>
    <div className={styles.card}>
      <InfoRow label="받는 사람" value={recipientName} />
      <InfoRow label="연락처" value={recipientPhone} />
      <InfoRow label="주소" value={address} />
      {deliveryRequest && <InfoRow label="배송 요청사항" value={deliveryRequest} />}
    </div>
  </section>
);

export default OrderDeliveryInfo;
