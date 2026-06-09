import assert from "node:assert/strict";
import test from "node:test";

import { buildCategoryTree } from "./categoryTree.ts";

const rows = [
  { id: 1, name: "가구", depth: 1, sortOrder: 0, parentId: null },
  { id: 2, name: "침대", depth: 2, sortOrder: 0, parentId: 1 },
  { id: 3, name: "침대프레임", depth: 3, sortOrder: 0, parentId: 2 },
  { id: 4, name: "일반침대", depth: 4, sortOrder: 0, parentId: 3 },
  { id: 5, name: "수납침대", depth: 4, sortOrder: 1, parentId: 3 },
  { id: 6, name: "소파", depth: 2, sortOrder: 1, parentId: 1 },
  { id: 34, name: "가전·디지털", depth: 1, sortOrder: 1, parentId: null },
  { id: 35, name: "청소기", depth: 2, sortOrder: 0, parentId: 34 },
];

test("buildCategoryTree returns all root categories with nested children", () => {
  const result = buildCategoryTree(rows, 1);

  assert.equal(result.currentCategory?.label, "가구");
  assert.deepEqual(result.groups, [
    {
      id: "1",
      label: "가구",
      children: [
        {
          id: "2",
          label: "침대",
          children: [
            {
              id: "3",
              label: "침대프레임",
              children: [
                { id: "4", label: "일반침대" },
                { id: "5", label: "수납침대" },
              ],
            },
          ],
        },
        {
          id: "6",
          label: "소파",
        },
      ],
    },
    {
      id: "34",
      label: "가전·디지털",
      children: [
        {
          id: "35",
          label: "청소기",
        },
      ],
    },
  ]);
});

test("buildCategoryTree falls back to the first root when selected id is missing", () => {
  const result = buildCategoryTree(rows, 999);

  assert.equal(result.currentCategory?.id, "1");
  assert.equal(result.activeCategoryId, "1");
});

test("buildCategoryTree returns selected category path from root to selected category", () => {
  const result = buildCategoryTree(rows, 4);

  assert.equal(result.currentCategory?.id, "4");
  assert.equal(result.activeCategoryId, "1");
  assert.deepEqual(result.selectedPath, [
    { id: "1", label: "가구" },
    { id: "2", label: "침대" },
    { id: "3", label: "침대프레임" },
    { id: "4", label: "일반침대" },
  ]);
});
