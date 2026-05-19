'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchKuro } from '@/lib/api/kuroverse';
import { Search as SearchIcon, Loader2, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
        {data?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {data.map((anime: any) => (
              <motion.div
                key={anime.session}
                whileHover={{ y: -5 }}
                className="group relative flex flex-col gap-2 cursor-pointer"
              >
                 <Link href={`/anime/pahe-${anime.session}`}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                        <Image
                            src={anime.poster}
                            alt={anime.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="bg-primary p-4 rounded-full sexy-shadow transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                <Play fill="black" className="text-black ml-1" size={20} />
                            </div>
                        </div>
                        <div className="absolute bottom-2 left-2 flex gap-1">
                            <span className="bg-primary/90 backdrop-blur-md text-[9px] font-black px-1.5 py-0.5 rounded text-black uppercase tracking-wider">
                                {anime.type}
                            </span>
                        </div>
                    </div>
                    <div className="mt-1">
                        <h3 className="text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors">
                            {anime.title}
                        </h3>
                        <p className="text-[11px] text-white/50 font-medium mt-0.5">
                            {anime.episodes} Episodes
                        </p>
                    </div>
                 </Link>
              </motion.div>
            ))}
          </div>
        ) : debouncedQuery.length > 2 && !isLoading ? (
          <div className="text-center py-20 opacity-50 font-bold">No results found for "{debouncedQuery}"</div>
        ) : (
          <div className="text-center py-20 opacity-30 font-bold text-2xl uppercase tracking-widest italic">Start Typing to search...</div>
        )}
      </div>
    </div>
  );
}
