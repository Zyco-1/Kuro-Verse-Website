'use client';

import { useQuery } from '@tanstack/react-query';
import { getAiringSchedule } from '@/lib/api/anilist';
import { motion } from 'framer-motion';
import { Calendar, Clock, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function AiringPage() {
  const [dayOffset, setDayOffset] = useState(0);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset + 1);

  const startTime = Math.floor(startOfDay.getTime() / 1000);
  const endTime = Math.floor(endOfDay.getTime() / 1000);

  const { data, isLoading } = useQuery({
    queryKey: ['airing', dayOffset],
    queryFn: () => getAiringSchedule(startTime, endTime),
  });

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[startOfDay.getDay()];

  return (
    <div className="px-6 md:px-16 py-12 flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
           <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
             <Calendar className="text-primary" size={32} />
             Airing Schedule
           </h1>
           <p className="text-white/50 font-bold uppercase tracking-widest text-sm">
             {currentDay}, {startOfDay.toLocaleDateString()}
           </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 overflow-x-auto">
          {[-1, 0, 1, 2, 3, 4, 5].map((offset) => {
            const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
            const isSelected = dayOffset === offset;
            return (
              <button
                key={offset}
                onClick={() => setDayOffset(offset)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
                  isSelected ? 'bg-primary text-white sexy-shadow' : 'hover:bg-white/5 text-white/40'
                }`}
              >
                {offset === 0 ? 'Today' : days[date.getDay()].slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(9)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
          ))
        ) : data?.Page?.airingSchedules?.length > 0 ? (
          data.Page.airingSchedules.map((item: any) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 p-4 flex items-center gap-4 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="relative w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={item.media.coverImage.large}
                  alt={item.media.title.romaji}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1 flex-grow overflow-hidden">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-1.5 text-primary font-black text-[10px] uppercase tracking-widest">
                     <Clock size={12} />
                     {new Date(item.airingAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                   <div className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">
                     EP {item.episode}
                   </div>
                </div>
                <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {item.media.title.english || item.media.title.romaji}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                   {item.media.genres.slice(0, 2).map((g: string) => (
                     <span key={g} className="text-[9px] font-bold text-white/30 uppercase">{g}</span>
                   ))}
                </div>
                <Link
                  href={`/anime/${item.media.id}`}
                  className="mt-2 flex items-center gap-1 text-[10px] font-black uppercase text-white/50 hover:text-white transition-colors"
                >
                  View Details <Play size={10} className="fill-current" />
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-white/20 font-black text-2xl uppercase italic">
            No airing anime found for this day
          </div>
        )}
      </div>
    </div>
  );
}
