import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductImageGallery from "@/components/Product/ProductImageGallery";
import ProductInfoPanel from "@/components/Product/ProductInfoPanel";
import ProductDetailTabs from "@/components/Product/ProductDetailTabs";
import { productDbService } from "@/services/product.db";
import styles from "./page.module.scss";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) notFound();

  const product = await productDbService.getProductDetail(productId);
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

      <ProductDetailTabs
        reviewCount={product.reviewCount}
        inquiryCount={product.inquiryCount}
      />
    </main>
  );
};

export default ProductDetailPage;
