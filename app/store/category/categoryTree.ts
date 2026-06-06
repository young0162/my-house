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
  groups: CategoryTreeItem[];
}

interface CategoryNode extends CategoryRow {
  children: CategoryNode[];
}

const toItem = (category: CategoryNode): CategoryItem => ({
  id: String(category.id),
  label: category.name,
});

const sortCategories = (categories: CategoryNode[]) =>
  [...categories].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

const toTreeItems = (children: CategoryNode[]): CategoryTreeItem[] =>
  sortCategories(children).map((category) => ({
    ...toItem(category),
    ...(category.children.length > 0 && {
      children: toTreeItems(category.children),
    }),
  }));

export const buildCategoryTree = (categories: CategoryRow[], selectedCategoryId: number): CategoryTreeResult => {
  const nodes = new Map<number, CategoryNode>();

  categories.forEach((category) => {
    nodes.set(category.id, { ...category, children: [] });
  });

  nodes.forEach((category) => {
    if (category.parentId === null) return;

    const parent = nodes.get(category.parentId);
    parent?.children.push(category);
  });

  const roots = sortCategories([...nodes.values()].filter((category) => category.parentId === null));
  const selectedRoot = nodes.get(selectedCategoryId);
  const root = selectedRoot?.parentId === null ? selectedRoot : roots[0];

  return {
    activeCategoryId: root ? String(root.id) : "",
    currentCategory: root ? toItem(root) : null,
    groups: toTreeItems(roots),
  };
};
