import Image from "next/image";
import { CartIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import type { ShoppingOrder, ShoppingOrderProduct } from "@/types/order";
import styles from "./OrderItem.module.scss";

interface OrderItemProps {
  order: ShoppingOrder;
}

const ProductRow = ({ product }: { product: ShoppingOrderProduct }) => (
  <div className={styles.productRow}>
    <div className={styles.productImage}>
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={64}
        height={64}
        className={styles.image}
      />
    </div>

    <div className={styles.productInfo}>
      <Text fontSize={14} color="gray01" className={styles.productName}>{product.name}</Text>
      <Text fontSize={13} color="gray01">{product.option}</Text>
      <Text fontSize={13} color="gray01">
        {product.price.toLocaleString()}원 · {product.quantity}개
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
);

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

      {order.products.map((product, i) => (
        <div key={`${product.name}-${i}`}>
          {i > 0 && <div className={styles.productDivider} />}
          <ProductRow product={product} />
        </div>
      ))}
    </div>
  </article>
);

export default OrderItem;
