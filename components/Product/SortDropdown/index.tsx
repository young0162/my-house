"use client";

import { useState } from "react";
import { PRODUCT_SORT_OPTIONS } from "@/constants/product";
import { SortOption } from "@/app/types/product";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/Common/Icon";
import styles from "./index.module.scss";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const InfoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="#bbb" strokeWidth="1.8" />
    <path d="M12 11v5" stroke="#bbb" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="7.5" r="1" fill="#bbb" />
  </svg>
);

const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const currentLabel = PRODUCT_SORT_OPTIONS.find((o) => o.value === value)?.label ?? "추천순";

  const handleSelect = (v: SortOption) => {
    onChange(v);
    setIsOpen(false);
  };

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{currentLabel}</span>
        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>

      {isOpen && (
        <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
      )}

      <div className={`${styles.modal} ${isOpen ? styles.modalOpen : ""}`}>
        <ul className={styles.grid}>
          {PRODUCT_SORT_OPTIONS.map((option) => {
            const isActive = value === option.value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  className={`${styles.option} ${isActive ? styles.optionActive : ""}`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className={`${styles.radio} ${isActive ? styles.radioActive : ""}`}>
                    {isActive && <span className={styles.radioDot} />}
                  </span>
                  <span className={styles.label}>{option.label}</span>
                  {option.info && (
                    <span
                      className={styles.infoWrap}
                      onMouseEnter={() => setTooltip(option.info!)}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <InfoIcon />
                      {tooltip === option.info && (
                        <span className={styles.tooltip}>{option.info}</span>
                      )}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SortDropdown;
