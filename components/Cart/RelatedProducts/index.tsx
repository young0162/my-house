import Image from "next/image";
import Link from "next/link";
import Text from "@/components/Common/Text";
import { ChevronRightIcon } from "@/components/Common/Icon";
import { formatPrice } from "@/app/utils/format";
import styles from "./RelatedProducts.module.scss";

interface RelatedProduct {
  id: number;
  image: string;
  brand: string;
  name: string;
  discountRate: number;
  price: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  tags: string[];
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => (
  <section className={styles.root}>
    <Text tag="h2" fontSize={16} fontWeight={700} color="gray01" className={styles.title}>
      다른 고객이 함께 구매한 상품
    </Text>
    <div className={styles.scroller}>
      <ul className={styles.list}>
        {products.map((product) => (
          <li key={product.id} className={styles.item}>
            <Link href={`/product/${product.id}`} className={styles.link}>
              <article className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="136px"
                    className={styles.image}
                  />
                  {product.badge && (
                    <Text tag="span" fontSize={11} fontWeight={700} className={styles.badge}>
                      {product.badge}
                    </Text>
                  )}
                </div>

                <div className={styles.info}>
                  <Text tag="span" fontSize={11} className={styles.brand}>
                    {product.brand}
                  </Text>
                  <Text tag="p" fontSize={12} className={styles.name}>
                    {product.name}
                  </Text>
                  <div className={styles.priceRow}>
                    <Text tag="span" fontSize={17} fontWeight={800} color="primary">
                      {product.discountRate}%
                    </Text>
                    <Text tag="strong" fontSize={17} fontWeight={800} color="gray01">
                      {formatPrice(product.price)}
                    </Text>
                  </div>
                  <Text tag="span" fontSize={11} fontWeight={700} color="primary" className={styles.rating}>
                    ★ {product.rating.toFixed(1)}
                    <Text tag="span" fontSize={11} className={styles.reviewCount}>
                      {" "}리뷰 {product.reviewCount.toLocaleString()}
                    </Text>
                  </Text>
                  <div className={styles.tags}>
                    {product.tags.map((tag) => (
                      <Text key={tag} tag="span" fontSize={10} className={styles.tag}>
                        {tag}
                      </Text>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" className={styles.nextButton} aria-label="추천상품 더보기">
        <ChevronRightIcon />
      </button>
    </div>
  </section>
);

export default RelatedProducts;
