'use client';

import { useQuery } from '@tanstack/react-query';
import { getPopular } from '@/lib/api/anilist';
import { Sparkles } from 'lucide-react';
import AnimeCard from '@/components/anime/AnimeCard';

export default function PopularPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['popular-full'],
    queryFn: () => getPopular(1, 24),
  });

  return (
    <div className="px-6 md:px-16 py-12 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
         <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
           <Sparkles className="text-primary" size={32} />
           Most Popular
         </h1>
         <p className="text-white/50 font-bold uppercase tracking-widest text-sm">
           All-time favorites from the community
         </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {isLoading
          ? [...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 rounded-xl animate-pulse" />
            ))
          : data?.map((anime: any) => (
                <AnimeCard key={anime.id} anime={anime} />
            ))}
      </div>
    </div>
  );
}
