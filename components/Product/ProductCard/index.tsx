"use client";

import Image from "next/image";
import { useState } from "react";
import { HeartIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import { ProductCardProps } from "@/app/types/product";
import { formatPrice } from "@/app/utils/format";
import styles from "./ProductCard.module.scss";

const ProductCard = ({
  image,
  brand,
  name,
  discountRate,
  price,
  originalPrice,
  rating,
  reviewCount,
  isFreeShipping,
  badge,
  isLiked = false,
}: ProductCardProps) => {
  const [liked, setLiked] = useState(isLiked);

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image src={image} alt={name} fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.image} />
        {badge && (
          <Text tag="span" className={`${styles.badge} ${styles[`badge--${badge.toLowerCase()}`]}`}>
            {badge}
          </Text>
        )}
        <button
          type="button"
          className={`${styles.likeBtn} ${liked ? styles["likeBtn--active"] : ""}`}
          aria-label={liked ? "좋아요 취소" : "좋아요"}
          onClick={() => setLiked((prev) => !prev)}
        >
          <HeartIcon />
        </button>
      </div>

      <div className={styles.info}>
        <Text tag="span" className={styles.brand}>
          {brand}
        </Text>
        <Text tag="p" className={styles.name}>
          {name}
        </Text>

        <div className={styles.priceRow}>
          {discountRate && (
            <Text tag="span" className={styles.discountRate}>
              {discountRate}%
            </Text>
          )}
          <Text tag="span" className={styles.price}>
            {formatPrice(price)}원
          </Text>
        </div>

        {originalPrice && (
          <Text tag="span" className={styles.originalPrice}>
            {formatPrice(originalPrice)}원
          </Text>
        )}

        <div className={styles.meta}>
          {rating !== undefined && reviewCount !== undefined && (
            <Text tag="span" className={styles.rating}>
              ★ {rating?.toFixed(1)}
              <Text tag="span" className={styles.reviewCount}>
                {" "}
                ({reviewCount.toLocaleString()})
              </Text>
            </Text>
          )}
          {isFreeShipping && (
            <Text tag="span" className={styles.freeShipping}>
              무료배송
            </Text>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
