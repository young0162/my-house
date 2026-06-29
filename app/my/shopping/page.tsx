"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Text from "@/components/Common/Text";
import ShoppingSubTabs from "@/components/MyPage/ShoppingSubTabs";
import StatsCard from "@/components/MyPage/StatsCard";
import ReferralCard from "@/components/MyPage/ReferralCard";
import OrderStatusSection from "@/components/MyPage/OrderStatusSection";
import OrderFilter from "@/components/MyPage/OrderFilter";
import ReviewPointBanner from "@/components/MyPage/ReviewPointBanner";
import OrderItem from "@/components/MyPage/OrderItem";
import { orderApiService } from "@/services/order.api";
import type { SubTab } from "@/types/mypage";
import type { ShoppingOrder, ShoppingOrdersResponse } from "@/types/order";
import styles from "./page.module.scss";

const ShoppingPage = () => {
  const router = useRouter();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("주문배송목록");
  const [orders, setOrders] = useState<ShoppingOrder[]>([]);
  const [summary, setSummary] = useState<ShoppingOrdersResponse["summary"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApiService.getShoppingOrders();
        setOrders(data.orders);
        setSummary(data.summary);
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } }).response?.status;
        if (status === 401) router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  return (
    <div className={styles.root}>
      <ShoppingSubTabs activeTab={activeSubTab} onTabChange={setActiveSubTab} />

      <div className={styles.content}>
        <StatsCard />
        <ReferralCard />
        <OrderStatusSection summary={summary} />

        <div className={styles.orderListSection}>
          <OrderFilter />
          <ReviewPointBanner />
          {isLoading ? (
            <div className={styles.stateMessage}>
              <Text tag="p" fontSize={14} color="gray01">주문내역을 불러오는 중입니다.</Text>
            </div>
          ) : orders.length === 0 ? (
            <div className={styles.stateMessage}>
              <Text tag="p" fontSize={14} color="gray01">주문내역이 없습니다.</Text>
            </div>
          ) : (
            orders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;
