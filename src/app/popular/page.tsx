'use client';

import { useQuery } from '@tanstack/react-query';
import { getKuroTopRated } from '@/lib/api/kuroverse';
import AnimeCard from '@/components/anime/AnimeCard';
import { Heart } from 'lucide-react';

export default function PopularPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['popular-full'],
    queryFn: getKuroTopRated,
  });

  return (
    <div className="px-6 md:px-16 py-12 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
         <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
           <Heart className="text-primary fill-primary" size={32} />
           Top Rated
         </h1>
         <p className="text-white/50 font-bold uppercase tracking-widest text-sm">
           The highest rated anime on KuroVerse
         </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {isLoading
          ? [...Array(24)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 rounded-xl animate-pulse" />
            ))
          : data?.map((anime: any) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
      </div>
    </div>
  );
}
