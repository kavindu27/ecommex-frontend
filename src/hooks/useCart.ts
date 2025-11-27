import { useEffect, useState } from "react";
import type { CartItem } from "../types";

const STORAGE_KEY = "ecom_cart_v1";

export type UseCartReturn = {
  items: CartItem[];
  add: (item: CartItem) => void;
  update: (uid: string, fields: Partial<CartItem>) => void;
  remove: (uid: string) => void;
  clear: () => void;
  subtotal: number;
};

export default function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (item: CartItem) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.uid === item.uid);
      if (!exists) return [...prev, item];
      return prev.map((p) => (p.uid === item.uid ? { ...p, qty: p.qty + item.qty } : p));
    });
  };

  const update = (uid: string, fields: Partial<CartItem>) => {
    setItems((prev) => prev.map((p) => (p.uid === uid ? { ...p, ...fields } : p)));
  };

  const remove = (uid: string) => {
    setItems((prev) => prev.filter((p) => p.uid !== uid));
  };

  const clear = () => setItems([]);

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);

  return { items, add, update, remove, clear, subtotal };
}
