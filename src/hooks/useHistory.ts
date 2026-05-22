'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'kuroverse_watched';

export interface HistoryItem {
  id: string | number;
  episode: number;
  title: string;
  image: string;
  updatedAt: number;
}

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const addToHistory = (item: HistoryItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id);
      const newHistory = [item, ...filtered].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  return { history, addToHistory };
};
