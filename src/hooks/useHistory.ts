'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'reanime_watched';

export interface WatchedItem {
  id: number;
  episode: number;
  title: string;
  image: string;
  paheId: string;
  updatedAt: number;
}

export function useHistory() {
  const [history, setHistory] = useState<WatchedItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const addToHistory = (item: WatchedItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id);
      const updated = [item, ...filtered].slice(0, 20); // Keep last 20
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { history, addToHistory };
}
