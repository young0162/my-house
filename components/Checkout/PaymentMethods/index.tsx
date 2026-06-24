"use client";

import Text from "@/components/Common/Text";
import { EASY_PAY_OPTIONS, PAYMENT_METHODS } from "@/constants/checkout";
import styles from "./PaymentMethods.module.scss";

const PaymentMethods = () => (
  <section className={styles.root}>
    <div className={styles.header}>
      <Text tag="h2" fontSize={18} fontWeight={700} color="gray01">결제수단</Text>
    </div>

    <div className={styles.naverBenefit}>
      <span className={styles.naverBadge}>N</span>
      <Text tag="span" fontSize={11} fontWeight={700} className={styles.naverText}>
        네이버페이 결제 고객 중 5,000P 추가적립
      </Text>
    </div>

    <ul className={styles.methodList}>
      {PAYMENT_METHODS.map((method) => (
        <li key={method.id} className={styles.methodItem}>
          <div className={styles.methodRow}>
            <span className={`${styles.radio} ${method.selected ? styles.selectedRadio : ""}`} />
            <Text tag="span" fontSize={14} fontWeight={600} color="gray01">{method.label}</Text>
            {"badge" in method && method.badge && (
              <Text tag="span" fontSize={10} className={styles.badge}>{method.badge}</Text>
            )}
            {"rightText" in method && method.rightText && (
              <Text tag="span" fontSize={12} className={styles.rightText}>{method.rightText}</Text>
            )}
          </div>

          {method.id === "easy-pay" && (
            <div className={styles.easyPayPanel}>
              {EASY_PAY_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`${styles.easyPayOption} ${option.selected ? styles.selectedOption : ""}`}
                >
                  <span className={`${styles.payLogo} ${styles[option.brandClassName]}`}>
                    {option.label.slice(0, 1)}
                  </span>
                  <Text tag="span" fontSize={13} fontWeight={700} color="gray01">{option.label}</Text>
                  <Text tag="span" fontSize={12} className={styles.optionBenefit}>{option.benefit}</Text>
                </button>
              ))}
              <Text tag="p" fontSize={11} className={styles.payNotice}>
                [6/1~30] 5,000P 적립, 네이버페이 머니 결제 고객 중 4,000P 추첨
              </Text>
            </div>
          )}
        </li>
      ))}
    </ul>
  </section>
);

export default PaymentMethods;
