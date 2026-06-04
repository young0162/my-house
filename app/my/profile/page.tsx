"use client";

import { useState } from "react";
import ProfileActivityTabs from "@/components/MyPage/ProfileActivityTabs";
import ProfileSummaryCard from "@/components/MyPage/ProfileSummaryCard";
import ActivityDashboardLink from "@/components/MyPage/ActivityDashboardLink";
import LikedContentGrid from "@/components/MyPage/LikedContentGrid";
import { MOCK_PROFILE, MOCK_LIKED_CONTENTS } from "@/constants/mypage";
import type { ProfileActivityTab } from "@/types/mypage";
import styles from "./page.module.scss";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<ProfileActivityTab>("좋아요");

  const contents = activeTab === "좋아요" ? MOCK_LIKED_CONTENTS : [];

  return (
    <main className={styles.root}>
      <ProfileActivityTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={styles.container}>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <ProfileSummaryCard profile={MOCK_PROFILE} />
            <ActivityDashboardLink />
          </aside>
          <section className={styles.content} aria-labelledby="content-heading">
            <h2 id="content-heading" className={styles.srOnly}>
              {activeTab} 콘텐츠
            </h2>
            <LikedContentGrid contents={contents} />
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
