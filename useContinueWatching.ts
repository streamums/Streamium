import { useState, useCallback } from "react";
import type { MediaType } from "@/lib/tmdb";

const KEY = "streamium_continue";
const MAX = 20;

export interface WatchEntry {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  season?: number;
  episode?: number;
  timestamp: number;
}

function load(): WatchEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function useContinueWatching() {
  const [list, setList] = useState<WatchEntry[]>(load);

  const save = useCallback((items: WatchEntry[]) => {
    localStorage.setItem(KEY, JSON.stringify(items));
    setList(items);
  }, []);

  const push = useCallback(
    (entry: Omit<WatchEntry, "timestamp">) => {
      const current = load().filter((e) => e.id !== entry.id);
      const next = [{ ...entry, timestamp: Date.now() }, ...current].slice(0, MAX);
      save(next);
    },
    [save]
  );

  const remove = useCallback(
    (id: number) => {
      save(load().filter((e) => e.id !== id));
    },
    [save]
  );

  const clear = useCallback(() => save([]), [save]);

  return { list, push, remove, clear };
}
