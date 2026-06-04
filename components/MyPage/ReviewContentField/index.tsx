import Text from "@/components/Common/Text";
import { REVIEW_MAX_LENGTH, REVIEW_REWARD_LENGTH } from "@/constants/myReview";
import styles from "./index.module.scss";

interface ReviewContentFieldProps {
  content: string;
  onChange: (value: string) => void;
  error?: string;
}

const ReviewContentField = ({ content, onChange, error }: ReviewContentFieldProps) => (
  <div className={styles.root}>
    <div className={styles.header}>
      <Text fontSize={15} fontWeight={700} color="gray01">후기 작성</Text>
      <Text fontSize={12} className={styles.desc}>
        사진 올리고 {REVIEW_REWARD_LENGTH}자 이상 작성하면 총 600P 받아요
      </Text>
    </div>
    <div className={styles.textareaWrap}>
      <textarea
        className={`${styles.textarea} ${error ? styles.textareaError : ""}`}
        value={content}
        onChange={(e) => onChange(e.target.value.slice(0, REVIEW_MAX_LENGTH))}
        placeholder="다른 분들이 도움을 받을 수 있도록 상품 후기를 솔직하게 공유해주세요 (최소 20자 이상)"
        aria-label="후기 내용"
        />
      <Text fontSize={12} className={styles.counter}>
        {content.length} / {REVIEW_MAX_LENGTH}
      </Text>
    </div>
    {error && (
      <span id="content-error"><Text fontSize={12} className={styles.error}>{error}</Text></span>
    )}
  </div>
);

export default ReviewContentField;
