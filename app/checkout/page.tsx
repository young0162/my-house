"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Text from "@/components/Common/Text";
import ShippingAddress from "@/components/Checkout/ShippingAddress";
import ShippingAddressModal from "@/components/Checkout/ShippingAddressModal";
import OrdererForm from "@/components/Checkout/OrdererForm";
import OrderItems from "@/components/Checkout/OrderItems";
import PaymentSummary from "@/components/Checkout/PaymentSummary";
import CheckoutCoupon from "@/components/Checkout/CheckoutCoupon";
import CheckoutPoint from "@/components/Checkout/CheckoutPoint";
import PaymentMethods from "@/components/Checkout/PaymentMethods";
import {
  CheckoutSection,
  OrdererFormValues,
  ShippingAddressFormValues,
  UserAddressView,
} from "@/types/checkout";
import { checkoutApiService } from "@/services/checkout.api";
import { addressApiService } from "@/services/address.api";
import { orderApiService } from "@/services/order.api";
import { useCartStore } from "@/store/cartStore";
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
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const decrementCart = useCartStore((s) => s.decrement);
  const [form, setForm] = useState<OrdererFormValues>({
    name: "",
    emailLocal: "",
    emailDomain: "naver.com",
    phoneArea: "010",
    phoneNumber: "",
    deliveryRequest: "",
  });
  const [emptyAddressForm, setEmptyAddressForm] = useState<ShippingAddressFormValues>({
    addressName: "집",
    recipientName: "장도영",
    phoneArea: "010",
    phoneNumber: "3825-0313",
    zipCode: "04946",
    address: "서울특별시 광진구 영화사로3길 20-8 (중곡동)",
    detailAddress: "",
    isDefault: true,
  });

  const setField = <K extends keyof OrdererFormValues>(key: K, value: OrdererFormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setEmptyAddressField = <K extends keyof ShippingAddressFormValues>(
    key: K,
    value: ShippingAddressFormValues[K],
  ) => setEmptyAddressForm((prev) => ({ ...prev, [key]: value }));

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

  const placeOrder = async (address: UserAddressView) => {
    const checkoutId = searchParams.get("checkoutId");
    if (!checkoutId) return;

    const ordererEmail =
      form.emailDomain === "직접입력"
        ? form.emailLocal
        : `${form.emailLocal}@${form.emailDomain}`;

    const result = await orderApiService.createOrder({
      checkoutId,
      ordererName: form.name,
      ordererEmail,
      ordererPhone: `${form.phoneArea}-${form.phoneNumber}`,
      recipientName: address.recipientName,
      recipientPhone: address.phoneNumber,
      zipCode: address.zipCode ?? undefined,
      address: address.address,
      detailAddress: address.detailAddress ?? undefined,
      deliveryRequest: form.deliveryRequest || undefined,
      paymentMethod: "간편결제",
    });

    decrementCart(allItems.length);
    router.push(`/order/complete?orderId=${result.orderId}`);
  };

  const handlePayment = async () => {
    if (isPaymentSubmitting) return;

    setIsPaymentSubmitting(true);
    try {
      if (shippingAddress) {
        await placeOrder(shippingAddress);
        return;
      }

      const recipientName = emptyAddressForm.recipientName.trim();
      const phoneNumber = emptyAddressForm.phoneNumber.trim();
      const address = emptyAddressForm.address.trim();

      if (!recipientName || !phoneNumber || !address) {
        alert("배송지 정보를 입력해주세요.");
        return;
      }

      const createdAddress = await addressApiService.createAddress({
        recipientName,
        phoneNumber: `${emptyAddressForm.phoneArea}-${phoneNumber}`,
        zipCode: emptyAddressForm.zipCode.trim() || undefined,
        address,
        detailAddress: emptyAddressForm.detailAddress.trim() || undefined,
        isDefault: emptyAddressForm.isDefault,
      });
      setShippingAddress(createdAddress);
      await placeOrder(createdAddress);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 401) {
        router.push("/login");
        return;
      }
      alert("결제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsPaymentSubmitting(false);
    }
  };

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
            emptyAddressForm={emptyAddressForm}
            onEmptyAddressFieldChange={setEmptyAddressField}
            deliveryRequest={form.deliveryRequest}
            onDeliveryRequestChange={(value) => setField("deliveryRequest", value)}
            onChangeAddress={() => setIsAddressModalOpen(true)}
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
            isSubmitting={isPaymentSubmitting}
            onPayment={handlePayment}
          />
        </aside>
      </div>

      {isAddressModalOpen && (
        <ShippingAddressModal
          address={shippingAddress}
          onClose={() => setIsAddressModalOpen(false)}
          onSelect={(address) => {
            setShippingAddress(address);
            setIsAddressModalOpen(false);
          }}
          onUpdate={setShippingAddress}
          onDelete={() => setShippingAddress(null)}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
