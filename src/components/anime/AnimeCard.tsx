'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';

interface AnimeCardProps {
  anime: any;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const id = anime.id;
  const session = anime.session;
  const title = anime.title?.english || anime.title?.romaji || anime.title;
  const image = anime.coverImage?.large || anime.coverImage?.extraLarge || anime.poster || anime.image;
  const rating = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : anime.score || 'N/A';
  const format = anime.format || anime.type || 'TV';
  const year = anime.seasonYear || anime.year || '';
  const episodes = anime.episodes ? `${anime.episodes} Eps` : anime.status || '';

  // If we have a session but no ID, we use a prefix to handle it in the details page
  const href = id
    ? `/anime/${id}`
    : session
      ? `/anime/pahe-${session}?title=${encodeURIComponent(typeof title === 'string' ? title : '')}`
      : '#';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col gap-2 cursor-pointer"
    >
      <Link href={href}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
          {image ? (
            <Image
              src={image}
              alt={typeof title === 'string' ? title : 'Anime'}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
             <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/20 uppercase">No Image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-primary p-4 rounded-full sexy-shadow transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play fill="black" className="text-black ml-1" />
            </div>
          </div>
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 border border-white/10">
            <Star size={10} className="text-accent fill-accent" />
            {rating}
          </div>
          <div className="absolute bottom-2 left-2 flex gap-1">
             <span className="bg-primary/90 backdrop-blur-md text-[9px] font-black px-1.5 py-0.5 rounded text-black uppercase tracking-wider">
               {format}
             </span>
          </div>
        </div>
        <div className="mt-1">
          <h3 className="text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-[11px] text-white/50 font-medium mt-0.5">
            {year} {year && episodes ? '•' : ''} {episodes}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
