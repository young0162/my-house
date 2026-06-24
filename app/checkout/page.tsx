"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Text from "@/components/Common/Text";
import ShippingAddress from "@/components/Checkout/ShippingAddress";
import OrdererForm from "@/components/Checkout/OrdererForm";
import OrderItems from "@/components/Checkout/OrderItems";
import PaymentSummary from "@/components/Checkout/PaymentSummary";
import CheckoutCoupon from "@/components/Checkout/CheckoutCoupon";
import CheckoutPoint from "@/components/Checkout/CheckoutPoint";
import PaymentMethods from "@/components/Checkout/PaymentMethods";
import { CheckoutSection, OrdererFormValues, UserAddressView } from "@/types/checkout";
import { checkoutApiService } from "@/services/checkout.api";
import { addressApiService } from "@/services/address.api";
import { EMAIL_DOMAINS } from "@/constants/checkout";
import styles from "./page.module.scss";

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const sessionInitialized = useRef(false);

  const [sections, setSections] = useState<CheckoutSection[]>([]);
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [pointEarned, setPointEarned] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState<UserAddressView | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
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
    const fetchDefaultAddress = async () => {
      try {
        const address = await addressApiService.getDefaultAddress();
        setShippingAddress(address);
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } }).response?.status;
        if (status === 401) router.push("/login");
      } finally {
        setIsAddressLoading(false);
      }
    };
    fetchDefaultAddress();
  }, [router]);

  useEffect(() => {
    const checkoutId = searchParams.get("checkoutId");
    if (!checkoutId) {
      router.push("/cart");
      return;
    }

    const fetchCheckout = async () => {
      try {
        const data = await checkoutApiService.getDetail(checkoutId);
        setSections(data.sections);
        setTotalProductPrice(data.totalProductPrice);
        setFinalPrice(data.finalPrice);
        setPointEarned(data.pointEarned);
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } }).response?.status;
        if (status === 401) {
          router.push("/login");
        } else {
          router.push("/cart");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCheckout();
  }, [router, searchParams]);

  const allItems = sections.flatMap((s) => s.items);

  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        <div className={styles.main}>
          <Text tag="h1" fontSize={24} fontWeight={700} color="gray01" className={styles.pageTitle}>
            주문/결제
          </Text>
          <ShippingAddress
            address={shippingAddress}
            isLoading={isAddressLoading}
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
