import Text from "@/components/Common/Text";
import { GENDER_OPTIONS } from "@/constants/memberSettings";
import type { Gender } from "@/types/memberSettings";
import styles from "./GenderField.module.scss";

interface GenderFieldProps {
  value: Gender;
  onChange: (value: Gender) => void;
}

const GenderField = ({ value, onChange }: GenderFieldProps) => (
  <fieldset className={styles.fieldset}>
    <legend className={styles.legend}>
      <Text fontSize={14} fontWeight={500} color="gray01">성별</Text>
    </legend>
    <div className={styles.options}>
      {GENDER_OPTIONS.map((option) => (
        <label key={option.value} className={styles.option}>
          <input
            type="radio"
            name="gender"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className={styles.radio}
          />
          <Text fontSize={14} color="gray01">{option.label}</Text>
        </label>
      ))}
    </div>
  </fieldset>
);

export default GenderField;
