"use client";

import { useState } from "react";
import Text from "@/components/Common/Text";
import CartTabs from "@/components/Cart/CartTabs";
import CartSection from "@/components/Cart/CartSection";
import CartSummary from "@/components/Cart/CartSummary";
import RelatedProducts from "@/components/Cart/RelatedProducts";
import { CartItemType, CartSectionType } from "@/types/cart";
import { ProductCardProps } from "@/app/types/product";
import styles from "./page.module.scss";

const INITIAL_SECTIONS: CartSectionType[] = [
  {
    id: "section-1",
    label: "먼데이하우스",
    count: 1,
    items: [
      {
        id: 1,
        productId: 55,
        image: "/image/products/v1-475571330867328.jpg",
        brand: "먼데이하우스",
        name: "[지정일배송/무료설치] 허리가 편안한 호텔식 포켓스프링 매트리스 25cm S/SS/Q/K/LK",
        optionLabel: "사이즈: 슈퍼싱글(SS)",
        price: 88000,
        quantity: 1,
        isFreeShipping: false,
        deliveryDate: "7/1(화) 아직 오직 예정 ⓘ",
        deliveryMethod: "무료배송 · 입점지업체발송",
      },
    ],
  },
  {
    id: "section-2",
    label: "웰퍼니쳐",
    count: 1,
    items: [
      {
        id: 2,
        productId: 57,
        image: "/image/products/v1-513989743964160.jpg",
        brand: "웰퍼니쳐",
        name: "[기존매트 무료내림] 더매직 허리부담완화 포켓스프링 매트리스 S/SS/Q/K/LK",
        optionLabel: "사이즈: 퀸(Q)",
        price: 259000,
        quantity: 1,
        isFreeShipping: true,
        deliveryDate: "7/3(목) 아직 오직 예정 ⓘ",
        deliveryMethod: "무료배송 · 직접배송",
      },
    ],
  },
];

const RELATED_PRODUCTS: ProductCardProps[] = [
  {
    id: 56,
    image: "/image/products/v1-467702177099904.jpg",
    brand: "오늘의집 layer",
    name: "[무료내림서비스] basic 바른 숙면 매트리스 본넬/포켓스프링 S/SS/D/Q",
    price: 109900,
    originalPrice: 164900,
    isFreeShipping: true,
    badge: undefined,
  },
  {
    id: 58,
    image: "/image/products/v1-452793387057216.jpg",
    brand: "지누스",
    name: "[오늘의집 단독] 얼티마 하이브리드 스프링 침대 매트리스 25cm S/SS/Q/K",
    price: 199000,
    originalPrice: 398000,
    isFreeShipping: true,
    badge: "NEW",
  },
  {
    id: 59,
    image: "/image/products/v1-400167365611584.jpg",
    brand: "삼익가구",
    name: "[오늘의집 단독] 프라임 유로탑 독립스프링 롤팩 매트리스 S/SS/Q",
    price: 149000,
    originalPrice: 218000,
    isFreeShipping: true,
    badge: undefined,
  },
  {
    id: 55,
    image: "/image/products/v1-475571330867328.jpg",
    brand: "먼데이하우스",
    name: "[지정일배송/무료설치] 허리가 편안한 호텔식 포켓스프링 매트리스 25cm",
    price: 88000,
    originalPrice: 108000,
    badge: "BEST",
  },
  {
    id: 57,
    image: "/image/products/v1-513989743964160.jpg",
    brand: "웰퍼니쳐",
    name: "[기존매트 무료내림] 더매직 허리부담완화 포켓스프링 매트리스 S/SS/Q/K/LK",
    price: 259000,
    originalPrice: 400000,
    isFreeShipping: true,
    badge: "BEST",
  },
];

const CartPage = () => {
  const [activeTab, setActiveTab] = useState("cart");
  const [sections, setSections] = useState<CartSectionType[]>(INITIAL_SECTIONS);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

  const allItems = sections.flatMap((s) => s.items);

  const handleCheck = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCheckAll = (sectionId: string, ids: number[]) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const allChecked = ids.every((id) => checkedIds.has(id));
    setCheckedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (allChecked ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const handleRemove = (id: number) => {
    setSections((prev) =>
      prev
        .map((s) => ({ ...s, items: s.items.filter((item) => item.id !== id) }))
        .filter((s) => s.items.length > 0),
    );
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleDeleteSelected = (sectionId: string) => {
    setSections((prev) =>
      prev
        .map((s) =>
          s.id === sectionId
            ? { ...s, items: s.items.filter((item) => !checkedIds.has(item.id)) }
            : s,
        )
        .filter((s) => s.items.length > 0),
    );
    setCheckedIds((prev) => {
      const next = new Set(prev);
      sections
        .find((s) => s.id === sectionId)
        ?.items.forEach((item) => next.delete(item.id));
      return next;
    });
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        items: s.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
      })),
    );
  };

  const totalPrice = allItems
    .filter((item: CartItemType) => checkedIds.has(item.id))
    .reduce((sum: number, item: CartItemType) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles.root}>
      <Text tag="h1" fontSize={22} fontWeight={700} color="gray01" className={styles.pageTitle}>
        장바구니
      </Text>

      <CartTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.layout}>
        <div className={styles.main}>
          {sections.length === 0 ? (
            <div className={styles.empty}>
              <Text tag="p" fontSize={15} className={styles.emptyText}>
                장바구니에 담긴 상품이 없습니다.
              </Text>
            </div>
          ) : (
            sections.map((section) => (
              <CartSection
                key={section.id}
                section={section}
                checkedIds={checkedIds}
                onCheck={handleCheck}
                onCheckAll={handleCheckAll}
                onRemove={handleRemove}
                onQuantityChange={handleQuantityChange}
                onDeleteSelected={handleDeleteSelected}
              />
            ))
          )}
        </div>

        <div className={styles.sidebar}>
          <CartSummary totalPrice={totalPrice} checkedCount={checkedIds.size} />
        </div>
      </div>

      <RelatedProducts products={RELATED_PRODUCTS} />
    </div>
  );
};

export default CartPage;
