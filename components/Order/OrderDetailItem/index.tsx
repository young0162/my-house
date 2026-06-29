import Image from "next/image";
import Text from "@/components/Common/Text";
import type { OrderDetailItem as OrderDetailItemType } from "@/types/order";
import styles from "./OrderDetailItem.module.scss";

interface OrderDetailItemProps {
  item: OrderDetailItemType;
  status: string;
  deliveryInfo: string;
  shippingFee: number;
  onReview: () => void;
}

const OrderDetailItem = ({ item, status, deliveryInfo, shippingFee, onReview }: OrderDetailItemProps) => (
  <div className={styles.root}>
    <div className={styles.statusBar}>
      <Text fontSize={14} fontWeight={600} color="gray01">
        {status} · {deliveryInfo}
      </Text>
      <button type="button" className={styles.linkBtn}>
        <Text fontSize={13} color="primary">배송조회 &gt;</Text>
      </button>
    </div>

    <div className={styles.productRow}>
      <div className={styles.imageWrap}>
        <Image
          src={item.imageUrl}
          alt={item.productName}
          width={80}
          height={80}
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <Text fontSize={14} fontWeight={500} color="gray01" className={styles.productName}>
          {item.productName}
        </Text>
        {item.optionLabel && (
          <Text fontSize={13} className={styles.muted}>{item.optionLabel}</Text>
        )}
        <Text fontSize={13} className={styles.muted}>
          {item.price.toLocaleString()}원 · {item.quantity}개
        </Text>
        <Text fontSize={13} className={styles.muted}>{status}</Text>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btnOutlined}>
          <Text fontSize={13} color="gray01">문의</Text>
        </button>
        <button type="button" className={styles.btnPrimary} onClick={onReview}>
          <Text fontSize={13} fontWeight={600} color="primary">리뷰 남기기</Text>
        </button>
      </div>
    </div>

    <div className={styles.footer}>
      <Text fontSize={13} className={styles.muted}>
        배송비{" "}
        <Text tag="span" fontSize={13} color="gray01">
          {item.isFreeShipping ? "무료" : `${shippingFee.toLocaleString()}원`} ({item.deliveryMethod})
        </Text>
      </Text>
      <Text fontSize={13} className={styles.muted}>
        판매자 <Text tag="span" fontSize={13} color="gray01">{item.brandName}</Text>
      </Text>
    </div>
  </div>
);

export default OrderDetailItem;
