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
      <Text tag="h2" fontSize={18} fontWeight={700} color="gray01">주문상품</Text>
      <Text tag="span" fontSize={14} className={styles.totalCount}>{totalCount}건</Text>
    </div>

    {isLoading ? (
      <div className={styles.loadingWrap}>
        <Text tag="p" fontSize={14} className={styles.loadingText}>불러오는 중...</Text>
      </div>
    ) : sections.length === 0 ? (
      <div className={styles.emptyWrap}>
        <Text tag="p" fontSize={14} className={styles.loadingText}>주문할 상품이 없습니다.</Text>
      </div>
    ) : (
      <div className={styles.sectionList}>
        {sections.map((section) => {
          const hasFreeShipping = section.items.some((item) => item.isFreeShipping);

          return (
            <div key={section.id} className={styles.section}>
              <div className={styles.sectionHeader}>
                <Text tag="span" fontSize={12} fontWeight={700} color="gray01">{section.label}</Text>
                <Text
                  tag="span"
                  fontSize={12}
                  className={hasFreeShipping ? styles.freeShipping : styles.shippingDue}
                >
                  {hasFreeShipping ? "무료배송" : "배송비 착불"}
                </Text>
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
                        sizes="56px"
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
                      <div className={styles.itemPriceRow}>
                        <Text tag="strong" fontSize={13} fontWeight={700} color="gray01">
                          {formatPrice(item.price * item.quantity)}원
                        </Text>
                        <Text tag="span" fontSize={12} className={styles.quantity}>
                          {item.quantity}개
                        </Text>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    )}
  </section>
);

export default OrderItems;
