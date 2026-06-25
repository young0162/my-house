"use client";

import { useState } from "react";
import Text from "@/components/Common/Text";
import { CloseIcon } from "@/components/Common/Icon";
import { UserAddressView } from "@/types/checkout";
import styles from "./ShippingAddressModal.module.scss";

interface ShippingAddressModalProps {
  address: UserAddressView | null;
  onClose: () => void;
  onSelect: (address: UserAddressView) => void;
  onUpdate: (address: UserAddressView) => void;
  onDelete: () => void;
}

const splitPhone = (phoneNumber: string) => {
  const [area = "010", rest = ""] = phoneNumber.split("-");
  return { area, rest };
};

const ShippingAddressModal = ({
  address,
  onClose,
  onSelect,
  onUpdate,
  onDelete,
}: ShippingAddressModalProps) => {
  const [mode, setMode] = useState<"select" | "edit">("select");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const phone = splitPhone(address?.phoneNumber ?? "");
  const [form, setForm] = useState({
    addressName: address?.recipientName ?? "",
    recipientName: address?.recipientName ?? "",
    phoneArea: phone.area,
    phoneRest: phone.rest,
    zipCode: address?.zipCode ?? "",
    address: address?.address ?? "",
    detailAddress: address?.detailAddress ?? "",
    isDefault: address?.isDefault ?? true,
  });

  const handleSave = () => {
    if (!address) return;
    onUpdate({
      ...address,
      recipientName: form.recipientName,
      phoneNumber: `${form.phoneArea}-${form.phoneRest}`,
      zipCode: form.zipCode,
      address: form.address,
      detailAddress: form.detailAddress,
      isDefault: form.isDefault,
    });
    setMode("select");
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={mode === "edit" ? "배송지 수정" : "배송지 선택"}>
      <section className={`${styles.modal} ${mode === "edit" ? styles.editModal : ""}`}>
        <header className={styles.header}>
          {mode === "edit" && (
            <button type="button" className={styles.backButton} onClick={() => setMode("select")} aria-label="배송지 선택으로 돌아가기">
              ←
            </button>
          )}
          <Text tag="h2" fontSize={16} fontWeight={800} color="gray01">
            {mode === "edit" ? "배송지 수정" : "배송지 선택"}
          </Text>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="배송지 모달 닫기">
            <CloseIcon size={22} />
          </button>
        </header>

        {mode === "edit" ? (
          <div className={styles.editBody}>
            <label className={styles.fieldRow}>
              <Text tag="span" fontSize={14} className={styles.fieldLabel}>배송지명</Text>
              <input
                className={styles.input}
                value={form.addressName}
                onChange={(event) => setForm((prev) => ({ ...prev, addressName: event.target.value }))}
              />
            </label>
            <label className={styles.fieldRow}>
              <Text tag="span" fontSize={14} className={styles.fieldLabel}>받는 사람</Text>
              <input
                className={styles.input}
                value={form.recipientName}
                onChange={(event) => setForm((prev) => ({ ...prev, recipientName: event.target.value }))}
              />
            </label>
            <div className={styles.fieldRow}>
              <Text tag="span" fontSize={14} className={styles.fieldLabel}>전화번호</Text>
              <div className={styles.phoneFields}>
                <select
                  className={styles.phoneSelect}
                  value={form.phoneArea}
                  onChange={(event) => setForm((prev) => ({ ...prev, phoneArea: event.target.value }))}
                  aria-label="전화번호 앞자리"
                >
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                </select>
                <input
                  className={styles.input}
                  value={form.phoneRest}
                  onChange={(event) => setForm((prev) => ({ ...prev, phoneRest: event.target.value }))}
                  aria-label="전화번호"
                />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <Text tag="span" fontSize={14} className={styles.fieldLabel}>주소</Text>
              <div className={styles.addressFields}>
                <div className={styles.zipRow}>
                  <button type="button" className={styles.findAddressButton}>
                    <Text tag="span" fontSize={14} fontWeight={700} color="primary">주소찾기</Text>
                  </button>
                  <input
                    className={styles.input}
                    value={form.zipCode}
                    onChange={(event) => setForm((prev) => ({ ...prev, zipCode: event.target.value }))}
                    aria-label="우편번호"
                  />
                </div>
                <input
                  className={styles.input}
                  value={form.address}
                  onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                  aria-label="주소"
                />
                <input
                  className={styles.input}
                  value={form.detailAddress}
                  onChange={(event) => setForm((prev) => ({ ...prev, detailAddress: event.target.value }))}
                  aria-label="상세주소"
                />
              </div>
            </div>
            <label className={styles.defaultCheck}>
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(event) => setForm((prev) => ({ ...prev, isDefault: event.target.checked }))}
              />
              <Text tag="span" fontSize={15} color="gray01">기본 배송지로 저장</Text>
            </label>
            <button type="button" className={styles.saveButton} onClick={handleSave}>
              <Text tag="span" fontSize={16} fontWeight={800} color="white">저장</Text>
            </button>
          </div>
        ) : (
          <>
            <div className={styles.body}>
              {address ? (
                <article className={styles.addressCard}>
                  <div className={styles.nameRow}>
                    <Text tag="strong" fontSize={18} fontWeight={800} color="gray01">
                      {address.recipientName}
                    </Text>
                    {address.isDefault && (
                      <Text tag="span" fontSize={12} fontWeight={700} color="primary" className={styles.defaultBadge}>
                        기본배송지
                      </Text>
                    )}
                  </div>

                  <Text tag="p" fontSize={15} className={styles.addressText}>
                    {address.address}{address.detailAddress ? `, ${address.detailAddress}` : ""}
                  </Text>
                  <Text tag="p" fontSize={14} className={styles.phoneText}>
                    {address.recipientName} {address.phoneNumber}
                  </Text>

                  <div className={styles.cardActions}>
                    <div className={styles.leftActions}>
                      <button type="button" className={styles.secondaryButton} onClick={() => setDeleteConfirmOpen(true)}>
                        <Text tag="span" fontSize={14} fontWeight={700} color="gray01">삭제</Text>
                      </button>
                      <button type="button" className={styles.secondaryButton} onClick={() => setMode("edit")}>
                        <Text tag="span" fontSize={14} fontWeight={700} color="gray01">수정</Text>
                      </button>
                    </div>
                    <button type="button" className={styles.selectButton} onClick={() => onSelect(address)}>
                      <Text tag="span" fontSize={14} fontWeight={700} color="white">선택</Text>
                    </button>
                  </div>
                </article>
              ) : (
                <div className={styles.empty}>
                  <Text tag="p" fontSize={15}>등록된 배송지가 없습니다.</Text>
                </div>
              )}
            </div>

            <footer className={styles.footer}>
              <button type="button" className={styles.addButton}>
                <Text tag="span" fontSize={16} fontWeight={800} color="white">
                  배송지 추가
                </Text>
              </button>
            </footer>
          </>
        )}

        {deleteConfirmOpen && (
          <div className={styles.confirmOverlay} role="dialog" aria-modal="true" aria-label="배송지 삭제 확인">
            <section className={styles.confirmModal}>
              <Text tag="p" fontSize={16} color="gray01" className={styles.confirmText}>
                배송지를 삭제하시겠습니까?
              </Text>
              <div className={styles.confirmActions}>
                <button type="button" className={styles.confirmCancelButton} onClick={() => setDeleteConfirmOpen(false)}>
                  <Text tag="span" fontSize={15} fontWeight={700} color="gray01">취소</Text>
                </button>
                <button
                  type="button"
                  className={styles.confirmOkButton}
                  onClick={() => {
                    onDelete();
                    setDeleteConfirmOpen(false);
                  }}
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
