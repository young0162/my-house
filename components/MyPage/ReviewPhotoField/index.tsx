"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import { REVIEW_MAX_PHOTO_SIZE, REVIEW_ACCEPTED_PHOTO_TYPES } from "@/constants/myReview";
import type { ReviewPhoto } from "@/types/myReview";
import styles from "./ReviewPhotoField.module.scss";

interface ReviewPhotoFieldProps {
  photo: ReviewPhoto | null;
  onPhotoChange: (photo: ReviewPhoto | null) => void;
}

const ReviewPhotoField = ({ photo, onPhotoChange }: ReviewPhotoFieldProps) => {
  const [fileError, setFileError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!REVIEW_ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setFileError("JPG, PNG, WEBP 형식의 파일만 첨부할 수 있습니다.");
      e.target.value = "";
      return;
    }
    if (file.size > REVIEW_MAX_PHOTO_SIZE) {
      setFileError("10MB 이하의 파일만 첨부할 수 있습니다.");
      e.target.value = "";
      return;
    }

    if (photo?.previewUrl) URL.revokeObjectURL(photo.previewUrl);
    setFileError("");
    onPhotoChange({ file, previewUrl: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const handleDelete = () => {
    if (photo?.previewUrl) URL.revokeObjectURL(photo.previewUrl);
    onPhotoChange(null);
    setFileError("");
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text fontSize={15} fontWeight={700} color="gray01">사진 첨부 (선택)</Text>
        <Text fontSize={12} className={styles.desc}>사진을 첨부해주세요. (최대 1장)</Text>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={REVIEW_ACCEPTED_PHOTO_TYPES.join(",")}
        className={styles.hiddenInput}
        onChange={handleFileChange}
        aria-label="리뷰 사진 첨부"
      />

      {!photo ? (
        <button
          type="button"
          className={styles.uploadBtn}
          onClick={() => inputRef.current?.click()}
        >
          <span className={styles.uploadIcon}>
            <ImageIcon size={20} />
          </span>
          <Text fontSize={14} fontWeight={600} color="primary">사진 첨부하기</Text>
        </button>
      ) : (
        <div className={styles.preview}>
          <Image
            src={photo.previewUrl}
            alt="첨부 사진 미리보기"
            width={80}
            height={80}
            className={styles.previewImage}
          />
          <div className={styles.previewMeta}>
            <Text fontSize={13} color="gray01" className={styles.fileName}>{photo.file.name}</Text>
            <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
              <Text fontSize={13} className={styles.deleteTxt}>삭제</Text>
            </button>
          </div>
        </div>
      )}

      {fileError && <Text fontSize={12} className={styles.fileError}>{fileError}</Text>}
    </div>
  );
};

export default ReviewPhotoField;
