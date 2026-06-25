export interface CartOptionSelectionOption {
  values: { id: number }[];
}

export interface CartOptionLabelItem {
  typeName: string;
  value: string;
}

export const isValidCartOptionSelection = (
  productOptions: CartOptionSelectionOption[],
  optionValueIds: number[],
) => {
  if (productOptions.length !== optionValueIds.length) return false;

  const selectedIds = new Set(optionValueIds);
  if (selectedIds.size !== optionValueIds.length) return false;

  return productOptions.every((option) =>
    option.values.some((value) => selectedIds.has(value.id)),
  );
};

export const buildCartOptionLabel = (items: CartOptionLabelItem[]) =>
  items.map((item) => `${item.typeName}: ${item.value}`).join(" / ");
