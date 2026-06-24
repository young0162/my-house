"use client";

import Text from "@/components/Common/Text";
import { EMAIL_DOMAINS, PHONE_AREA_CODES } from "@/constants/checkout";
import { OrdererFormValues } from "@/types/checkout";
import styles from "./OrdererForm.module.scss";

interface OrdererFormProps {
  form: OrdererFormValues;
  onFieldChange: <K extends keyof OrdererFormValues>(key: K, value: OrdererFormValues[K]) => void;
}

const OrdererForm = ({ form, onFieldChange }: OrdererFormProps) => (
  <section className={styles.root}>
    <div className={styles.header}>
      <Text tag="h2" fontSize={22} fontWeight={700} color="gray01">주문자</Text>
    </div>

    <div className={styles.formBody}>
      <div className={styles.formRow}>
        <Text tag="span" fontSize={14} className={styles.formLabel}>이름</Text>
        <input
          type="text"
          className={styles.textInput}
          value={form.name}
          onChange={(e) => onFieldChange("name", e.target.value)}
          aria-label="이름"
        />
      </div>

      <div className={styles.formRow}>
        <Text tag="span" fontSize={14} className={styles.formLabel}>이메일</Text>
        <div className={styles.emailGroup}>
          <input
            type="text"
            className={styles.textInput}
            value={form.emailLocal}
            onChange={(e) => onFieldChange("emailLocal", e.target.value)}
            aria-label="이메일 아이디"
          />
          <Text tag="span" fontSize={18} className={styles.atSign}>@</Text>
          <div className={styles.selectWrapper}>
            <select
              className={`${styles.select} ${styles.selectDomain}`}
              value={form.emailDomain}
              onChange={(e) => onFieldChange("emailDomain", e.target.value)}
              aria-label="이메일 도메인"
            >
              {EMAIL_DOMAINS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.formRow}>
        <Text tag="span" fontSize={14} className={styles.formLabel}>전화번호</Text>
        <div className={styles.phoneGroup}>
          <div className={styles.selectWrapper}>
            <select
              className={`${styles.select} ${styles.selectAreaCode}`}
              value={form.phoneArea}
              onChange={(e) => onFieldChange("phoneArea", e.target.value)}
              aria-label="지역번호"
            >
              {PHONE_AREA_CODES.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            className={`${styles.textInput} ${styles.phoneInput}`}
            value={form.phoneNumber}
            onChange={(e) => onFieldChange("phoneNumber", e.target.value)}
            placeholder="0000-0000"
            aria-label="전화번호"
          />
        </div>
      </div>
    </div>
  </section>
);

export default OrdererForm;
