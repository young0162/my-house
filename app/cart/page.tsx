"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import Text from "@/components/Common/Text";
import CartTabs from "@/components/Cart/CartTabs";
import CartSection from "@/components/Cart/CartSection";
import CartSummary from "@/components/Cart/CartSummary";
import { CartItemType, CartSectionType } from "@/types/cart";
import styles from "./page.module.scss";

const CartPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("cart");
  const [sections, setSections] = useState<CartSectionType[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const quantityTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const decrement = useCartStore((s) => s.decrement);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        setSections(data.sections);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [router]);

  const allItems = sections.flatMap((s) => s.items);
  const allChecked = allItems.length > 0 && allItems.every((item) => checkedIds.has(item.id));

  const handleCheckAll = () => {
    if (allChecked) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(allItems.map((item) => item.id)));
    }
  };

  const handleCheck = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
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
    decrement();
  };

  const handleDeleteSelected = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    const deletedCount = section?.items.filter((item) => checkedIds.has(item.id)).length ?? 0;

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
      section?.items.forEach((item) => next.delete(item.id));
      return next;
    });
    decrement(deletedCount);
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        items: s.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
      })),
    );

    const existing = quantityTimers.current.get(id);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: quantity }),
      });
      quantityTimers.current.delete(id);
    }, 300);

    quantityTimers.current.set(id, timer);
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

      <div className={styles.selectBar}>
        <label className={styles.selectAllLabel}>
          <input
            type="checkbox"
            className={styles.selectAllCheckbox}
            checked={allChecked}
            onChange={handleCheckAll}
            aria-label="전체 선택"
          />
          <Text tag="span" fontSize={14}>모두선택</Text>
        </label>
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          {isLoading ? (
            <div className={styles.empty}>
              <Text tag="p" fontSize={15} className={styles.emptyText}>
                불러오는 중...
              </Text>
            </div>
          ) : sections.length === 0 ? (
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
    </div>
  );
};

export default CartPage;
