"use client";

import { useState } from "react";
import { CATEGORIES, SNB_TREE, SnbGroup, SnbSub } from "@/constants/category";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/Common/Icon";
import styles from "./CategoryList.module.scss";

interface CategoryListProps {
  activeCategoryId: string;
}

const CategoryList = ({ activeCategoryId }: CategoryListProps) => {
  const groups: SnbGroup[] = SNB_TREE[activeCategoryId] ?? [];
  const currentCategory = CATEGORIES.find((c) => c.id === activeCategoryId);

  const defaultOpenGroup = groups.find((g) => g.children && g.children.length > 0)?.id ?? null;
  const defaultOpenSub = groups
    .flatMap((g) => g.children ?? [])
    .find((s) => s.children && s.children.length > 0)?.id ?? null;

  const [openGroupId, setOpenGroupId] = useState<string | null>(defaultOpenGroup);
  const [openSubId, setOpenSubId] = useState<string | null>(defaultOpenSub);
  const [activeLeafId, setActiveLeafId] = useState<string | null>(null);

  const toggleGroup = (id: string, hasChildren: boolean) => {
    if (!hasChildren) return;
    setOpenGroupId((prev) => (prev === id ? null : id));
    setOpenSubId(null);
    setActiveLeafId(null);
  };

  const toggleSub = (sub: SnbSub) => {
    if (!sub.children || sub.children.length === 0) return;
    setOpenSubId((prev) => (prev === sub.id ? null : sub.id));
    setActiveLeafId(null);
  };

  return (
    <aside className={styles.root}>
      <div className={styles.categoryTitle}>{currentCategory?.label}</div>

      <nav>
        <ul className={styles.groupList}>
          {groups.map((group) => {
            const hasChildren = !!group.children && group.children.length > 0;
            const isGroupOpen = openGroupId === group.id;

            return (
              <li key={group.id}>
                <button
                  type="button"
                  className={`${styles.groupItem} ${group.noChevron ? styles.groupItemPlain : ""}`}
                  onClick={() => toggleGroup(group.id, hasChildren)}
                >
                  <span>{group.label}</span>
                  {hasChildren && (isGroupOpen ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                </button>

                <div className={`${styles.collapseWrapper} ${isGroupOpen ? styles.open : ""}`}>
                  <div className={styles.collapseInner}>
                    <ul className={styles.subList}>
                      {(group.children ?? []).map((sub) => {
                        const hasLeaves = !!sub.children && sub.children.length > 0;
                        const isSubOpen = openSubId === sub.id;

                        return (
                          <li key={sub.id}>
                            <button
                              type="button"
                              className={`${styles.subItem} ${isSubOpen ? styles.subItemActive : ""}`}
                              onClick={() => toggleSub(sub)}
                            >
                              <span>{sub.label}</span>
                              {hasLeaves && (isSubOpen ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                            </button>

                            <div className={`${styles.collapseWrapper} ${isSubOpen ? styles.open : ""}`}>
                              <div className={styles.collapseInner}>
                                <ul className={styles.leafList}>
                                  {(sub.children ?? []).map((leaf) => (
                                    <li key={leaf.id}>
                                      <button
                                        type="button"
                                        className={`${styles.leafItem} ${activeLeafId === leaf.id ? styles.leafItemActive : ""}`}
                                        onClick={() => setActiveLeafId(leaf.id)}
                                      >
                                        {leaf.label}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default CategoryList;
