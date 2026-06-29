import { CartIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import type { Order } from "@/types/mypage";
import styles from "./OrderItem.module.scss";

interface OrderItemProps {
  order: Order;
}

const OrderItem = ({ order }: OrderItemProps) => (
  <article className={styles.root}>
    <div className={styles.dateRow}>
      <Text fontSize={14} fontWeight={600} color="gray01">{order.date}</Text>
      <button type="button" className={styles.linkBtn}>
        <Text fontSize={13} color="gray01">주문상세 &gt;</Text>
      </button>
    </div>

    <div className={styles.card}>
      <div className={styles.statusRow}>
        <Text fontSize={13} color="gray01">{order.status} · {order.deliveryInfo}</Text>
        <button type="button" className={styles.linkBtn}>
          <Text fontSize={13} color="primary">배송조회 &gt;</Text>
        </button>
      </div>

      <div className={styles.productRow}>
        <div className={styles.productImage} role="img" aria-label={order.product.name}>
          <span className={styles.filterStick} />
          <span className={styles.filterStick} />
          <span className={styles.filterStick} />
        </div>

        <div className={styles.productInfo}>
          <Text fontSize={14} color="gray01" className={styles.productName}>{order.product.name}</Text>
          <Text fontSize={13} color="gray01">{order.product.option}</Text>
          <Text fontSize={13} color="gray01">
            {order.product.price.toLocaleString()}원 · {order.product.quantity}개
          </Text>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.actionBtnPrimary}>
            <span className={styles.reviewDot} aria-hidden="true" />
            <Text fontSize={13} fontWeight={600} color="primary">리뷰쓰기</Text>
          </button>
          <button type="button" className={styles.actionBtn}>
            <Text fontSize={13} color="gray01">문의</Text>
          </button>
          <button type="button" className={styles.actionBtn}>
            <Text fontSize={13} color="gray01">재구매</Text>
          </button>
          <button type="button" className={styles.cartBtn} aria-label="장바구니 담기">
            <CartIcon />
          </button>
        </div>
      </div>
    </div>
  </article>
);

export default OrderItem;
