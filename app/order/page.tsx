"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Text from "@/components/Common/Text";
import OrderDetailItem from "@/components/Order/OrderDetailItem";
import OrderDeliveryInfo from "@/components/Order/OrderDeliveryInfo";
import OrderPaymentInfo from "@/components/Order/OrderPaymentInfo";
import OrdererInfo from "@/components/Order/OrdererInfo";
import ReviewWriteModal from "@/components/MyPage/ReviewWriteModal";
import { orderApiService } from "@/services/order.api";
import { reviewApiService } from "@/services/review.api";
import type { OrderDetail, OrderDetailItem as OrderDetailItemType } from "@/types/order";
import type { ReviewDraft } from "@/types/myReview";
import styles from "./page.module.scss";

const OrderDetailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewItem, setReviewItem] = useState<OrderDetailItemType | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.push("/my/shopping");
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await orderApiService.getOrderDetail(orderId);
        setOrder(data);
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } }).response?.status;
        if (status === 401) router.push("/login");
        else router.push("/my/shopping");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  const handleReviewSubmit = async (draft: ReviewDraft) => {
    if (!reviewItem) return;
    try {
      await reviewApiService.createReview({
        orderItemId: reviewItem.id,
        rating: draft.rating,
        content: draft.content,
      });
      setReviewItem(null);
    } catch {
      alert("리뷰 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Text fontSize={14} className={styles.muted}>불러오는 중입니다.</Text>
      </div>
    );
  }

  if (!order) return null;

  const fullAddress = [
    order.zipCode ? `(${order.zipCode})` : null,
    order.address,
    order.detailAddress,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.root}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <Text fontSize={24} fontWeight={700} color="gray01">주문상세</Text>
        </h1>
        <Text fontSize={14} className={styles.muted}>
          {order.orderedAt} 주문 (주문번호 {order.id})
        </Text>
      </div>

      <OrderDeliveryInfo
        recipientName={order.recipientName}
        recipientPhone={order.recipientPhone}
        address={fullAddress}
        deliveryRequest={order.deliveryRequest}
      />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Text fontSize={17} fontWeight={700} color="gray01">주문상품</Text>
        </h2>
        <div className={styles.itemList}>
          {order.items.map((item) => (
            <OrderDetailItem
              key={item.id}
              item={item}
              status={order.status}
              deliveryInfo={order.deliveryInfo}
              shippingFee={order.shippingFee}
              onReview={() => setReviewItem(item)}
            />
          ))}
        </div>
      </section>

      <div className={styles.bottomGrid}>
        <OrderPaymentInfo
          totalProductPrice={order.totalProductPrice}
          shippingFee={order.shippingFee}
          couponDiscount={order.couponDiscount}
          pointDiscount={order.pointDiscount}
          finalPrice={order.finalPrice}
          paymentMethod={order.paymentMethod}
        />
        <OrdererInfo
          ordererName={order.ordererName}
          ordererPhone={order.ordererPhone}
          ordererEmail={order.ordererEmail}
        />
      </div>

      {reviewItem && (
        <ReviewWriteModal
          product={{
            id: String(reviewItem.id),
            brand: reviewItem.brandName,
            name: reviewItem.productName,
            option: reviewItem.optionLabel ?? "옵션 없음",
            point: 600,
            imageUrl: reviewItem.imageUrl,
            purchaseSource: "쇼핑",
          }}
          onClose={() => setReviewItem(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

const OrderPage = () => (
  <Suspense>
    <OrderDetailContent />
  </Suspense>
);

export default OrderPage;
