"use client";

import Link from "next/link";
import { useState } from "react";
import type { CategoryItem, CategoryTreeItem } from "@/app/types/category";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import styles from "./CategoryList.module.scss";

interface CategoryListProps {
  groups: CategoryTreeItem[];
  selectedPath: CategoryItem[];
}

const getCategoryHref = (id: string) => `/store/category?category_id=${id}`;

const CategoryList = ({ groups, selectedPath }: CategoryListProps) => {
  const defaultOpenGroup = selectedPath[0]?.id ?? groups.find((group) => group.children && group.children.length > 0)?.id ?? null;
  const defaultOpenSub = selectedPath.length > 2 ? selectedPath[1]?.id ?? null : null;
  const defaultActiveLeaf = selectedPath.length > 2 ? selectedPath[selectedPath.length - 1]?.id ?? null : null;
  const selectedCategoryId = selectedPath[selectedPath.length - 1]?.id ?? null;

  const [openGroupId, setOpenGroupId] = useState<string | null>(defaultOpenGroup);
  const [openSubId, setOpenSubId] = useState<string | null>(defaultOpenSub);
  const [activeLeafId, setActiveLeafId] = useState<string | null>(defaultActiveLeaf);

  const toggleGroup = (id: string, hasChildren: boolean) => {
    if (!hasChildren) return;
    setOpenGroupId((prev) => (prev === id ? null : id));
    setOpenSubId(null);
    setActiveLeafId(null);
  };

  const toggleSub = (sub: CategoryTreeItem) => {
    if (!sub.children || sub.children.length === 0) return;
    setOpenSubId((prev) => (prev === sub.id ? null : sub.id));
    setActiveLeafId(null);
  };

  const renderLeafChildren = (children: CategoryTreeItem[]) => (
    <ul className={styles.nestedLeafList}>
      {children.map((child) => (
        <li key={child.id}>
          <Link
            href={getCategoryHref(child.id)}
            className={`${styles.leafItem} ${styles.leafItemNested} ${activeLeafId === child.id ? styles.leafItemActive : ""}`}
            onClick={() => setActiveLeafId(child.id)}
          >
            <Text tag="span">{child.label}</Text>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <aside className={styles.root}>
      <nav>
        <ul className={styles.groupList}>
          {groups.map((group) => {
            const hasChildren = !!group.children && group.children.length > 0;
            const isGroupOpen = openGroupId === group.id;

            return (
              <li key={group.id}>
                <Link
                  href={getCategoryHref(group.id)}
                  className={`${styles.rootCategoryItem} ${isGroupOpen ? styles.rootCategoryItemActive : ""}`}
                  onClick={() => toggleGroup(group.id, hasChildren)}
                >
                  <Text tag="span">{group.label}</Text>
                  {hasChildren && (isGroupOpen ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                </Link>

                <div className={`${styles.collapseWrapper} ${isGroupOpen ? styles.open : ""}`}>
                  <div className={styles.collapseInner}>
                    <ul className={styles.subList}>
                      {(group.children ?? []).map((sub) => {
                        const hasLeaves = !!sub.children && sub.children.length > 0;
                        const isSubOpen = openSubId === sub.id;
                        const isSubActive = isSubOpen || selectedCategoryId === sub.id;

                        return (
                          <li key={sub.id}>
                            <Link
                              href={getCategoryHref(sub.id)}
                              className={`${styles.subItem} ${isSubActive ? styles.subItemActive : ""}`}
                              onClick={() => toggleSub(sub)}
                            >
                              <Text tag="span">{sub.label}</Text>
                              {hasLeaves && (isSubOpen ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                            </Link>

                            <div className={`${styles.collapseWrapper} ${isSubOpen ? styles.open : ""}`}>
                              <div className={styles.collapseInner}>
                                <ul className={styles.leafList}>
                                  {(sub.children ?? []).map((leaf) => (
                                    <li key={leaf.id}>
                                      <Link
                                        href={getCategoryHref(leaf.id)}
                                        className={`${styles.leafItem} ${activeLeafId === leaf.id ? styles.leafItemActive : ""}`}
                                        onClick={() => setActiveLeafId(leaf.id)}
                                      >
                                        <Text tag="span">{leaf.label}</Text>
                                      </Link>
                                      {leaf.children && leaf.children.length > 0 ? renderLeafChildren(leaf.children) : null}
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
