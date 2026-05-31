"use client";

import { useState } from "react";
import Image from "next/image";
import Text from "@/components/Common/Text";
import styles from "./index.module.scss";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  onlyBadge?: boolean;
  pickBadge?: boolean;
}

const ProductImageGallery = ({ images, name, onlyBadge, pickBadge }: ProductImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.gallery}>
      <ul className={styles.thumbnails}>
        {images.map((src, i) => (
          <li key={i} className={`${styles.thumbnail} ${i === activeIndex ? styles["thumbnail--active"] : ""}`}>
            <button type="button" onClick={() => setActiveIndex(i)} aria-label={`이미지 ${i + 1}`}>
              <Image src={src} alt={`${name} 썸네일 ${i + 1}`} width={64} height={64} />
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.mainWrap}>
        <Image
          src={images[activeIndex]}
          alt={name}
          fill
          sizes="(max-width: 1024px) 50vw, 500px"
          className={styles.mainImage}
        />
        {onlyBadge && (
          <Text tag="span" className={styles.badgeOnly}>
            Only
          </Text>
        )}
        {pickBadge && (
          <div className={styles.badgePick}>
            <Text tag="span" className={styles.badgePickLabel}>
              오늘의집
            </Text>
            <Text tag="strong" className={styles.badgePickStrong}>
              pick
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;
