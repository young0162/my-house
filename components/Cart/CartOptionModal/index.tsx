"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Text from "@/components/Common/Text";
import { CloseIcon } from "@/components/Common/Icon";
import { formatPrice } from "@/app/utils/format";
import { CartItemType } from "@/types/cart";
import styles from "./CartOptionModal.module.scss";

interface CartOptionModalProps {
  item: CartItemType;
  onClose: () => void;
  onConfirm: (item: CartItemType, optionValueIds: number[], quantity: number) => void;
  isSubmitting?: boolean;
}

const getInitialOptions = (item: CartItemType) => {
  const selectedIds = new Set(item.selectedOptionValueIds);
  return item.options.reduce<Record<string, number>>((acc, option) => {
    const selected = option.values.find((value) => selectedIds.has(value.id));
    if (selected) acc[option.label] = selected.id;
    return acc;
  }, {});
};

const CartOptionModal = ({ item, onClose, onConfirm, isSubmitting }: CartOptionModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState(() => getInitialOptions(item));
  const [quantity, setQuantity] = useState(item.quantity);

  const allOptionsSelected = item.options.every((option) => selectedOptions[option.label] !== undefined);
  const selectedOptionValueIds = useMemo(
    () => item.options.map((option) => selectedOptions[option.label]).filter((id): id is number => typeof id === "number"),
    [item.options, selectedOptions],
  );
  const totalPrice = item.price * quantity;

  const handleOptionChange = (label: string, optionValueId: number) => {
    setSelectedOptions((prev) => ({ ...prev, [label]: optionValueId }));
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="옵션변경">
      <section className={styles.modal}>
        <header className={styles.header}>
          <Text tag="h2" fontSize={20} fontWeight={800} color="gray01">
            옵션변경
          </Text>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="옵션변경 닫기">
            <CloseIcon size={24} />
          </button>
        </header>

        <div className={styles.productRow}>
          <div className={styles.imageWrap}>
            <Image src={item.image} alt={item.name} fill sizes="72px" className={styles.image} />
          </div>
          <div className={styles.productInfo}>
            <Text tag="strong" fontSize={14} fontWeight={700} color="gray01" className={styles.productName}>
              [{item.brand}] {item.name}
            </Text>
            <Text tag="span" fontSize={12} className={styles.deliveryText}>
              배송비 30,000원 착불 · 업체직접배송
            </Text>
          </div>
        </div>

        <div className={styles.selectList}>
          {item.options.map((option) => (
            <label key={option.label} className={styles.selectWrap}>
              <select
                className={styles.select}
                value={selectedOptions[option.label] ?? ""}
                onChange={(event) => handleOptionChange(option.label, Number(event.target.value))}
              >
                <option value="" disabled>
                  {option.label}
                </option>
                {option.values.map((value) => (
                  <option key={value.id} value={value.id}>
                    {value.value}
                  </option>
                ))}
              </select>
            </label>
          ))}

          <label className={styles.selectWrap}>
            <select className={styles.select} value="" disabled>
              <option value="">추가상품 (선택)</option>
            </select>
          </label>
        </div>

        <div className={styles.optionCard}>
          <div className={styles.optionCardHeader}>
            <Text tag="span" fontSize={13} color="gray01">
              {item.optionLabel}
            </Text>
            <button type="button" className={styles.optionCloseButton} aria-label="선택 옵션 삭제">
              <CloseIcon size={16} />
            </button>
          </div>
          <div className={styles.optionCardBody}>
            <div className={styles.quantityControl}>
              <button
                type="button"
                className={styles.quantityButton}
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                aria-label="수량 감소"
              >
                <Text tag="span" fontSize={18}>−</Text>
              </button>
              <Text tag="span" fontSize={14} fontWeight={600} className={styles.quantityValue}>
                {quantity}
              </Text>
              <button
                type="button"
                className={styles.quantityButton}
                onClick={() => setQuantity((prev) => prev + 1)}
                aria-label="수량 증가"
              >
                <Text tag="span" fontSize={18}>＋</Text>
              </button>
            </div>
            <Text tag="strong" fontSize={15} fontWeight={800} color="gray01">
              {formatPrice(totalPrice)}원
            </Text>
          </div>
        </div>

        <div className={styles.orderRow}>
          <Text tag="span" fontSize={14} fontWeight={700} color="gray01">
            주문금액
          </Text>
          <Text tag="strong" fontSize={20} fontWeight={800} color="gray01">
            {formatPrice(totalPrice)}원
          </Text>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            <Text tag="span" fontSize={16} fontWeight={700} color="gray01">취소</Text>
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            disabled={!allOptionsSelected || isSubmitting}
            onClick={() => onConfirm(item, selectedOptionValueIds, quantity)}
          >
            <Text tag="span" fontSize={16} fontWeight={700} color="white">
              {isSubmitting ? "변경 중..." : "확인"}
            </Text>
          </button>
        </div>
      </section>
    </div>
  );
};

export default CartOptionModal;
