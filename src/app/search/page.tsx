'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchKuro } from '@/lib/api/kuro';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import AnimeCard from '@/components/anime/AnimeCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ['search-kuro', debouncedQuery],
    queryFn: () => searchKuro(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  });

  return (
    <div className="px-6 md:px-16 py-12 flex flex-col gap-12 items-center min-h-[70vh]">
      <div className="flex flex-col gap-6 w-full max-w-2xl text-center">
        <h1 className="text-5xl font-black uppercase tracking-tight text-glow text-primary italic">Explore</h1>
        <div className="relative">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" size={24} />
          <input
            type="text"
            placeholder="Search for your next favorite anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-xl font-bold sexy-shadow"
          />
          {isLoading && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          )}
        </div>
      </div>

      <div className="w-full">
        {data?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {data.map((anime: any) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : debouncedQuery.length > 2 && !isLoading ? (
          <div className="text-center py-20 opacity-50 font-black uppercase tracking-widest">No results found for "{debouncedQuery}"</div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 opacity-20 gap-4">
             <SearchIcon size={80} />
             <div className="font-black text-3xl uppercase tracking-[0.2em] italic">Search KuroVerse</div>
          </div>
        )}
      </div>
    </div>
  );
}
