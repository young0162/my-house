import LikedContentCard from "@/components/MyPage/LikedContentCard";
import Text from "@/components/Common/Text";
import type { LikedContent } from "@/types/mypage";
import styles from "./index.module.scss";

interface LikedContentGridProps {
  contents: LikedContent[];
}

const LikedContentGrid = ({ contents }: LikedContentGridProps) => {
  if (contents.length === 0) {
    return (
      <div className={styles.empty}>
        <Text fontSize={15} color="gray01">좋아요한 콘텐츠가 없습니다.</Text>
        <Text fontSize={13} color="gray01">마음에 드는 콘텐츠에 좋아요를 눌러보세요.</Text>
      </div>
    );
  }

  return (
    <ul className={styles.grid}>
      {contents.map((content) => (
        <li key={content.id}>
          <LikedContentCard content={content} />
        </li>
      ))}
    </ul>
  );
};

export default LikedContentGrid;
