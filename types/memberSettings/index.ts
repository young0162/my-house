import { GENDER_OPTIONS, SETTINGS_TABS } from "@/constants/memberSettings";

export type SettingsTab = (typeof SETTINGS_TABS)[number];
export type Gender = (typeof GENDER_OPTIONS)[number]["value"];

export interface MemberProfile {
  nickname: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  profileImageUrl: string | null;
  provider: "credentials" | "naver";
}

export interface MemberProfileFormValue extends MemberProfile {
  profileImageFile: File | null;
}

export interface MemberProfileFormErrors {
  nickname?: string;
  birthDate?: string;
  profileImage?: string;
}

export interface ProfileImagePreview {
  file: File;
  url: string;
}
