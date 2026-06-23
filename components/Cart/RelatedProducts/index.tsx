import Text from "@/components/Common/Text";
import ProductCard from "@/components/Product/ProductCard";
import { ProductCardProps } from "@/app/types/product";
import styles from "./RelatedProducts.module.scss";

interface RelatedProductsProps {
  products: ProductCardProps[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => (
  <section className={styles.root}>
    <Text tag="h2" fontSize={16} fontWeight={700} color="gray01" className={styles.title}>
      다른 고객이 함께 구매한 상품
    </Text>
    <ul className={styles.list}>
      {products.map((product) => (
        <li key={product.id} className={styles.item}>
          <ProductCard {...product} />
        </li>
      ))}
    </ul>
  </section>
);

export default RelatedProducts;
