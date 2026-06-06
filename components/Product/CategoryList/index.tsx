"use client";

import { useState } from "react";
import type { CategoryTreeItem } from "@/app/types/category";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/Common/Icon";
import Text from "@/components/Common/Text";
import styles from "./CategoryList.module.scss";

interface CategoryListProps {
  groups: CategoryTreeItem[];
}

const CategoryList = ({ groups }: CategoryListProps) => {
  const defaultOpenGroup = groups.find((group) => group.children && group.children.length > 0)?.id ?? null;
  const defaultGroup = groups.find((group) => group.id === defaultOpenGroup);
  const defaultOpenSub = defaultGroup?.children?.find((sub) => sub.children && sub.children.length > 0)?.id ?? null;

  const [openGroupId, setOpenGroupId] = useState<string | null>(defaultOpenGroup);
  const [openSubId, setOpenSubId] = useState<string | null>(defaultOpenSub);
  const [activeLeafId, setActiveLeafId] = useState<string | null>(null);

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
          <button
            type="button"
            className={`${styles.leafItem} ${styles.leafItemNested} ${activeLeafId === child.id ? styles.leafItemActive : ""}`}
            onClick={() => setActiveLeafId(child.id)}
          >
            <Text tag="span">{child.label}</Text>
          </button>
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
                <button
                  type="button"
                  className={`${styles.rootCategoryItem} ${isGroupOpen ? styles.rootCategoryItemActive : ""}`}
                  onClick={() => toggleGroup(group.id, hasChildren)}
                >
                  <Text tag="span">{group.label}</Text>
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
                              <Text tag="span">{sub.label}</Text>
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
                                        <Text tag="span">{leaf.label}</Text>
                                      </button>
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
