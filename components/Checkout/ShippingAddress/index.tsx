"use client";

import Text from "@/components/Common/Text";
import { DELIVERY_REQUESTS } from "@/constants/checkout";
import { UserAddressView } from "@/types/checkout";
import styles from "./ShippingAddress.module.scss";

interface ShippingAddressProps {
  address: UserAddressView | null;
  isLoading?: boolean;
  deliveryRequest: string;
  onDeliveryRequestChange: (value: string) => void;
}

const ShippingAddress = ({
  address,
  isLoading,
  deliveryRequest,
  onDeliveryRequestChange,
}: ShippingAddressProps) => (
  <section className={styles.root}>
    <div className={styles.header}>
      <Text tag="h2" fontSize={22} fontWeight={700} color="gray01">배송지</Text>
      <button type="button" className={styles.changeBtn}>
        <Text tag="span" fontSize={16} fontWeight={700} color="primary">변경</Text>
      </button>
    </div>

    <div className={styles.addressBody}>
      {isLoading ? (
        <Text tag="p" fontSize={15} className={styles.stateText}>배송지를 불러오는 중...</Text>
      ) : address === null ? (
        <Text tag="p" fontSize={15} className={styles.stateText}>등록된 배송지가 없습니다.</Text>
      ) : (
        <>
          <div className={styles.nameRow}>
            <Text tag="span" fontSize={17} fontWeight={700} color="gray01">
              {address.recipientName}
            </Text>
            {address.isDefault && <span className={styles.defaultBadge}>기본배송지</span>}
          </div>
          <Text tag="p" fontSize={16} className={styles.addressText}>
            {address.address}{address.detailAddress ? `, ${address.detailAddress}` : ""}
          </Text>
          <Text tag="p" fontSize={14} className={styles.phoneText}>
            {address.recipientName} {address.phoneNumber}
          </Text>
        </>
      )}
    </div>

    <div className={styles.requestWrap}>
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          value={deliveryRequest}
          onChange={(e) => onDeliveryRequestChange(e.target.value)}
          aria-label="배송사 요청사항"
        >
          {DELIVERY_REQUESTS.map((req) => (
            <option key={req.value} value={req.value} disabled={req.disabled}>
              {req.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  </section>
);

export default ShippingAddress;
