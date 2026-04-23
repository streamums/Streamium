import { useState, useCallback } from "react";
import type { Media } from "@/lib/tmdb";

const KEY = "streamium_watchlist";

function load(): Media[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [list, setList] = useState<Media[]>(load);

  const save = useCallback((items: Media[]) => {
    localStorage.setItem(KEY, JSON.stringify(items));
    setList(items);
  }, []);

  const add = useCallback(
    (item: Media) => {
      const current = load();
      if (!current.find((m) => m.id === item.id)) {
        save([item, ...current]);
      }
    },
    [save]
  );

  const remove = useCallback(
    (id: number) => {
      save(load().filter((m) => m.id !== id));
    },
    [save]
  );

  const isInList = useCallback(
    (id: number) => list.some((m) => m.id === id),
    [list]
  );

  const toggle = useCallback(
    (item: Media) => {
      if (isInList(item.id)) remove(item.id);
      else add(item);
    },
    [add, remove, isInList]
  );

  return { list, add, remove, toggle, isInList };
}
