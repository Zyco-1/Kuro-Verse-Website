'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnimeCard({ anime }: { anime: any }) {
  const title = anime?.title?.english || anime?.title?.romaji || anime?.title || 'Unknown Anime';
  const image = anime?.coverImage?.large || anime?.coverImage?.extraLarge || anime?.poster || anime?.image;
  const rating = anime?.averageScore || anime?.score || 'N/A';
  const id = anime?.id;
  const session = anime?.session;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative flex flex-col gap-3"
    >
      <Link
        href={id ? `/anime/${id}` : `/anime/pahe-${session}?title=${encodeURIComponent(title)}`}
        className="aspect-[3/4] relative rounded-2xl overflow-hidden sexy-shadow block"
      >
        <Image
          src={image || '/placeholder.png'}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
           <div className="w-14 h-14 bg-primary text-black rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl shadow-primary/50">
              <Play fill="black" size={28} className="ml-1" />
           </div>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
          <Star size={12} className="text-accent fill-accent" />
          <span className="text-[10px] font-black">{rating}</span>
        </div>
      </Link>

      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-black text-sm uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
           <span>{anime?.format || anime?.type || 'TV'}</span>
           <span>{anime?.seasonYear || anime?.year || ''}</span>
        </div>
      </div>
    </motion.div>
  );
}
