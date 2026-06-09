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

const getCategoryPath = (category: CategoryNode | undefined, nodes: Map<number, CategoryNode>) => {
  const path: CategoryItem[] = [];
  let current = category;

  while (current) {
    path.unshift(toItem(current));
    current = current.parentId === null ? undefined : nodes.get(current.parentId);
  }

  return path;
};

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
  const selectedCategory = nodes.get(selectedCategoryId) ?? roots[0];
  const selectedPath = getCategoryPath(selectedCategory, nodes);
  const root = selectedPath.length > 0 ? nodes.get(Number(selectedPath[0].id)) : undefined;

  return {
    activeCategoryId: root ? String(root.id) : "",
    currentCategory: selectedCategory ? toItem(selectedCategory) : null,
    selectedPath,
    groups: toTreeItems(roots),
  };
};
