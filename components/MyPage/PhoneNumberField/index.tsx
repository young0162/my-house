import Text from "@/components/Common/Text";
import styles from "./index.module.scss";

interface PhoneNumberFieldProps {
  value: string;
  onChangeClick: () => void;
}

const PhoneNumberField = ({ value, onChangeClick }: PhoneNumberFieldProps) => (
  <div className={styles.field}>
    <Text tag="label" fontSize={14} fontWeight={500} color="gray01" className={styles.label}>
      휴대폰 번호
    </Text>
    <input className={styles.input} value={value} readOnly aria-readonly="true" aria-label="휴대폰 번호" />
    <button type="button" className={styles.button} onClick={onChangeClick}>
      <Text fontSize={14} fontWeight={600} color="primary">휴대폰 번호 변경하기</Text>
    </button>
  </div>
);

export default PhoneNumberField;
