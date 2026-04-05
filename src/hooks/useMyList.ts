"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type MyListItemType = "agent" | "module";

type MyListItem = {
  type: MyListItemType;
  id: string;
};

const STORAGE_KEY = "mente_ai_my_list";

function keyOf(item: MyListItem) {
  return `${item.type}:${item.id}`;
}

function parseStorage(value: string | null): MyListItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    const out: MyListItem[] = [];
    for (const v of parsed) {
      if (!v || typeof v !== "object") continue;
      const rec = v as { type?: unknown; id?: unknown };
      if ((rec.type === "agent" || rec.type === "module") && typeof rec.id === "string" && rec.id.trim()) {
        out.push({ type: rec.type, id: rec.id.trim() });
      }
    }
    return out;
  } catch {
    return [];
  }
}

export function useMyList() {
  const [items, setItems] = useState<MyListItem[]>([]);

  useEffect(() => {
    setItems(parseStorage(globalThis.localStorage?.getItem(STORAGE_KEY) ?? null));
  }, []);

  const index = useMemo(() => {
    const map = new Set<string>();
    for (const it of items) map.add(keyOf(it));
    return map;
  }, [items]);

  const isInList = useCallback(
    (type: MyListItemType, id: string) => {
      return index.has(`${type}:${id}`);
    },
    [index]
  );

  const toggle = useCallback((type: MyListItemType, id: string) => {
    setItems((prev) => {
      const normalizedId = id.trim();
      const k = `${type}:${normalizedId}`;
      const exists = prev.some((p) => keyOf(p) === k);
      const next = exists ? prev.filter((p) => keyOf(p) !== k) : [...prev, { type, id: normalizedId }];
      try {
        globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (_e) {
        void _e;
      }
      return next;
    });
  }, []);

  return { items, isInList, toggle };
}
