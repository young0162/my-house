"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/Common/Icon";
import { CATEGORY_FILTERS, FilterGroup } from "@/constants/filter";
import styles from "./FilterBar.module.scss";

export type SelectedFilters = Record<string, string[]>;

interface FilterBarProps {
  onChange?: (filters: SelectedFilters) => void;
}

interface DropdownProps {
  group: FilterGroup;
  selected: string[];
  onToggle: (value: string) => void;
}

const FilterDropdown = ({ group, selected, onToggle }: DropdownProps) => (
  <div className={styles.dropdown}>
    <ul className={styles.optionGrid}>
      {group.options.map((opt) => {
        const checked = selected.includes(opt.value);
        return (
          <li key={opt.value}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={checked}
                onChange={() => onToggle(opt.value)}
              />
              <span className={`${styles.customCheck} ${checked ? styles.customCheckActive : ""}`} />
              <span className={styles.optionText}>{opt.label}</span>
            </label>
          </li>
        );
      })}
    </ul>
  </div>
);

const FilterBar = ({ onChange }: FilterBarProps) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedFilters>({});
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleGroup = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const toggleOption = (groupId: string, value: string) => {
    setSelected((prev) => {
      const current = prev[groupId] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      const updated = { ...prev, [groupId]: next };
      onChange?.(updated);
      return updated;
    });
  };

  return (
    <div className={styles.root} ref={barRef}>
      <div className={styles.chipRow}>
        {CATEGORY_FILTERS.map((group) => {
          const isOpen = openId === group.id;
          const selectedCount = (selected[group.id] ?? []).length;
          const isActive = selectedCount > 0;

          return (
            <div key={group.id} className={styles.chipWrap}>
              <button
                type="button"
                className={`${styles.chip} ${isActive || isOpen ? styles.chipActive : ""}`}
                onClick={() => toggleGroup(group.id)}
              >
                <span>
                  {group.label}
                  {isActive && ` (${selectedCount})`}
                </span>
                {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>

              <div className={`${styles.dropdownWrap} ${isOpen ? styles.dropdownOpen : ""}`}>
                <div className={styles.dropdownInner}>
                  <FilterDropdown
                    group={group}
                    selected={selected[group.id] ?? []}
                    onToggle={(value) => toggleOption(group.id, value)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
