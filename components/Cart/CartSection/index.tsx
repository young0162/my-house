"use client";

import Text from "@/components/Common/Text";
import CartItem from "@/components/Cart/CartItem";
import { CartItemType, CartSectionType } from "@/types/cart";
import styles from "./CartSection.module.scss";

interface CartSectionProps {
  section: CartSectionType;
  checkedIds: Set<number>;
  onCheck: (id: number) => void;
  onCheckAll: (sectionId: string, ids: number[]) => void;
  onRemove: (id: number) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  onDeleteSelected: (sectionId: string) => void;
}

const CartSection = ({
  section,
  checkedIds,
  onCheck,
  onCheckAll,
  onRemove,
  onQuantityChange,
  onDeleteSelected,
}: CartSectionProps) => {
  const sectionIds = section.items.map((item: CartItemType) => item.id);
  const allChecked = sectionIds.length > 0 && sectionIds.every((id) => checkedIds.has(id));

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <Text tag="span" fontSize={14} fontWeight={600} color="gray01">
          패키지할인 가능한 상품 {section.count}
        </Text>
      </div>

      <div className={styles.selectRow}>
        <label className={styles.selectAll}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={allChecked}
            onChange={() => onCheckAll(section.id, sectionIds)}
            aria-label="모두선택"
          />
          <Text tag="span" fontSize={14}>모두선택</Text>
        </label>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => onDeleteSelected(section.id)}
        >
          <Text tag="span" fontSize={13} color="gray01">선택삭제</Text>
        </button>
      </div>

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
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CartSection;
