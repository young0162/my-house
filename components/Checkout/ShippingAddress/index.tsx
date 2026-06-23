"use client";

import Text from "@/components/Common/Text";
import { DELIVERY_REQUESTS } from "@/constants/checkout";
import styles from "./ShippingAddress.module.scss";

interface ShippingAddressProps {
  deliveryRequest: string;
  onDeliveryRequestChange: (value: string) => void;
}

const ShippingAddress = ({ deliveryRequest, onDeliveryRequestChange }: ShippingAddressProps) => (
  <section className={styles.root}>
    <div className={styles.header}>
      <Text tag="h2" fontSize={16} fontWeight={700} color="gray01">배송지</Text>
      <button type="button" className={styles.changeBtn}>
        <Text tag="span" fontSize={13} color="primary">변경</Text>
      </button>
    </div>

    <div className={styles.addressBody}>
      <div className={styles.nameRow}>
        <Text tag="span" fontSize={14} fontWeight={600} color="gray01">장도영</Text>
        <span className={styles.defaultBadge}>기본배송지</span>
      </div>
      <Text tag="p" fontSize={14} className={styles.addressText}>
        서울 광진구 영화사로3길 20-8 (중곡동), 202호
      </Text>
      <Text tag="p" fontSize={13} className={styles.phoneText}>
        장도영 010-3825-0313
      </Text>
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
