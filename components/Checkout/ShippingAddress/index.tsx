"use client";

import Text from "@/components/Common/Text";
import { DELIVERY_REQUESTS, PHONE_AREA_CODES } from "@/constants/checkout";
import { ShippingAddressFormValues, UserAddressView } from "@/types/checkout";
import styles from "./ShippingAddress.module.scss";

interface ShippingAddressProps {
  address: UserAddressView | null;
  isLoading?: boolean;
  emptyAddressForm: ShippingAddressFormValues;
  onEmptyAddressFieldChange: <K extends keyof ShippingAddressFormValues>(
    key: K,
    value: ShippingAddressFormValues[K],
  ) => void;
  deliveryRequest: string;
  onDeliveryRequestChange: (value: string) => void;
  onChangeAddress: () => void;
}

const ShippingAddress = ({
  address,
  isLoading,
  emptyAddressForm,
  onEmptyAddressFieldChange,
  deliveryRequest,
  onDeliveryRequestChange,
  onChangeAddress,
}: ShippingAddressProps) => {
  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <Text tag="h2" fontSize={22} fontWeight={700} color="gray01">배송지</Text>
        {address === null ? (
          <button type="button" className={styles.sameAsOrdererBtn}>
            <Text tag="span" fontSize={16} fontWeight={700} color="primary">위와 동일하게 채우기</Text>
          </button>
        ) : (
          <button type="button" className={styles.changeBtn} onClick={onChangeAddress}>
            <Text tag="span" fontSize={16} fontWeight={700} color="primary">변경</Text>
          </button>
        )}
      </div>

      <div className={`${styles.addressBody} ${address === null ? styles.emptyAddressBody : ""}`}>
        {isLoading ? (
          <Text tag="p" fontSize={15} className={styles.stateText}>배송지를 불러오는 중...</Text>
        ) : address === null ? (
          <div className={styles.emptyAddressForm}>
            <label className={styles.formRow}>
              <Text tag="span" fontSize={14} className={styles.formLabel}>배송지명</Text>
              <input
                className={styles.textInput}
                value={emptyAddressForm.addressName}
                onChange={(e) => onEmptyAddressFieldChange("addressName", e.target.value)}
              />
            </label>
            <label className={styles.formRow}>
              <Text tag="span" fontSize={14} className={styles.formLabel}>받는 사람</Text>
              <input
                className={styles.textInput}
                value={emptyAddressForm.recipientName}
                onChange={(e) => onEmptyAddressFieldChange("recipientName", e.target.value)}
              />
            </label>
            <div className={styles.formRow}>
              <Text tag="span" fontSize={14} className={styles.formLabel}>전화번호</Text>
              <div className={styles.phoneGroup}>
                <div className={styles.selectWrapper}>
                  <select
                    className={`${styles.select} ${styles.phoneAreaSelect}`}
                    value={emptyAddressForm.phoneArea}
                    onChange={(e) => onEmptyAddressFieldChange("phoneArea", e.target.value)}
                    aria-label="배송지 전화번호 앞자리"
                  >
                    {PHONE_AREA_CODES.map((code) => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                </div>
                <input
                  className={`${styles.textInput} ${styles.phoneInput}`}
                  value={emptyAddressForm.phoneNumber}
                  onChange={(e) => onEmptyAddressFieldChange("phoneNumber", e.target.value)}
                  aria-label="배송지 전화번호"
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <Text tag="span" fontSize={14} className={styles.formLabel}>주소</Text>
              <div className={styles.addressFields}>
                <div className={styles.zipRow}>
                  <button type="button" className={styles.findAddressBtn}>
                    <Text tag="span" fontSize={14} fontWeight={700} color="primary">주소찾기</Text>
                  </button>
                  <input
                    className={`${styles.textInput} ${styles.zipInput}`}
                    value={emptyAddressForm.zipCode}
                    onChange={(e) => onEmptyAddressFieldChange("zipCode", e.target.value)}
                    aria-label="우편번호"
                  />
                </div>
                <input
                  className={`${styles.textInput} ${styles.addressInput}`}
                  value={emptyAddressForm.address}
                  onChange={(e) => onEmptyAddressFieldChange("address", e.target.value)}
                  aria-label="주소"
                />
                <input
                  className={`${styles.textInput} ${styles.addressInput}`}
                  value={emptyAddressForm.detailAddress}
                  onChange={(e) => onEmptyAddressFieldChange("detailAddress", e.target.value)}
                  placeholder="상세주소 입력"
                  aria-label="상세주소"
                />
              </div>
            </div>
            <label className={styles.defaultCheck}>
              <input
                type="checkbox"
                checked={emptyAddressForm.isDefault}
                onChange={(e) => onEmptyAddressFieldChange("isDefault", e.target.checked)}
              />
              <Text tag="span" fontSize={16} color="gray01">기본 배송지로 저장</Text>
            </label>
          </div>
        ) : (
          <>
            <div className={styles.nameRow}>
              <Text tag="span" fontSize={17} fontWeight={700} color="gray01">
                {address.recipientName}
              </Text>
              {address.isDefault && (
                <Text tag="span" className={styles.defaultBadge}>
                  기본배송지
                </Text>
              )}
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
};

export default ShippingAddress;
