"use client";

import { ChangeEvent, useState } from "react";
import { ChevronRightIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import GenderField from "@/components/MyPage/GenderField";
import PhoneNumberField from "@/components/MyPage/PhoneNumberField";
import ProfileImageEditor from "@/components/MyPage/ProfileImageEditor";
import SettingsTextField from "@/components/MyPage/SettingsTextField";
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH } from "@/constants/memberSettings";
import type { MemberProfile, MemberProfileFormErrors, MemberProfileFormValue } from "@/types/memberSettings";
import styles from "./MemberProfileForm.module.scss";

interface MemberProfileFormProps {
  profile: MemberProfile;
  onWithdrawClick: () => void;
}

const formatBirthDate = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
};

const validateBirthDate = (value: string) => {
  if (!value) return "";
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(value)) return "생년월일을 YYYY.MM.DD 형식으로 입력해주세요.";

  const [year, month, day] = value.split(".").map(Number);
  const date = new Date(year, month - 1, day);
  const isValid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  if (!isValid || date > new Date()) return "올바른 생년월일을 입력해주세요.";
  return "";
};

const MemberProfileForm = ({ profile, onWithdrawClick }: MemberProfileFormProps) => {
  const [values, setValues] = useState<MemberProfileFormValue>({ ...profile, profileImageFile: null });
  const [errors, setErrors] = useState<MemberProfileFormErrors>({});

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nickname = event.target.value;
    setValues((current) => ({ ...current, nickname }));

    const trimmed = nickname.trim();
    setErrors((current) => ({
      ...current,
      nickname:
        trimmed.length === 0
          ? "닉네임을 입력해주세요."
          : trimmed.length < NICKNAME_MIN_LENGTH
            ? `닉네임은 ${NICKNAME_MIN_LENGTH}자 이상 입력해주세요.`
            : "",
    }));
  };

  const handleBirthDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const birthDate = formatBirthDate(event.target.value);
    setValues((current) => ({ ...current, birthDate }));
    setErrors((current) => ({ ...current, birthDate: validateBirthDate(birthDate) }));
  };

  const handleSubmit = () => {
    const trimmedNickname = values.nickname.trim();
    setErrors({
      nickname:
        trimmedNickname.length === 0
          ? "닉네임을 입력해주세요."
          : trimmedNickname.length < NICKNAME_MIN_LENGTH
            ? `닉네임은 ${NICKNAME_MIN_LENGTH}자 이상 입력해주세요.`
            : "",
      birthDate: validateBirthDate(values.birthDate),
    });
  };

  return (
    <form
      className={styles.form}
      aria-label="회원정보 수정"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <ProfileImageEditor
        imageUrl={values.profileImageUrl}
        onFileChange={(profileImageFile) => setValues((current) => ({ ...current, profileImageFile }))}
      />

      <button type="button" className={styles.personalizedButton}>
        <Text fontSize={15} fontWeight={600} color="gray01">맞춤정보 설정</Text>
        <ChevronRightIcon />
      </button>

      <div className={styles.fields}>
        <SettingsTextField
          id="nickname"
          label="닉네임"
          required
          value={values.nickname}
          onChange={handleNicknameChange}
          error={errors.nickname}
          maxLength={NICKNAME_MAX_LENGTH}
          autoComplete="nickname"
        />

        <SettingsTextField
          id="email"
          label="이메일"
          required
          value={values.email}
          readOnly
          type="email"
          autoComplete="email"
          helperText={values.provider === "naver" ? "네이버로 가입한 계정이에요." : "이메일로 가입한 계정이에요."}
        />

        <hr className={styles.divider} />

        <PhoneNumberField value={values.phone} onChangeClick={() => {}} />

        <SettingsTextField
          id="birthDate"
          label="생년월일"
          value={values.birthDate}
          onChange={handleBirthDateChange}
          error={errors.birthDate}
          placeholder="생년월일을 선택해주세요."
          inputMode="numeric"
          autoComplete="bday"
          maxLength={10}
        />

        <GenderField
          value={values.gender}
          onChange={(gender) => setValues((current) => ({ ...current, gender }))}
        />

        <hr className={styles.bottomDivider} />

        <button type="button" className={styles.withdrawButton} onClick={onWithdrawClick}>
          <Text fontSize={14} fontWeight={500} color="gray01">탈퇴하기</Text>
          <ChevronRightIcon />
        </button>

        <button type="submit" className={styles.completeButton}>
          <Text fontSize={15} fontWeight={700} color="white">완료</Text>
        </button>
      </div>
    </form>
  );
};

export default MemberProfileForm;
