"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CameraIcon, ProfileSmileIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import { PROFILE_IMAGE_ACCEPTED_TYPES, PROFILE_IMAGE_MAX_SIZE } from "@/constants/memberSettings";
import styles from "./ProfileImageEditor.module.scss";

interface ProfileImageEditorProps {
  imageUrl: string | null;
  onFileChange: (file: File | null) => void;
}

const ProfileImageEditor = ({ imageUrl, onFileChange }: ProfileImageEditorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!PROFILE_IMAGE_ACCEPTED_TYPES.includes(file.type) || file.size > PROFILE_IMAGE_MAX_SIZE) {
      setError("JPG, PNG, WebP 형식의 10MB 이하 이미지를 선택해주세요.");
      event.target.value = "";
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
    onFileChange(file);
  };

  const displayedImage = previewUrl ?? imageUrl;

  return (
    <div className={styles.root}>
      <div className={styles.avatarWrap}>
        {displayedImage ? (
          <Image src={displayedImage} alt="프로필 이미지" width={92} height={92} className={styles.avatar} unoptimized={Boolean(previewUrl)} />
        ) : (
          <ProfileSmileIcon size={92} />
        )}
        <button type="button" className={styles.cameraButton} onClick={() => inputRef.current?.click()} aria-label="프로필 이미지 변경">
          <span className={styles.cameraVisual}><CameraIcon /></span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={PROFILE_IMAGE_ACCEPTED_TYPES.join(",")}
          className={styles.fileInput}
          onChange={handleChange}
        />
      </div>
      {error ? <Text tag="p" fontSize={12} color="gray01" className={styles.error}>{error}</Text> : null}
    </div>
  );
};

export default ProfileImageEditor;
