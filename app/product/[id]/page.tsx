import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductImageGallery from "@/components/Product/ProductImageGallery";
import ProductInfoPanel from "@/components/Product/ProductInfoPanel";
import ProductDetailTabs from "@/components/Product/ProductDetailTabs";
import type { ProductDetail } from "@/app/types/productDetail";
import styles from "./page.module.scss";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { id } = await params;
  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: "no-store" });

  if (!res.ok) notFound();

  const product: ProductDetail = await res.json();

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
