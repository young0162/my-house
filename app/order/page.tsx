"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Text from "@/components/Common/Text";
import OrderDetailItem from "@/components/Order/OrderDetailItem";
import { orderApiService } from "@/services/order.api";
import type { OrderDetail } from "@/types/order";
import styles from "./page.module.scss";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  card: "신용카드",
  kakao: "카카오페이",
  toss: "토스페이",
  "ohouse-pay": "오늘의집 페이",
  "bank-transfer": "무통장입금",
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className={styles.infoRow}>
    <Text fontSize={14} className={styles.infoLabel}>{label}</Text>
    <Text fontSize={14} color="gray01">{value}</Text>
  </div>
);

const OrderDetailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Text fontSize={14} className={styles.muted}>불러오는 중입니다.</Text>
      </div>
    );
  }

  if (!order) return null;

  const fullAddress = [order.zipCode ? `(${order.zipCode})` : null, order.address, order.detailAddress]
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

      {/* 배송지정보 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Text fontSize={17} fontWeight={700} color="gray01">배송지정보</Text>
        </h2>
        <div className={styles.card}>
          <InfoRow label="받는 사람" value={order.recipientName} />
          <InfoRow label="연락처" value={order.recipientPhone} />
          <InfoRow label="주소" value={fullAddress} />
          {order.deliveryRequest && (
            <InfoRow label="배송 요청사항" value={order.deliveryRequest} />
          )}
        </div>
      </section>

      {/* 주문상품 */}
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
            />
          ))}
        </div>
      </section>

      {/* 결제정보 + 주문자정보 */}
      <div className={styles.bottomGrid}>
        <section className={styles.bottomSection}>
          <h2 className={styles.sectionTitle}>
            <Text fontSize={17} fontWeight={700} color="gray01">결제정보</Text>
          </h2>
          <div className={styles.card}>
            <div className={styles.paymentRow}>
              <Text fontSize={14} className={styles.muted}>상품금액</Text>
              <Text fontSize={14} color="gray01">{order.totalProductPrice.toLocaleString()}원</Text>
            </div>
            <div className={styles.paymentRow}>
              <Text fontSize={14} className={styles.muted}>배송비</Text>
              <Text fontSize={14} color="gray01">{order.shippingFee.toLocaleString()}원</Text>
            </div>
            {order.couponDiscount > 0 && (
              <div className={styles.paymentRow}>
                <Text fontSize={14} className={styles.muted}>쿠폰 할인</Text>
                <Text fontSize={14} color="gray01">-{order.couponDiscount.toLocaleString()}원</Text>
              </div>
            )}
            {order.pointDiscount > 0 && (
              <div className={styles.paymentRow}>
                <Text fontSize={14} className={styles.muted}>포인트 사용</Text>
                <Text fontSize={14} color="gray01">-{order.pointDiscount.toLocaleString()}원</Text>
              </div>
            )}
            <div className={styles.paymentDivider} />
            <div className={styles.paymentRow}>
              <Text fontSize={15} fontWeight={700} color="gray01">주문금액</Text>
              <Text fontSize={17} fontWeight={700} color="gray01">{order.finalPrice.toLocaleString()}원</Text>
            </div>
            <div className={styles.paymentRow}>
              <Text fontSize={14} className={styles.muted}>
                {PAYMENT_METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}
              </Text>
              <Text fontSize={14} color="gray01">{order.finalPrice.toLocaleString()}원</Text>
            </div>
          </div>
        </section>

        <section className={styles.bottomSection}>
          <h2 className={styles.sectionTitle}>
            <Text fontSize={17} fontWeight={700} color="gray01">주문자정보</Text>
          </h2>
          <div className={styles.ordererCard}>
            <div className={styles.ordererInfo}>
              <div className={styles.paymentRow}>
                <Text fontSize={14} className={styles.infoLabel}>주문자</Text>
                <Text fontSize={14} color="gray01">{order.ordererName}</Text>
              </div>
              <div className={styles.paymentRow}>
                <Text fontSize={14} className={styles.infoLabel}>연락처</Text>
                <Text fontSize={14} color="gray01">{order.ordererPhone}</Text>
              </div>
              <div className={styles.paymentRow}>
                <Text fontSize={14} className={styles.infoLabel}>이메일</Text>
                <Text fontSize={14} color="gray01">{order.ordererEmail}</Text>
              </div>
            </div>
            <div className={styles.customerService}>
              <Text fontSize={13} className={styles.muted}>오늘의집 고객센터 </Text>
              <Text fontSize={13} fontWeight={600} color="gray01">1670-0876</Text>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const OrderPage = () => (
  <Suspense>
    <OrderDetailContent />
  </Suspense>
);

export default OrderPage;
