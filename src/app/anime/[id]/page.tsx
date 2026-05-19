'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnimeDetails } from '@/lib/api/anilist';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Calendar, Clock, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnimeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: anime, isLoading } = useQuery({
    queryKey: ['anime', id],
    queryFn: () => getAnimeDetails(parseInt(id)),
  });

  const { data: paheData, isLoading: paheLoading } = useQuery({
    queryKey: ['pahe-search', anime?.Media?.title?.romaji],
    queryFn: async () => {
      if (!anime?.Media?.title?.romaji) return null;
      const res = await fetch(`/api/animepahe/search?q=${encodeURIComponent(anime.Media.title.romaji)}`);
      const data = await res.json();
      return data?.[0]; // Get first match
    },
    enabled: !!anime,
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const media = anime?.Media;

  return (
    <div className="flex flex-col pb-20">
      {/* Banner */}
      <div className="relative h-[400px] w-full">
        <Image
          src={media.bannerImage || media.coverImage.extraLarge}
          alt={media.title.romaji}
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] to-transparent" />
      </div>

      <div className="px-6 md:px-16 -mt-32 relative z-10 flex flex-col md:flex-row gap-10">
        {/* Cover */}
        <div className="flex-shrink-0 w-64 mx-auto md:mx-0">
          <div className="aspect-[3/4] relative rounded-2xl overflow-hidden sexy-shadow border-4 border-[#0a0a0b]">
            <Image
              src={media.coverImage.extraLarge}
              alt={media.title.romaji}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-6 flex flex-col gap-3">
             {paheData ? (
               <Link
                href={`/watch/${media.id}/1?paheId=${paheData.session}`}
                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black text-center flex items-center justify-center gap-2 sexy-shadow transition-all hover:scale-[1.02]"
              >
                <Play fill="white" size={20} /> WATCH NOW
              </Link>
             ) : (
                <div className="w-full bg-white/5 text-white/50 py-4 rounded-xl font-bold text-center border border-white/5">
                  {paheLoading ? 'FINDING STREAMS...' : 'NO STREAMS FOUND'}
                </div>
             )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-grow flex flex-col gap-6 pt-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none">
              {media.title.english || media.title.romaji}
            </h1>
            <h2 className="text-xl text-white/40 font-bold italic">{media.title.native}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
            <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-400 px-3 py-1.5 rounded-full border border-yellow-400/20">
              <Star size={14} className="fill-yellow-400" />
              {media.averageScore}%
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Calendar size={14} />
              {media.seasonYear}
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Clock size={14} />
              {media.episodes} Episodes
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
              {media.status}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {media.genres.map((genre: string) => (
              <span key={genre} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-default border border-white/5 uppercase">
                {genre}
              </span>
            ))}
          </div>

          <p className="text-white/70 leading-relaxed max-w-4xl text-lg font-medium"
             dangerouslySetInnerHTML={{ __html: media.description }} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-4 pt-8 border-t border-white/5">
            <div>
              <div className="text-white/40 text-xs font-black uppercase mb-1">Format</div>
              <div className="font-bold">{media.format}</div>
            </div>
            <div>
              <div className="text-white/40 text-xs font-black uppercase mb-1">Season</div>
              <div className="font-bold">{media.season} {media.seasonYear}</div>
            </div>
            <div>
              <div className="text-white/40 text-xs font-black uppercase mb-1">Studio</div>
              <div className="font-bold">{media.studios?.nodes?.[0]?.name}</div>
            </div>
             <div>
              <div className="text-white/40 text-xs font-black uppercase mb-1">Duration</div>
              <div className="font-bold">24 min</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
