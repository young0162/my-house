import type { ChangeEventHandler, HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from "react";
import Text from "@/components/Common/Text";
import styles from "./index.module.scss";

interface SettingsTextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "email";
}

const SettingsTextField = ({
  id,
  label,
  value,
  onChange,
  required = false,
  readOnly = false,
  placeholder,
  helperText,
  error,
  type = "text",
  autoComplete,
  maxLength,
  inputMode,
}: SettingsTextFieldProps) => {
  const descriptionId = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        <Text fontSize={14} fontWeight={500} color="gray01">
          {label}
        </Text>
        {required ? <span className={styles.required} aria-hidden="true"><Text>*</Text></span> : null}
        {required ? <Text className={styles.srOnly}>필수</Text> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        aria-readonly={readOnly}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={`${styles.input} ${readOnly ? styles.readOnly : ""} ${error ? styles.invalid : ""}`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        inputMode={inputMode}
      />
      {error ? (
        <Text tag="p" fontSize={12} className={styles.error} color="gray01">
          <span id={`${id}-error`}>{error}</span>
        </Text>
      ) : helperText ? (
        <Text tag="p" fontSize={12} color="gray01" className={styles.helper}>
          <span id={`${id}-helper`}>{helperText}</span>
        </Text>
      ) : null}
    </div>
  );
};

export default SettingsTextField;
