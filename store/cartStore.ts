import { create } from "zustand";

interface CartStore {
  count: number;
  setCount: (count: number) => void;
  increment: () => void;
  decrement: (by?: number) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: (by = 1) => set((state) => ({ count: Math.max(0, state.count - by) })),
}));
