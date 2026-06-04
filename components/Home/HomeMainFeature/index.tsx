import Image from "next/image";
import Link from "next/link";
import Text from "@/components/Common/Text";
import type { HomeMainFeatureItem } from "@/types/home";
import styles from "./index.module.scss";

const HomeMainFeature = ({ item }: { item: HomeMainFeatureItem }) => (
  <Link href={item.href} className={styles.root}>
    <Image src={item.imageUrl} alt={item.title} fill priority sizes="(max-width: 640px) 100vw, 75vw" className={styles.image} />
    <div className={styles.gradient} />
    <div className={styles.content}>
      <Text tag="h1" fontSize={32} fontWeight={700} color="white" lineHeight={1.35} className={styles.title}>{item.title}</Text>
      <div className={styles.author}>
        <Image src={item.authorImageUrl} alt="" width={28} height={28} className={styles.authorImage} />
        <Text fontSize={13} fontWeight={500} color="white">{item.author}</Text>
      </div>
    </div>
  </Link>
);

export default HomeMainFeature;
