"use client";

import { useEffect, useState } from "react";
import DaumPostcode, { Address } from "react-daum-postcode";
import Text from "@/components/Common/Text";
import { CloseIcon } from "@/components/Common/Icon";
import { addressApiService } from "@/services/address.api";
import { UserAddressView } from "@/types/checkout";
import styles from "./ShippingAddressModal.module.scss";

interface ShippingAddressModalProps {
  address: UserAddressView | null;
  onClose: () => void;
  onSelect: (address: UserAddressView) => void;
  onUpdate: (address: UserAddressView) => void;
  onDelete: () => void;
}

type AddressForm = {
  addressName: string;
  recipientName: string;
  phoneArea: string;
  phoneRest: string;
  zipCode: string;
  address: string;
  detailAddress: string;
  isDefault: boolean;
};

const EMPTY_FORM: AddressForm = {
  addressName: "",
  recipientName: "",
  phoneArea: "010",
  phoneRest: "",
  zipCode: "",
  address: "",
  detailAddress: "",
  isDefault: true,
};

const splitPhone = (phoneNumber: string) => {
  const idx = phoneNumber.indexOf("-");
  if (idx === -1) return { area: phoneNumber, rest: "" };
  return { area: phoneNumber.slice(0, idx), rest: phoneNumber.slice(idx + 1) };
};

