import ReviewableProductItem from "@/components/MyPage/ReviewableProductItem";
import Text from "@/components/Common/Text";
import type { ReviewableProduct } from "@/types/myReview";
import styles from "./index.module.scss";

interface ReviewableProductListProps {
  products: ReviewableProduct[];
  isSearched: boolean;
  onReviewClick: (id: string) => void;
}

const ReviewableProductList = ({ products, isSearched, onReviewClick }: ReviewableProductListProps) => {
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        {isSearched ? (
          <>
            <Text fontSize={15} color="gray01">검색 결과가 없습니다.</Text>
            <Text fontSize={13} color="gray01">브랜드명 또는 상품명을 다시 확인해보세요.</Text>
          </>
        ) : (
          <Text fontSize={15} color="gray01">리뷰를 작성할 수 있는 상품이 없습니다.</Text>
        )}
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {products.map((product) => (
        <li key={product.id} className={styles.listItem}>
          <ReviewableProductItem product={product} onReviewClick={onReviewClick} />
        </li>
      ))}
    </ul>
  );
};

export default ReviewableProductList;
