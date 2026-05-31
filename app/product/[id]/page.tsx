import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductImageGallery from "@/components/Product/ProductImageGallery";
import ProductInfoPanel from "@/components/Product/ProductInfoPanel";
import { MOCK_PRODUCT_DETAILS } from "@/constants/productDetail";
import styles from "./page.module.scss";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { id } = await params;
  const product = MOCK_PRODUCT_DETAILS.find((p) => p.id === Number(id));

  if (!product) notFound();

  return (
    <main className={styles.page}>
      <div className={styles.breadcrumbRow}>
        <Breadcrumb items={product.breadcrumb} />
      </div>

      <div className={styles.layout}>
        <ProductImageGallery
          images={product.images}
          name={product.name}
          onlyBadge={product.onlyBadge}
          pickBadge={product.pickBadge}
        />
        <ProductInfoPanel product={product} />
      </div>
    </main>
  );
};

export default ProductDetailPage;