const ShippingAddressModal = ({
  address,
  onClose,
  onSelect,
  onUpdate,
  onDelete,
}: ShippingAddressModalProps) => {
  const [mode, setMode] = useState<"select" | "edit" | "add">("select");
  const [showPostcode, setShowPostcode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<UserAddressView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState<UserAddressView | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<UserAddressView | null>(null);
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [addForm, setAddForm] = useState<AddressForm>(EMPTY_FORM);

  useEffect(() => {
    addressApiService.getAddresses()
      .then(({ addresses }) => setAddresses(addresses))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const activeForm = mode === "add" ? addForm : form;
  const setActiveForm = mode === "add" ? setAddForm : setForm;

  const startEdit = (target: UserAddressView) => {
    const phone = splitPhone(target.phoneNumber);
    setForm({
      addressName: target.recipientName,
      recipientName: target.recipientName,
      phoneArea: phone.area,
      phoneRest: phone.rest,
      zipCode: target.zipCode ?? "",
      address: target.address,
      detailAddress: target.detailAddress ?? "",
      isDefault: target.isDefault,
    });
    setEditingAddress(target);
    setMode("edit");
  };

  const handleSave = async () => {
    if (!editingAddress || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const updated = await addressApiService.updateAddress(editingAddress.id, {
        recipientName: form.recipientName,
        phoneNumber: `${form.phoneArea}-${form.phoneRest}`,
        zipCode: form.zipCode || null,
        address: form.address,
        detailAddress: form.detailAddress || null,
        isDefault: form.isDefault,
      });
      setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      if (address?.id === editingAddress.id) onUpdate(updated);
      setMode("select");
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 401) { alert("로그인이 필요합니다."); return; }
      alert("배송지 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAddress || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addressApiService.deleteAddress(deletingAddress.id);
      setAddresses((prev) => prev.filter((a) => a.id !== deletingAddress.id));
      if (address?.id === deletingAddress.id) onDelete();
      setDeletingAddress(null);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 401) { alert("로그인이 필요합니다."); return; }
      alert("배송지 삭제에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdd = async () => {
    if (isSubmitting) return;
    const recipientName = addForm.recipientName.trim();
    const phoneRest = addForm.phoneRest.trim();
    const addr = addForm.address.trim();
    if (!recipientName || !phoneRest || !addr) {
      alert("받는 사람, 전화번호, 주소는 필수 항목입니다.");
      return;
    }
    setIsSubmitting(true);
    try {
      const newAddress = await addressApiService.createAddress({
        recipientName,
        phoneNumber: `${addForm.phoneArea}-${phoneRest}`,
        zipCode: addForm.zipCode.trim() || undefined,
        address: addr,
        detailAddress: addForm.detailAddress.trim() || undefined,
        isDefault: addForm.isDefault,
      });
      onSelect(newAddress);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 401) {
        alert("로그인이 필요합니다.");
        return;
      }
      alert("배송지 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostcodeComplete = (data: Address) => {
    setActiveForm((prev) => ({ ...prev, zipCode: data.zonecode, address: data.address }));
    setShowPostcode(false);
  };

  const modeLabel = mode === "add" ? "배송지 추가" : mode === "edit" ? "배송지 수정" : "배송지 선택";

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={modeLabel}>
      <section className={`${styles.modal} ${mode !== "select" ? styles.editModal : ""}`}>
        <header className={styles.header}>
          {(mode !== "select" || showPostcode) && (
            <button
              type="button"
              className={styles.backButton}
              onClick={() => showPostcode ? setShowPostcode(false) : setMode("select")}
              aria-label={showPostcode ? "주소검색 닫기" : "배송지 선택으로 돌아가기"}
            >
              ←
            </button>
          )}
          <Text tag="h2" fontSize={16} fontWeight={800} color="gray01">
            {modeLabel}
          </Text>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="배송지 모달 닫기">
            <CloseIcon size={22} />
          </button>
        </header>

        {mode !== "select" ? (
          showPostcode ? (
            <div className={styles.postcodeWrap}>
              <DaumPostcode onComplete={handlePostcodeComplete} />
            </div>
          ) : (
          <div className={styles.editBody}>
            <label className={styles.fieldRow}>
              <Text tag="span" fontSize={14} className={styles.fieldLabel}>배송지명</Text>
              <input
                className={styles.input}
                value={activeForm.addressName}
                onChange={(event) => setActiveForm((prev) => ({ ...prev, addressName: event.target.value }))}
              />
            </label>
            <label className={styles.fieldRow}>
              <Text tag="span" fontSize={14} className={styles.fieldLabel}>받는 사람</Text>
              <input
                className={styles.input}
                value={activeForm.recipientName}
                onChange={(event) => setActiveForm((prev) => ({ ...prev, recipientName: event.target.value }))}
              />
            </label>
            <div className={styles.fieldRow}>
              <Text tag="span" fontSize={14} className={styles.fieldLabel}>전화번호</Text>
              <div className={styles.phoneFields}>
                <select
                  className={styles.phoneSelect}
                  value={activeForm.phoneArea}
                  onChange={(event) => setActiveForm((prev) => ({ ...prev, phoneArea: event.target.value }))}
                  aria-label="전화번호 앞자리"
                >
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                </select>
                <input
                  className={styles.input}
                  value={activeForm.phoneRest}
                  inputMode="numeric"
                  maxLength={8}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, "").slice(0, 8);
                    setActiveForm((prev) => ({ ...prev, phoneRest: digits }));
                  }}
                  aria-label="전화번호"
                />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <Text tag="span" fontSize={14} className={styles.fieldLabel}>주소</Text>
              <div className={styles.addressFields}>
                <div className={styles.zipRow}>
                  <button type="button" className={styles.findAddressButton} onClick={() => setShowPostcode(true)}>
                    <Text tag="span" fontSize={14} fontWeight={700} color="primary">주소찾기</Text>
                  </button>
                  <input
                    className={styles.input}
                    value={activeForm.zipCode}
                    readOnly
                    aria-label="우편번호"
                  />
                </div>
                <input
                  className={styles.input}
                  value={activeForm.address}
                  readOnly
                  aria-label="주소"
                />
                <input
                  className={styles.input}
                  value={activeForm.detailAddress}
                  onChange={(event) => setActiveForm((prev) => ({ ...prev, detailAddress: event.target.value }))}
                  placeholder="상세주소 입력"
                  aria-label="상세주소"
                />
              </div>
            </div>
            <label className={styles.defaultCheck}>
              <input
                type="checkbox"
                checked={activeForm.isDefault}
                onChange={(event) => setActiveForm((prev) => ({ ...prev, isDefault: event.target.checked }))}
              />
              <Text tag="span" fontSize={15} color="gray01">기본 배송지로 저장</Text>
            </label>
            <button
              type="button"
              className={styles.saveButton}
              onClick={mode === "add" ? handleAdd : handleSave}
              disabled={isSubmitting}
            >
              <Text tag="span" fontSize={16} fontWeight={800} color="white">
                {isSubmitting ? "저장 중..." : "저장"}
              </Text>
            </button>
          </div>
          )
        ) : (
          <>
            <div className={styles.body}>
              {isLoading ? (
                <Text tag="p" fontSize={14} className={styles.loadingText}>배송지를 불러오는 중...</Text>
              ) : addresses.length === 0 ? (
                <div className={styles.empty}>
                  <Text tag="p" fontSize={15}>등록된 배송지가 없습니다.</Text>
                </div>
              ) : (
                <ul className={styles.addressList}>
                  {addresses.map((addr) => (
                    <li key={addr.id}>
                      <article className={styles.addressCard}>
                        <div className={styles.nameRow}>
                          <Text tag="strong" fontSize={18} fontWeight={800} color="gray01">
                            {addr.recipientName}
                          </Text>
                          {addr.isDefault && (
                            <Text tag="span" fontSize={12} fontWeight={700} color="primary" className={styles.defaultBadge}>
                              기본배송지
                            </Text>
                          )}
                        </div>
                        <Text tag="p" fontSize={15} className={styles.addressText}>
                          {addr.address}{addr.detailAddress ? `, ${addr.detailAddress}` : ""}
                        </Text>
                        <Text tag="p" fontSize={14} className={styles.phoneText}>
                          {addr.recipientName} {addr.phoneNumber}
                        </Text>
                        <div className={styles.cardActions}>
                          <div className={styles.leftActions}>
                            <button type="button" className={styles.secondaryButton} onClick={() => setDeletingAddress(addr)}>
                              <Text tag="span" fontSize={14} fontWeight={700} color="gray01">삭제</Text>
                            </button>
                            <button type="button" className={styles.secondaryButton} onClick={() => startEdit(addr)}>
                              <Text tag="span" fontSize={14} fontWeight={700} color="gray01">수정</Text>
                            </button>
                          </div>
                          <button type="button" className={styles.selectButton} onClick={() => onSelect(addr)}>
                            <Text tag="span" fontSize={14} fontWeight={700} color="white">선택</Text>
                          </button>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className={styles.footer}>
              <button type="button" className={styles.addButton} onClick={() => setMode("add")}>
                <Text tag="span" fontSize={16} fontWeight={800} color="white">
                  배송지 추가
                </Text>
              </button>
            </footer>
          </>
        )}

        {deletingAddress && (
          <div className={styles.confirmOverlay} role="dialog" aria-modal="true" aria-label="배송지 삭제 확인">
            <section className={styles.confirmModal}>
              <Text tag="p" fontSize={16} color="gray01" className={styles.confirmText}>
                배송지를 삭제하시겠습니까?
              </Text>
              <div className={styles.confirmActions}>
                <button type="button" className={styles.confirmCancelButton} onClick={() => setDeletingAddress(null)}>
                  <Text tag="span" fontSize={15} fontWeight={700} color="gray01">취소</Text>
                </button>
                <button
                  type="button"
                  className={styles.confirmOkButton}
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  <Text tag="span" fontSize={15} fontWeight={700} color="white">확인</Text>
                </button>
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
};

export default ShippingAddressModal;
