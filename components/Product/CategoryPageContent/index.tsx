"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Divider from "@/components/Common/Divider";
import NavBar from "@/components/Common/NavBar";
import Text from "@/components/Common/Text";
import CategoryList from "@/components/Product/CategoryList";
import FilterBar from "@/components/Product/FilterBar";
import MdPick from "@/components/Product/MdPick";
import ProductCard from "@/components/Product/ProductCard";
import SortDropdown from "@/components/Product/SortDropdown";
import type { CategoryTreeResult } from "@/app/types/category";
import type { ProductCardProps, SortOption } from "@/app/types/product";
import styles from "@/app/store/category/page.module.scss";

interface CategoryPageContentProps {
  categoryTree: CategoryTreeResult;
}

const CategoryPageContent = ({ categoryTree }: CategoryPageContentProps) => {
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const breadcrumbItems = categoryTree.selectedPath.map((category) => ({
    label: category.label,
    href: `/store/category?category_id=${category.id}`,
  }));

  useEffect(() => {
    fetch(`/api/products?sortBy=${sortBy}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [sortBy]);

  return (
    <>
      <NavBar activeHref="/store/category" />
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.layout}>
            <CategoryList
              key={categoryTree.activeCategoryId}
              groups={categoryTree.groups}
              selectedPath={categoryTree.selectedPath}
            />

            <div className={styles.content}>
              <div className={styles.breadcrumbRow}>
                <Breadcrumb items={breadcrumbItems} />
              </div>

              <Divider height={25} />
              <MdPick />

              <Divider height={30} />
              <FilterBar />

              <Divider height={30} />
              <div className={styles.toolbar}>
                <Text tag="span" className={styles.totalCount}>
                  전체 {products.length}개
                </Text>
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>

              <ul className={styles.grid}>
                {products.map((product) => (
                  <li key={product.id}>
                    <ProductCard {...product} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPageContent;
