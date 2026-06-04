import Image from "next/image";
import Link from "next/link";
import { ShareIcon, ProfilePlaceholderIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import ProfileStats from "@/components/MyPage/ProfileStats";
import type { ProfileSummary } from "@/types/mypage";
import styles from "./ProfileSummaryCard.module.scss";

interface ProfileSummaryCardProps {
  profile: ProfileSummary;
}

const ProfileSummaryCard = ({ profile }: ProfileSummaryCardProps) => (
  <div className={styles.card}>
    <div className={styles.body}>
      <div className={styles.shareRow}>
        <button type="button" className={styles.shareBtn} aria-label="프로필 공유">
          <ShareIcon />
        </button>
      </div>

      <div className={styles.avatarWrap}>
        {profile.profileImageUrl ? (
          <Image
            src={profile.profileImageUrl}
            alt={`${profile.nickname} 프로필 이미지`}
            width={128}
            height={128}
            className={styles.avatar}
          />
        ) : (
          <ProfilePlaceholderIcon size={128} />
        )}
      </div>

      <h1 className={styles.nicknameHeading} title={profile.nickname}>
        <Text fontSize={24} fontWeight={700} color="gray01" className={styles.nickname}>
          {profile.nickname}
        </Text>
      </h1>

      <div className={styles.followRow}>
        <div className={styles.followItem}>
          <Text fontSize={14} fontWeight={600} color="gray01">{profile.followerCount.toLocaleString()}</Text>
          <Text fontSize={13} color="gray01">팔로워</Text>
        </div>
        <span className={styles.followDivider} aria-hidden="true" />
        <div className={styles.followItem}>
          <Text fontSize={14} fontWeight={600} color="gray01">{profile.followingCount.toLocaleString()}</Text>
          <Text fontSize={13} color="gray01">팔로잉</Text>
        </div>
      </div>

      <Link href="/my/edit" className={styles.editBtn}>
        <Text fontSize={13} fontWeight={500} color="gray01">프로필 설정</Text>
      </Link>
    </div>

    <hr className={styles.divider} />

    <ProfileStats
      scrapbookCount={profile.scrapbookCount}
      likeCount={profile.likeCount}
      couponCount={profile.couponCount}
    />
  </div>
);

export default ProfileSummaryCard;
