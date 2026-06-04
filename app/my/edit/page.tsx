"use client";

import { useEffect, useState } from "react";
import Text from "@/components/Common/Text";
import MemberProfileForm from "@/components/MyPage/MemberProfileForm";
import SettingsTabs from "@/components/MyPage/SettingsTabs";
import { DEFAULT_MEMBER_PROFILE } from "@/constants/memberSettings";
import type { MemberProfile, SettingsTab } from "@/types/memberSettings";
import styles from "./page.module.scss";

interface MeResponse {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

const EditPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("회원정보수정");
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/me");
        if (!response.ok) throw new Error("failed");
        const { user } = (await response.json()) as MeResponse;
        setProfile({
          ...DEFAULT_MEMBER_PROFILE,
          nickname: user.name ?? DEFAULT_MEMBER_PROFILE.nickname,
          email: user.email ?? DEFAULT_MEMBER_PROFILE.email,
          profileImageUrl: user.image,
          provider: user.email?.endsWith("@naver.com") ? "naver" : "credentials",
        });
      } catch {
        setProfile({ ...DEFAULT_MEMBER_PROFILE });
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, []);

  return (
    <div className={styles.root}>
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {activeTab !== "회원정보수정" ? (
          <div className={styles.placeholder}>
            <Text fontSize={15} color="gray01">{activeTab} 화면은 준비 중입니다.</Text>
          </div>
        ) : isLoading ? (
          <div className={styles.loading} aria-label="회원정보 불러오는 중">
            <div className={styles.skeletonAvatar} />
            {Array.from({ length: 5 }).map((_, index) => <div key={index} className={styles.skeletonLine} />)}
          </div>
        ) : profile ? (
          <MemberProfileForm profile={profile} onWithdrawClick={() => setActiveTab("회원 탈퇴")} />
        ) : null}
      </main>
    </div>
  );
};

export default EditPage;
