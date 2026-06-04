import { useState } from "react";
import { ChevronDownIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import {
  REVIEW_POLICY_TITLE,
  REVIEW_POLICY_CONTENT,
  REVIEW_POLICY_NOTICE,
} from "@/constants/myReview";
import styles from "./ReviewPolicyAgreement.module.scss";

interface ReviewPolicyAgreementProps {
  agreed: boolean;
  onChange: (agreed: boolean) => void;
  error?: string;
}

const ReviewPolicyAgreement = ({ agreed, onChange, error }: ReviewPolicyAgreementProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.accordion}>
        <button
          type="button"
          className={styles.accordionHeader}
          onClick={() => setIsOpen((p) => !p)}
          aria-expanded={isOpen}
        >
          <Text fontSize={14} fontWeight={600} color="gray01">{REVIEW_POLICY_TITLE}</Text>
          <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
            <ChevronDownIcon />
          </span>
        </button>
        {isOpen && (
          <div className={styles.accordionBody}>
            <Text fontSize={13} className={styles.policyContent}>
              {REVIEW_POLICY_CONTENT}
            </Text>
          </div>
        )}
      </div>

      <div className={styles.notice}>
        <Text fontSize={12} className={styles.noticeText}>{REVIEW_POLICY_NOTICE}</Text>
      </div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={agreed}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={error ? "policy-error" : undefined}
        />
        <Text fontSize={14} color="gray01">오늘의집 리뷰 정책에 동의합니다</Text>
      </label>

      {error && (
        <span id="policy-error"><Text fontSize={12} className={styles.error}>{error}</Text></span>
      )}
    </div>
  );
};

export default ReviewPolicyAgreement;
