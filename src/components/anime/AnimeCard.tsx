'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getAniListMediaByTitle } from '@/lib/api/anilist';

export default function AnimeCard({ anime }: { anime: any }) {
  const isKuroOnly = !anime?.id && (anime?.session || anime?.episode);

  // Extract title correctly whether it's an object or a string
  const kuroTitle = typeof anime?.title === 'string'
    ? anime.title
    : (anime?.title?.romaji || anime?.title?.english || anime?.title?.native || 'Unknown');

  const { data: aniListData, isLoading: isMetadataLoading } = useQuery({
    queryKey: ['anilist-metadata', kuroTitle],
    queryFn: () => getAniListMediaByTitle(kuroTitle),
    enabled: isKuroOnly && kuroTitle !== 'Unknown',
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const displayAnime = aniListData || anime;

  const title = typeof displayAnime?.title === 'object'
    ? (displayAnime?.title?.english || displayAnime?.title?.romaji || displayAnime?.title?.native)
    : (displayAnime?.title || kuroTitle);

  const image = displayAnime?.coverImage?.large || displayAnime?.coverImage?.extraLarge || anime?.poster || anime?.image || '/placeholder.png';
  const rating = displayAnime?.averageScore || displayAnime?.score || 'N/A';
  const id = displayAnime?.id;
  const session = anime?.session;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative flex flex-col gap-3"
    >
      <Link
        href={id ? `/anime/${id}` : (session ? `/anime/pahe-${session}?title=${encodeURIComponent(title || '')}` : '#')}
        className="aspect-[3/4] relative rounded-2xl overflow-hidden sexy-shadow block bg-white/5"
      >
        <Image
          src={image}
          alt={title || 'Anime'}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
           <div className="w-14 h-14 bg-primary text-black rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl shadow-primary/50">
              <Play fill="black" size={28} className="ml-1" />
           </div>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
          <Star size={12} className="text-accent fill-accent" />
          <span className="text-[10px] font-black">
              {isMetadataLoading && isKuroOnly ? '...' : rating}
          </span>
        </div>
        {anime?.episode && (
            <div className="absolute bottom-3 right-3 bg-primary text-black px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest">
                EP {anime.episode}
            </div>
        )}
      </Link>

      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-black text-sm uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
           <span>{displayAnime?.format || displayAnime?.type || 'TV'}</span>
           <span>{displayAnime?.seasonYear || displayAnime?.year || ''}</span>
        </div>
      </div>
    </motion.div>
  );
}
