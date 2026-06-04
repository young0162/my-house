export const SETTINGS_TABS = ["회원정보수정", "비밀번호 변경", "회원 탈퇴"] as const;

export const GENDER_OPTIONS = [
  { label: "남성", value: "male" },
  { label: "여성", value: "female" },
  { label: "선택하지 않음", value: "none" },
] as const;

export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 20;
export const PROFILE_IMAGE_MAX_SIZE = 10 * 1024 * 1024;
export const PROFILE_IMAGE_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const DEFAULT_MEMBER_PROFILE = {
  nickname: "그럼그럴수있지",
  email: "wkdhehdd3@naver.com",
  phone: "01038250313",
  birthDate: "",
  gender: "none",
  profileImageUrl: null,
  provider: "naver",
} as const;
