import Image from "next/image";
import Link from "next/link";
import Text from "@/components/Common/Text";
import type { LikedContent } from "@/types/mypage";
import styles from "./index.module.scss";

interface LikedContentCardProps {
  content: LikedContent;
}

const CardInner = ({ content }: { content: LikedContent }) => (
  <div className={styles.thumbnailWrap}>
    <Image
      src={content.thumbnailUrl}
      alt={content.title}
      fill
      sizes="(max-width: 640px) calc(50vw - 24px), 256px"
      className={styles.thumbnail}
    />
    <span className={styles.badge}>
      <Text fontSize={12} color="white">{content.type}</Text>
    </span>
    <div className={styles.overlay} aria-hidden="true" />
  </div>
);

const LikedContentCard = ({ content }: LikedContentCardProps) => {
  if (content.href) {
    return (
      <Link href={content.href} className={styles.card} aria-label={`${content.title} 상세보기`}>
        <CardInner content={content} />
      </Link>
    );
  }
  return (
    <article className={styles.card}>
      <CardInner content={content} />
    </article>
  );
};

export default LikedContentCard;
