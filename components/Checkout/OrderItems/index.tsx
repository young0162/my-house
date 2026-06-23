"use client";

import Image from "next/image";
import Text from "@/components/Common/Text";
import { formatPrice } from "@/app/utils/format";
import { CartSectionType } from "@/types/cart";
import styles from "./OrderItems.module.scss";

interface OrderItemsProps {
  sections: CartSectionType[];
  totalCount: number;
  isLoading: boolean;
}

const OrderItems = ({ sections, totalCount, isLoading }: OrderItemsProps) => (
  <section className={styles.root}>
    <div className={styles.header}>
      <Text tag="h2" fontSize={16} fontWeight={700} color="gray01">주문상품</Text>
      <Text tag="span" fontSize={14} className={styles.totalCount}>{totalCount}건</Text>
    </div>

    {isLoading ? (
      <div className={styles.loadingWrap}>
        <Text tag="p" fontSize={14} className={styles.loadingText}>불러오는 중...</Text>
      </div>
    ) : (
      sections.map((section) => (
        <div key={section.id} className={styles.section}>
          <div className={styles.sectionHeader}>
            <Text tag="span" fontSize={13} fontWeight={600} color="gray01">{section.label}</Text>
            {section.items.some((item) => item.isFreeShipping) && (
              <Text tag="span" fontSize={12} className={styles.freeShipping}>무료배송</Text>
            )}
          </div>
          <Text tag="p" fontSize={12} className={styles.deliveryType}>업체직접배송</Text>

          <ul className={styles.itemList}>
            {section.items.map((item) => (
              <li key={item.id} className={styles.item}>
                <div className={styles.imageWrap}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="72px"
                    className={styles.image}
                  />
                </div>
                <div className={styles.itemInfo}>
                  <Text tag="p" fontSize={13} color="gray01" className={styles.itemName}>
                    {item.name}
                  </Text>
                  {item.optionLabel && (
                    <Text tag="p" fontSize={12} className={styles.itemOption}>
                      {item.optionLabel}
                    </Text>
                  )}
                  <Text tag="p" fontSize={13} fontWeight={600} color="gray01">
                    {formatPrice(item.price * item.quantity)}원
                  </Text>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))
    )}
  </section>
);

export default OrderItems;
