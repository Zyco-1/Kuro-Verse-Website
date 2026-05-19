'use client';

import { useQuery } from '@tanstack/react-query';
import { getTrendingAnime, getPopularAnime } from '@/lib/api/anilist';
import AnimeCard from '@/components/anime/AnimeCard';
import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useHistory } from '@/hooks/useHistory';

export default function Home() {
  const { history } = useHistory();
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: () => getTrendingAnime(1, 12),
  });

  const { data: popularData, isLoading: popularLoading } = useQuery({
    queryKey: ['popular'],
    queryFn: () => getPopularAnime(1, 12),
  });

  const featured = trendingData?.Page?.media?.[0];

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full flex items-end px-6 md:px-16 pb-12 overflow-hidden">
        {featured && (
          <>
            <div className="absolute inset-0 -z-10">
              <Image
                src={featured.bannerImage || featured.coverImage.extraLarge}
                alt={featured.title.romaji}
                fill
                className="object-cover opacity-40"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-transparent to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-[0.2em]">Trending Now</span>
                <span className="text-white/50 text-sm font-bold">#1 Spotlight</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase text-glow">
                {featured.title.english || featured.title.romaji}
              </h1>
              <p className="text-white/60 line-clamp-3 text-lg font-medium leading-relaxed"
                 dangerouslySetInnerHTML={{ __html: featured.description }} />

              <div className="flex items-center gap-4 mt-4">
                <Link
                  href={`/anime/${featured.id}`}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105 sexy-shadow"
                >
                  <Play fill="white" size={20} /> Watch Now
                </Link>
                <Link
                  href={`/anime/${featured.id}`}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold backdrop-blur-md transition-all"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </section>

      {/* Trending Section */}
      <section className="px-6 md:px-16 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full" />
            Trending Anime
          </h2>
          <Link href="/trending" className="text-white/50 hover:text-primary transition-colors text-sm font-bold flex items-center">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {trendingLoading
            ? [...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 rounded-xl animate-pulse" />
              ))
            : trendingData?.Page?.media?.map((anime: any) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
        </div>
      </section>

      {/* Continue Watching */}
      {history.length > 0 && (
        <section className="px-6 md:px-16 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full" />
              Continue Watching
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {history.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -5 }}
                className="group relative flex flex-col gap-2 cursor-pointer"
              >
                <Link href={`/watch/${item.id}/${item.episode}?paheId=${item.paheId}`}>
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary p-3 rounded-full">
                        <Play fill="white" size={16} className="text-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-bold">
                      EP {item.episode}
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Section */}
      <section className="px-6 md:px-16 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full" />
            Most Popular
          </h2>
          <Link href="/popular" className="text-white/50 hover:text-primary transition-colors text-sm font-bold flex items-center">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {popularLoading
            ? [...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 rounded-xl animate-pulse" />
              ))
            : popularData?.Page?.media?.map((anime: any) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
        </div>
      </section>
    </div>
  );
}
