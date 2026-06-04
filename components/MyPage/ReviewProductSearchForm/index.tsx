import Text from "@/components/Common/Text";
import styles from "./index.module.scss";

interface ReviewProductSearchFormProps {
  onSearch: (query: string) => void;
}

const ReviewProductSearchForm = ({ onSearch }: ReviewProductSearchFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSearch(((fd.get("query") as string) ?? "").trim());
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="review-search" className={styles.srOnly}>
        상품 검색
      </label>
      <input
        id="review-search"
        name="query"
        type="search"
        className={styles.input}
        placeholder="브랜드명 혹은 상품명 입력"
        autoComplete="off"
      />
      <button type="submit" className={styles.btn}>
        <Text fontSize={14} fontWeight={600} color="white">
          검색
        </Text>
      </button>
    </form>
  );
};

export default ReviewProductSearchForm;
