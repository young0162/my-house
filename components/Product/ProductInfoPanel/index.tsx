"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Text from "@/components/Common/Text";
import { ShareIcon, BookmarkIcon, StarIcon, ChevronRightIcon, InfoIcon } from "@/components/Common/Icon";
import { formatPrice } from "@/app/utils/format";
import { ProductDetail } from "@/app/types/productDetail";
import styles from "./ProductInfoPanel.module.scss";

interface ProductInfoPanelProps {
  product: ProductDetail;
}

const ProductInfoPanel = ({ product }: ProductInfoPanelProps) => {
  const router = useRouter();
  // key: option label, value: optionValueId
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [liked, setLiked] = useState(false);
  const [packageToggle, setPackageToggle] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const increment = useCartStore((s) => s.increment);

  const handleOptionChange = (label: string, optionValueId: number) => {
    setSelectedOptions((prev) => ({ ...prev, [label]: optionValueId }));
  };

  const allOptionsSelected =
    product.options.length > 0 &&
    product.options.every((o) => selectedOptions[o.label] !== undefined);

  const orderAmount = allOptionsSelected ? product.price : 0;

  const handleAddToCart = async () => {
    if (!allOptionsSelected || cartLoading) return;

    setCartLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          optionValueIds: Object.values(selectedOptions),
        }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        alert("장바구니 담기에 실패했습니다.");
        return;
      }

      increment();
      alert("장바구니에 담았습니다.");
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <section className={styles.panel}>
      {/* 상단 헤더: 브랜드명 + 공유/북마크 */}
      <div className={styles.header}>
        <Text tag="span" className={styles.brand}>
          {product.brand}
        </Text>
        <div className={styles.actions}>
          <button type="button" className={styles.actionBtn} aria-label="공유">
            <ShareIcon />
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${liked ? styles["actionBtn--liked"] : ""}`}
            aria-label={liked ? "좋아요 취소" : "좋아요"}
            onClick={() => setLiked((prev) => !prev)}
          >
            <BookmarkIcon />
            <Text tag="span" className={styles.likeCount}>
              {product.likeCount.toLocaleString()}
            </Text>
          </button>
        </div>
      </div>

      {/* 상품명 */}
      <Text tag="h1" className={styles.productName}>
        {product.name}
      </Text>

      {/* 별점 */}
      <div className={styles.ratingRow}>
        <span className={styles.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} filled={i < Math.round(product.rating)} />
          ))}
        </span>
        <Text tag="span" className={styles.reviewCount}>
          {product.reviewCount.toLocaleString()}개 리뷰
        </Text>
      </div>

      {/* 가격 */}
      <div className={styles.priceBlock}>
        <div className={styles.originalRow}>
          <Text tag="span" className={styles.discountRate}>
            {product.discountRate}%
          </Text>
          <Text tag="s" className={styles.originalPrice}>
            {formatPrice(product.originalPrice)}원
          </Text>
        </div>
        <div className={styles.finalRow}>
          <Text tag="strong" className={styles.finalPrice}>
            {formatPrice(product.price)}
          </Text>
          <Text tag="span" className={styles.finalPriceLabel}>
            원 무료 할인가
          </Text>
          <button type="button" className={styles.couponLink}>
            <Text tag="span">쿠폰 보기</Text>
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      {/* 쿠폰 배너 */}
      {product.couponBanner && (
        <button type="button" className={styles.couponBanner}>
          <Text tag="span" className={styles.couponBannerText}>
            {product.couponBanner}
          </Text>
          <ChevronRightIcon />
        </button>
      )}

      {/* 적립/배송 정보 */}
      <dl className={styles.infoList}>
        <div className={styles.infoRow}>
          <dt>
            <Text tag="span" className={styles.infoLabel}>
              적립
            </Text>
          </dt>
          <dd>
            <Text tag="span" className={styles.infoValue}>
              {product.savings.points}P 적립
            </Text>
            <Text tag="span" className={styles.infoSub}>
              (WELCOME {product.savings.welcomeRate}% 적립)
            </Text>
            <button type="button" className={styles.infoLink}>
              <Text tag="span">{product.savings.cardInfo}</Text>
              <ChevronRightIcon />
            </button>
          </dd>
        </div>

        <div className={styles.infoRow}>
          <dt>
            <Text tag="span" className={styles.infoLabel}>
              배송
            </Text>
          </dt>
          <dd>
            {product.shipping.price > 0 ? (
              <Text tag="strong" className={styles.shippingPrice}>
                1개당 {formatPrice(product.shipping.price)}원 적립
              </Text>
            ) : (
              <Text tag="strong" className={styles.shippingFree}>
                무료배송
              </Text>
            )}
            <Text tag="span" className={styles.infoValue}>
              {product.shipping.type}
            </Text>
            {product.shipping.notes.map((note, i) => (
              <Text key={i} tag="span" className={styles.infoNote}>
                {note}
              </Text>
            ))}
          </dd>
        </div>

        <div className={styles.infoRow}>
          <dt className={styles.infoLabelEmpty} />
          <dd className={styles.deliveryDate}>
            <Text tag="span" className={styles.infoValue}>
              {product.estimatedDelivery}
            </Text>
            <button type="button" className={styles.infoIconBtn} aria-label="배송 안내">
              <InfoIcon />
            </button>
          </dd>
        </div>
      </dl>

      <hr className={styles.divider} />

      {/* 브랜드 섹션 */}
      <div className={styles.brandRow}>
        <button type="button" className={styles.brandLink}>
          <span className={styles.brandIcon} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="7" width="18" height="14" rx="1" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 7V5a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <span className={styles.brandInfo}>
            <Text tag="span" className={styles.brandLinkText}>
              {product.brand}
            </Text>
            <ChevronRightIcon />
            <Text tag="span" className={styles.brandLinkSub}>
              브랜드
            </Text>
          </span>
        </button>
        <button type="button" className={styles.brandBookmark} aria-label="브랜드 즐겨찾기">
          <BookmarkIcon />
        </button>
      </div>

      {/* 옵션 선택 */}
      <div className={styles.options}>
        {product.options.map((option) => (
          <div key={option.label} className={styles.selectWrap}>
            <select
              className={styles.select}
              value={selectedOptions[option.label] ?? ""}
              onChange={(e) => handleOptionChange(option.label, Number(e.target.value))}
              aria-label={option.label}
            >
              <option value="" disabled>
                {option.label}
              </option>
              {option.values.map((val) => (
                <option key={val.id} value={val.id}>
                  {val.value}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow} aria-hidden="true">
              ▾
            </span>
          </div>
        ))}
      </div>

      {/* 주문금액 */}
      <div className={styles.orderAmountRow}>
        <Text tag="span" className={styles.orderAmountLabel}>
          주문금액
        </Text>
        <Text tag="strong" className={styles.orderAmountValue}>
          {formatPrice(orderAmount)}원
        </Text>
      </div>

      {/* 쿠폰 받기 */}
      <div className={styles.couponReceiveBox}>
        <Text tag="span" className={styles.couponReceiveText}>
          받지 않은 쿠폰이 더 있어요
        </Text>
        <button type="button" className={styles.couponReceiveBtn}>
          <Text tag="span">쿠폰 받기</Text>
          <Text tag="span" className={styles.couponReceiveIcon}>
            ↓
          </Text>
        </button>
      </div>

      {/* 패키지 토글 */}
      <div className={styles.packageBox}>
        <div className={styles.packageBoxLeft}>
          <Text tag="span" className={styles.packageBoxText}>
            패키지 담기시, 장바구니에 함께 담기
          </Text>
          <Link href="/login" className={styles.packageBoxLink}>
            <Text tag="span">로그인하고 사용하기</Text>
          </Link>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={packageToggle}
          className={`${styles.toggle} ${packageToggle ? styles["toggle--on"] : ""}`}
          onClick={() => setPackageToggle((prev) => !prev)}
          aria-label="패키지 함께 담기"
        >
          <span className={styles.toggleThumb} />
        </button>
      </div>

      {/* 구매 버튼 */}
      <div className={styles.buyButtons}>
        <button type="button" className={styles.btnPackage}>
          <span className={styles.btnPackageIcon} aria-hidden="true">📦</span>
          <Text tag="span">패키지 담기</Text>
        </button>
        <button
          type="button"
          className={styles.btnCart}
          onClick={handleAddToCart}
          disabled={!allOptionsSelected || cartLoading}
        >
          <Text tag="span">{cartLoading ? "담는 중..." : "장바구니"}</Text>
        </button>
        <button type="button" className={styles.btnBuy}>
          <Text tag="span">바로구매</Text>
        </button>
      </div>

      {/* 하단 배너 */}
      <div className={styles.bottomBanner}>
        <Text tag="span" className={styles.bottomBannerText}>
          기다릴 필요 없어요,{" "}
          <Text tag="strong" className={styles.bottomBannerHighlight}>
            선공개 특가 ~84%
          </Text>{" "}
          &gt;
        </Text>
        <Text tag="strong" className={styles.bottomBannerBrand}>
          짐요한세일
        </Text>
      </div>
    </section>
  );
};

export default ProductInfoPanel;
