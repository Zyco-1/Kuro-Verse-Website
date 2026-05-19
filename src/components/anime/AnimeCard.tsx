'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';

interface AnimeCardProps {
  anime: any;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col gap-2 cursor-pointer"
    >
      <Link href={`/anime/${anime.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
          <Image
            src={anime.coverImage.large || anime.coverImage.extraLarge}
            alt={anime.title.romaji}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-primary p-4 rounded-full sexy-shadow transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play fill="black" className="text-black ml-1" />
            </div>
          </div>
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 border border-white/10">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            {anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A'}
          </div>
          <div className="absolute bottom-2 left-2 flex gap-1">
             <span className="bg-primary/90 backdrop-blur-md text-[9px] font-black px-1.5 py-0.5 rounded text-black uppercase tracking-wider">
               {anime.format}
             </span>
          </div>
        </div>
        <div className="mt-1">
          <h3 className="text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {anime.title.english || anime.title.romaji}
          </h3>
          <p className="text-[11px] text-white/50 font-medium mt-0.5">
            {anime.seasonYear} • {anime.episodes ? `${anime.episodes} Eps` : anime.status}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
