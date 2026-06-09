export interface CategoryRow {
  id: number;
  name: string;
  depth: number;
  sortOrder: number;
  parentId: number | null;
}

export interface CategoryItem {
  id: string;
  label: string;
}

export interface CategoryTreeItem extends CategoryItem {
  children?: CategoryTreeItem[];
}

export interface CategoryTreeResult {
  activeCategoryId: string;
  currentCategory: CategoryItem | null;
  selectedPath: CategoryItem[];
  groups: CategoryTreeItem[];
}
