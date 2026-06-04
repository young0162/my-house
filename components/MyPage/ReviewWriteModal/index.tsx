"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import ReviewProductSummary from "@/components/MyPage/ReviewProductSummary";
import ReviewRatingField from "@/components/MyPage/ReviewRatingField";
import ReviewPhotoField from "@/components/MyPage/ReviewPhotoField";
import ReviewContentField from "@/components/MyPage/ReviewContentField";
import ReviewPolicyAgreement from "@/components/MyPage/ReviewPolicyAgreement";
import ReviewDiscardConfirm from "@/components/MyPage/ReviewDiscardConfirm";
import { REVIEW_MIN_LENGTH } from "@/constants/myReview";
import type { ReviewWriteModalProps, ReviewPhoto, ReviewDraftErrors } from "@/types/myReview";
import styles from "./ReviewWriteModal.module.scss";

const ReviewWriteModal = ({ product, onClose, onSubmit }: ReviewWriteModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [rating, setRating] = useState(0);
  const [photo, setPhoto] = useState<ReviewPhoto | null>(null);
  const [content, setContent] = useState("");
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [errors, setErrors] = useState<ReviewDraftErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstStarRef = useRef<HTMLButtonElement>(null);

  const isDirty = rating > 0 || photo !== null || content.trim().length > 0 || policyAgreed;

  useEffect(() => {
    setMounted(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      if (photo?.previewUrl) URL.revokeObjectURL(photo.previewUrl);
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      firstStarRef.current?.focus();
    }
  }, [mounted]);

  const handleClose = () => {
    if (isDirty) {
      setIsDiscarding(true);
    } else {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const trapFocus = (e: React.KeyboardEvent) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), textarea:not([disabled])"
      )
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
      return;
    }
    if (e.key === "Tab") {
      trapFocus(e);
    }
  };

  const validate = (): ReviewDraftErrors => {
    const errs: ReviewDraftErrors = {};
    if (rating === 0) errs.rating = "별점을 선택해주세요.";
    if (content.trim().length < REVIEW_MIN_LENGTH)
      errs.content = `후기는 최소 ${REVIEW_MIN_LENGTH}자 이상 작성해주세요.`;
    if (!policyAgreed) errs.policyAgreed = "리뷰 정책에 동의해주세요.";
    return errs;
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.rating) firstStarRef.current?.focus();
      return;
    }
    setIsSubmitting(true);
    onSubmit({ productId: product.id, rating, photo, content, policyAgreed });
  };

  const handlePhotoChange = (newPhoto: ReviewPhoto | null) => {
    setPhoto(newPhoto);
  };

  if (!mounted) return null;

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        onKeyDown={handleKeyDown}
      >
        <header className={styles.header}>
          <h2 id="review-modal-title" className={styles.headerTitle}>
            <Text fontSize={16} fontWeight={700} color="gray01">리뷰 남기기</Text>
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="모달 닫기"
          >
            <CloseIcon size={18} />
          </button>
        </header>

        <div className={styles.body}>
          <ReviewProductSummary product={product} />
          <ReviewRatingField
            rating={rating}
            onRatingChange={(r) => {
              setRating(r);
              if (errors.rating) setErrors((e) => ({ ...e, rating: undefined }));
            }}
            error={errors.rating}
            firstStarRef={firstStarRef}
          />
          <ReviewPhotoField photo={photo} onPhotoChange={handlePhotoChange} />
          <ReviewContentField
            content={content}
            onChange={(v) => {
              setContent(v);
              if (errors.content) setErrors((e) => ({ ...e, content: undefined }));
            }}
            error={errors.content}
          />
          <ReviewPolicyAgreement
            agreed={policyAgreed}
            onChange={(v) => {
              setPolicyAgreed(v);
              if (errors.policyAgreed) setErrors((e) => ({ ...e, policyAgreed: undefined }));
            }}
            error={errors.policyAgreed}
          />
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Text fontSize={16} fontWeight={700} color="white">
              {isSubmitting ? "저장 중" : "저장하기"}
            </Text>
          </button>
        </footer>

        {isDiscarding && (
          <ReviewDiscardConfirm
            onCancel={() => setIsDiscarding(false)}
            onConfirm={onClose}
          />
        )}
      </div>
    </div>,
    document.body
  );
};

export default ReviewWriteModal;
