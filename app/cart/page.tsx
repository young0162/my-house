"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import Text from "@/components/Common/Text";
import CartTabs from "@/components/Cart/CartTabs";
import CartSection from "@/components/Cart/CartSection";
import CartSummary from "@/components/Cart/CartSummary";
import RelatedProducts from "@/components/Cart/RelatedProducts";
import CartOptionModal from "@/components/Cart/CartOptionModal";
import { CartItemType, CartSectionType } from "@/types/cart";
import { cartApiService } from "@/services/cart.api";
import { checkoutApiService } from "@/services/checkout.api";
import { buildCartOptionLabel } from "@/app/utils/cartOption";
import styles from "./page.module.scss";

const RELATED_PRODUCTS = [
  {
    id: 1,
    image: "/image/products/bed-low-hudo-nareun.webp",
    brand: "휴도",
    name: "베송일 직전선택/무료설치 포함한 제주 25cm 본넬스프링 매트리스 S...",
    discountRate: 66,
    price: 109000,
    rating: 4.7,
    reviewCount: 30276,
    badge: "Only",
    tags: ["배송비 별도", "특가"],
  },
  {
    id: 2,
    image: "/image/products/bed-normal-crown-edit.webp",
    brand: "쎌리",
    name: "[오늘의집 단독] 사르레 매트리스 24cm 미디어하드",
    discountRate: 40,
    price: 479400,
    rating: 4.8,
    reviewCount: 475,
    badge: "Only",
    tags: ["무료배송", "특가"],
  },
  {
    id: 3,
    image: "/image/products/v1-282659061329984.png",
    brand: "마켓비",
    name: "OLIVER 스툴",
    discountRate: 43,
    price: 16900,
    rating: 4.7,
    reviewCount: 12047,
    tags: ["조립무료배송", "특가"],
  },
  {
    id: 4,
    image: "/image/products/bed-storage-crown-noel.webp",
    brand: "쎌리",
    name: "베루스 + 템바 + N9007 패브릭 침대",
    discountRate: 20,
    price: 3816000,
    rating: 4.7,
    reviewCount: 3,
    tags: ["무료배송"],
  },
  {
    id: 5,
    image: "/image/products/v1-301403856232512.jpg",
    brand: "홈앤힐",
    name: "의자 3+1, 세라믹 철제 테이블 세트",
    discountRate: 44,
    price: 129000,
    rating: 4.8,
    reviewCount: 128,
    tags: ["배송비 별도"],
  },
];

const CartPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("cart");
  const [sections, setSections] = useState<CartSectionType[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItemType | null>(null);
  const [isOptionSubmitting, setIsOptionSubmitting] = useState(false);
  const quantityTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const decrement = useCartStore((s) => s.decrement);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await cartApiService.getCart();
        setSections(data.sections);
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } }).response?.status;
        if (status === 401) router.push("/login");
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
    cartApiService.removeItem(id).catch(() => {});
  };

  const handleDeleteAllSelected = () => {
    const deletedCount = checkedIds.size;
    if (deletedCount === 0) return;

    setSections((prev) =>
      prev
        .map((s) => ({ ...s, items: s.items.filter((item) => !checkedIds.has(item.id)) }))
        .filter((s) => s.items.length > 0),
    );
    setCheckedIds(new Set());
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
      cartApiService.updateCount(id, { count: quantity }).catch(() => {});
      quantityTimers.current.delete(id);
    }, 300);

    quantityTimers.current.set(id, timer);
  };

  const handleCheckout = async () => {
    if (checkedIds.size === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = await checkoutApiService.create({
        source: "CART",
        cartIds: Array.from(checkedIds),
      });
      router.push(data.redirectUrl);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 401) {
        router.push("/login");
        return;
      }
      alert("주문서 생성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmOptionChange = async (
    item: CartItemType,
    optionValueIds: number[],
    quantity: number,
  ) => {
    if (isOptionSubmitting) return;

    setIsOptionSubmitting(true);
    try {
      await cartApiService.updateOptions(item.id, { optionValueIds });
      if (quantity !== item.quantity) {
        await cartApiService.updateCount(item.id, { count: quantity });
      }

      const selectedIds = new Set(optionValueIds);
      const optionLabel = buildCartOptionLabel(
        item.options.flatMap((option) => {
          const selected = option.values.find((value) => selectedIds.has(value.id));
          return selected ? [{ typeName: option.label, value: selected.value }] : [];
        }),
      );

      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          items: section.items.map((cartItem) =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  optionLabel,
                  selectedOptionValueIds: optionValueIds,
                  quantity,
                }
              : cartItem,
          ),
        })),
      );
      setEditingItem(null);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 401) {
        router.push("/login");
        return;
      }
      alert("옵션 변경에 실패했습니다.");
    } finally {
      setIsOptionSubmitting(false);
    }
  };

  const handleBuy = async (cartId: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const data = await checkoutApiService.create({ source: "CART", cartIds: [cartId] });
      router.push(data.redirectUrl);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 401) {
        router.push("/login");
        return;
      }
      alert("주문서 생성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = allItems
    .filter((item: CartItemType) => checkedIds.has(item.id))
    .reduce((sum: number, item: CartItemType) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles.root}>
      <CartTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={styles.benefitPanels}>
            <section className={styles.couponPanel}>
              <Text tag="strong" fontSize={14} fontWeight={700} color="gray01">
                받을 수 있는 쿠폰 <Text tag="span" fontSize={14} fontWeight={700} color="primary">1</Text>
              </Text>
              <button type="button" className={styles.couponButton}>
                <Text tag="span" fontSize={13} fontWeight={600} color="gray01">모두받기</Text>
              </button>
            </section>

            <section className={styles.packagePanel}>
              <Text tag="strong" fontSize={14} fontWeight={700} color="gray01">
                패키지할인 가능 상품 <Text tag="span" fontSize={14} fontWeight={700} color="primary">{sections.length}</Text>
              </Text>
              <div className={styles.packagePreview} aria-hidden="true">
                {allItems.slice(0, 2).map((item) => (
                  <span key={item.id} className={styles.previewImage} style={{ backgroundImage: `url(${item.image})` }} />
                ))}
              </div>
              <Text tag="span" fontSize={20} className={styles.chevron}>⌄</Text>
            </section>
          </div>

          <div className={styles.selectBar}>
            <label className={styles.selectAllLabel}>
              <input
                type="checkbox"
                className={styles.selectAllCheckbox}
                checked={allChecked}
                onChange={handleCheckAll}
                aria-label="전체 선택"
              />
              <Text tag="span" fontSize={14} fontWeight={500}>모두선택</Text>
            </label>
            <button
              type="button"
              className={styles.selectDeleteButton}
              onClick={handleDeleteAllSelected}
            >
              <Text tag="span" fontSize={13} color="gray01">선택삭제</Text>
            </button>
          </div>

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
                onOptionChange={setEditingItem}
                onBuy={handleBuy}
              />
            ))
          )}

          <RelatedProducts products={RELATED_PRODUCTS} />
        </div>

        <div className={styles.sidebar}>
          <CartSummary
            totalPrice={totalPrice}
            checkedCount={checkedIds.size}
            onCheckout={handleCheckout}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {editingItem && (
        <CartOptionModal
          key={editingItem.id}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onConfirm={handleConfirmOptionChange}
          isSubmitting={isOptionSubmitting}
        />
      )}
    </div>
  );
};

export default CartPage;
