import Text from "@/components/Common/Text";
import styles from "./ReviewDiscardConfirm.module.scss";

interface ReviewDiscardConfirmProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const ReviewDiscardConfirm = ({ onCancel, onConfirm }: ReviewDiscardConfirmProps) => (
  <div className={styles.overlay} role="alertdialog" aria-modal="true" aria-label="작성 중인 리뷰를 닫을까요?">
    <div className={styles.box}>
      <Text tag="h3" fontSize={16} fontWeight={700} color="gray01" className={styles.title}>
        작성 중인 리뷰를 닫을까요?
      </Text>
      <Text fontSize={14} className={styles.desc}>작성한 내용이 모두 삭제됩니다.</Text>
      <div className={styles.buttons}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          <Text fontSize={15} fontWeight={600} color="gray01">계속 작성</Text>
        </button>
        <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
          <Text fontSize={15} fontWeight={600} color="white">나가기</Text>
        </button>
      </div>
    </div>
  </div>
);

export default ReviewDiscardConfirm;
