'use client';

import { useQuery } from '@tanstack/react-query';
import { getKuroRecent } from '@/lib/api/kuroverse';
import { queryAniList, GET_TRENDING, GET_POPULAR } from '@/lib/api/anilist';
import Image from 'next/image';
import Link from 'next/link';
import { Play, TrendingUp, Sparkles, Clock, ChevronRight } from 'lucide-react';
import AnimeCard from '@/components/anime/AnimeCard';

export default function Home() {
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-anilist'],
    queryFn: () => queryAniList(GET_TRENDING, { perPage: 12 }),
  });

  const { data: popularData, isLoading: popularLoading } = useQuery({
    queryKey: ['popular-anilist'],
    queryFn: () => queryAniList(GET_POPULAR, { perPage: 12 }),
  });

  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ['recent'],
    queryFn: getKuroRecent,
  });

  const trending = trendingData?.Page?.media;
  const popular = popularData?.Page?.media;
  const featured = trending?.[0];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full px-6 md:px-16 pt-10">
        {featured ? (
          <div className="relative h-full w-full rounded-3xl overflow-hidden sexy-shadow">
            <Image
                src={featured?.bannerImage || featured?.coverImage?.extraLarge || featured?.coverImage?.large || ''}
                alt={featured?.title?.english || featured?.title?.romaji || featured?.title || 'Featured'}
                fill
                className="object-cover opacity-60"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 md:p-16 flex flex-col gap-6 max-w-3xl">
                <div className="flex items-center gap-3">
                    <span className="bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Featured</span>
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">{featured?.format} • {featured?.averageScore}% Score</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none text-glow">
                {featured?.title?.english || featured?.title?.romaji || featured?.title}
                </h1>
                <p className="text-white/60 line-clamp-3 text-lg font-medium leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: featured?.description }} />

                <div className="flex items-center gap-4 mt-4">
                <Link
                  href={`/anime/${featured?.id}`}
                  className="bg-primary text-black px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                    <Play fill="black" size={20} /> WATCH NOW
                </Link>
                </div>
            </div>
          </div>
        ) : (
          <div className="h-full w-full bg-white/5 animate-pulse rounded-3xl" />
        )}
      </section>

      {/* Recent Releases */}
      <section className="px-6 md:px-16 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
              <Clock className="text-primary" /> Recent Releases
            </h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>
          <Link href="/airing" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
            View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {recentLoading
            ? [...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />)
            : recent?.slice(0, 12).map((anime: any) => <AnimeCard key={anime.id || anime.session} anime={anime} />)}
        </div>
      </section>

      {/* Trending Section */}
      <section className="px-6 md:px-16 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
              <TrendingUp className="text-primary" /> Trending Now
            </h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>
           <Link href="/trending" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
            View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {trendingLoading
            ? [...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />)
            : trending?.slice(0, 12).map((anime: any) => <AnimeCard key={anime.id} anime={anime} />)}
        </div>
      </section>

      {/* Popular Section */}
      <section className="px-6 md:px-16 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
              <Sparkles className="text-primary" /> Most Popular
            </h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>
           <Link href="/popular" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
            View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {popularLoading
            ? [...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />)
            : popular?.slice(0, 12).map((anime: any) => <AnimeCard key={anime.id} anime={anime} />)}
        </div>
      </section>
    </div>
  );
}
