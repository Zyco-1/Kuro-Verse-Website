'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchAnime } from '@/lib/api/anilist';
import AnimeCard from '@/components/anime/AnimeCard';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchAnime(debouncedQuery, 1, 24),
    enabled: debouncedQuery.length > 2,
  });

  return (
    <div className="px-6 md:px-16 py-12 flex flex-col gap-12">
      <div className="flex flex-col gap-4 max-w-2xl">
        <h1 className="text-4xl font-black uppercase tracking-tight">Search</h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
          <input
            type="text"
            placeholder="Search for anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg font-medium"
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="animate-spin text-primary" size={20} />
            </div>
          )}
        </div>
      </div>

      <div>
        {data?.Page?.media?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {data.Page.media.map((anime: any) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : debouncedQuery.length > 2 ? (
          <div className="text-center py-20 opacity-50 font-bold">No results found for "{debouncedQuery}"</div>
        ) : (
          <div className="text-center py-20 opacity-30 font-bold text-2xl uppercase tracking-widest italic">Start Typing to search...</div>
        )}
      </div>
    </div>
  );
}
