"use client";

import Text from "@/components/Common/Text";
import CartItem from "@/components/Cart/CartItem";
import { CartItemType, CartSectionType } from "@/types/cart";
import styles from "./CartSection.module.scss";

interface CartSectionProps {
  section: CartSectionType;
  checkedIds: Set<number>;
  onCheck: (id: number) => void;
  onRemove: (id: number) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  onOptionChange: (item: CartItemType) => void;
  onBuy: (id: number) => void;
}

const CartSection = ({
  section,
  checkedIds,
  onCheck,
  onRemove,
  onQuantityChange,
  onOptionChange,
  onBuy,
}: CartSectionProps) => (
  <section className={styles.root}>
    <div className={styles.brandGroup}>
      <Text tag="span" fontSize={13} fontWeight={600} className={styles.brandLabel}>
        {section.label}
      </Text>
      <ul className={styles.itemList}>
        {section.items.map((item: CartItemType) => (
          <CartItem
            key={item.id}
            item={item}
            checked={checkedIds.has(item.id)}
            onCheck={onCheck}
            onRemove={onRemove}
            onQuantityChange={onQuantityChange}
            onOptionChange={onOptionChange}
            onBuy={onBuy}
          />
        ))}
      </ul>
    </div>
  </section>
);

export default CartSection;
