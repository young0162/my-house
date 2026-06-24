"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Text from "@/components/Common/Text";
import ShippingAddress from "@/components/Checkout/ShippingAddress";
import OrdererForm from "@/components/Checkout/OrdererForm";
import OrderItems from "@/components/Checkout/OrderItems";
import PaymentSummary from "@/components/Checkout/PaymentSummary";
import CheckoutCoupon from "@/components/Checkout/CheckoutCoupon";
import CheckoutPoint from "@/components/Checkout/CheckoutPoint";
import PaymentMethods from "@/components/Checkout/PaymentMethods";
import { CartSectionType } from "@/types/cart";
import { OrdererFormValues } from "@/types/checkout";
import { EMAIL_DOMAINS } from "@/constants/checkout";
import styles from "./page.module.scss";

const CheckoutPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const sessionInitialized = useRef(false);

  const [sections, setSections] = useState<CartSectionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<OrdererFormValues>({
    name: "",
    emailLocal: "",
    emailDomain: "naver.com",
    phoneArea: "010",
    phoneNumber: "",
    deliveryRequest: "",
  });

  const setField = <K extends keyof OrdererFormValues>(key: K, value: OrdererFormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (sessionInitialized.current || !session?.user) return;
    sessionInitialized.current = true;

    const updates: Partial<OrdererFormValues> = {};
    if (session.user.name) updates.name = session.user.name;
    if (session.user.email) {
      const [local, domain] = session.user.email.split("@");
      updates.emailLocal = local ?? "";
      const knownDomains = (EMAIL_DOMAINS as readonly string[]).slice(0, -1);
      updates.emailDomain = knownDomains.includes(domain) ? domain : "직접입력";
    }
    setForm((prev) => ({ ...prev, ...updates }));
  }, [session]);

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
  const totalProductPrice = allItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalPrice = totalProductPrice;
  const pointEarned = Math.floor(finalPrice * 0.001);

  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        <div className={styles.main}>
          <Text tag="h1" fontSize={24} fontWeight={700} color="gray01" className={styles.pageTitle}>
            주문/결제
          </Text>
          <ShippingAddress
            deliveryRequest={form.deliveryRequest}
            onDeliveryRequestChange={(value) => setField("deliveryRequest", value)}
          />
          <OrdererForm form={form} onFieldChange={setField} />
          <OrderItems sections={sections} totalCount={allItems.length} isLoading={isLoading} />
          <CheckoutCoupon />
          <CheckoutPoint />
          <PaymentMethods />
        </div>

        <aside className={styles.sidebar}>
          <PaymentSummary
            totalProductPrice={totalProductPrice}
            finalPrice={finalPrice}
            pointEarned={pointEarned}
          />
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
