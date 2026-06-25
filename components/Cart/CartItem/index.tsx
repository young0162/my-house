"use client";

import Image from "next/image";
import Text from "@/components/Common/Text";
import { CloseIcon } from "@/components/Common/Icon";
import { formatPrice } from "@/app/utils/format";
import { CartItemType } from "@/types/cart";
import styles from "./CartItem.module.scss";

interface CartItemProps {
  item: CartItemType;
  checked: boolean;
  onCheck: (id: number) => void;
  onRemove: (id: number) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  onOptionChange: (item: CartItemType) => void;
  onBuy: (id: number) => void;
}

const CartItem = ({
  item,
  checked,
  onCheck,
  onRemove,
  onQuantityChange,
  onOptionChange,
  onBuy,
}: CartItemProps) => (
  <li className={styles.root}>
    <div className={styles.row}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={() => onCheck(item.id)}
        aria-label={`${item.name} 선택`}
      />

      <div className={styles.imageWrap}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <Text tag="p" fontSize={14} fontWeight={500} className={styles.name}>
            {item.name}
          </Text>
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => onRemove(item.id)}
            aria-label="상품 삭제"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <div className={styles.deliveryRow}>
          <Text tag="span" fontSize={13} className={styles.deliveryDate}>
            {item.deliveryDate}
          </Text>
          <Text tag="span" fontSize={12} className={styles.deliveryMethod}>
            {item.deliveryMethod}
          </Text>
          <Text tag="span" fontSize={10} fontWeight={700} className={styles.saleBadge}>
            특별할인가
          </Text>
        </div>
      </div>
    </div>

    <div className={styles.optionRow}>
      <Text tag="span" fontSize={13} className={styles.optionLabel}>
        {item.optionLabel}
      </Text>
      <button type="button" className={styles.optionRemoveBtn} aria-label="옵션 삭제">
        <CloseIcon size={14} />
      </button>
    </div>

    <div className={styles.quantityRow}>
      <div className={styles.quantityControl}>
        <button
          type="button"
          className={styles.qtyBtn}
          onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
          aria-label="수량 감소"
        >
          <Text tag="span" fontSize={16}>−</Text>
        </button>
        <Text tag="span" fontSize={14} fontWeight={500} className={styles.qtyValue}>
          {item.quantity}
        </Text>
        <button
          type="button"
          className={styles.qtyBtn}
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          aria-label="수량 증가"
        >
          <Text tag="span" fontSize={16}>+</Text>
        </button>
      </div>

      <Text tag="span" fontSize={15} fontWeight={700} className={styles.itemPrice}>
        {formatPrice(item.price * item.quantity)}원
      </Text>
    </div>

    <div className={styles.actionRow}>
      <div className={styles.actionBtns}>
        <button type="button" className={styles.actionBtn} onClick={() => onOptionChange(item)}>
          <Text tag="span" fontSize={13}>옵션변경</Text>
        </button>
        <button type="button" className={`${styles.actionBtn} ${styles.buyBtn}`} onClick={() => onBuy(item.id)}>
          <Text tag="span" fontSize={13} color="white">구매하기</Text>
        </button>
      </div>

      <div className={styles.actionRight}>
        <Text tag="span" fontSize={15} fontWeight={700}>
          {formatPrice(item.price * item.quantity)}원
        </Text>
        {item.isFreeShipping && (
          <Text tag="span" fontSize={12} className={styles.freeShippingBadge}>
            무료배송
          </Text>
        )}
      </div>
    </div>
  </li>
);

export default CartItem;
