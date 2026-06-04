import { BookmarkIcon, HeartIcon, CouponIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import styles from "./index.module.scss";

interface ProfileStatsProps {
  scrapbookCount: number;
  likeCount: number;
  couponCount: number;
}

const ProfileStats = ({ scrapbookCount, likeCount, couponCount }: ProfileStatsProps) => {
  const items = [
    { icon: <BookmarkIcon />, label: "스크랩북", count: scrapbookCount },
    { icon: <HeartIcon />, label: "좋아요", count: likeCount },
    { icon: <CouponIcon />, label: "내 쿠폰", count: couponCount },
  ];

  return (
    <div className={styles.root}>
      {items.map(({ icon, label, count }) => (
        <div key={label} className={styles.item}>
          <span className={styles.icon} aria-hidden="true">{icon}</span>
          <Text fontSize={13} color="gray01">{label}</Text>
          <Text fontSize={15} fontWeight={700} color="gray01">{count.toLocaleString()}</Text>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
