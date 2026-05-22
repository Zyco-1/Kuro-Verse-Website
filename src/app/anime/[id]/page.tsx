'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getKuroAnimeDetails } from '@/lib/api/kuro';
import { getReAnimeThumbnails } from '@/lib/api/reanime';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Calendar, Clock, RefreshCcw } from 'lucide-react';

export default function AnimeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['anime-details-kuro', id],
    queryFn: () => getKuroAnimeDetails(id),
    retry: 1
  });

  const { data: thumbnailsData } = useQuery({
    queryKey: ['anime-thumbnails', id],
    queryFn: () => getReAnimeThumbnails(id),
    enabled: !!data,
  });

  const media = data?.anime;
  const episodes = data?.episodes;
  const thumbnails = thumbnailsData?.thumbnails || {};

  if (isLoading) {
      return <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="font-black uppercase tracking-widest text-primary animate-pulse">Loading Details...</div>
        </div>
      </div>;
  }

  if (error || !media) {
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
            <div className="text-primary text-6xl font-black uppercase italic">404</div>
            <div className="text-2xl font-black uppercase tracking-tighter">
                Anime Not Found
            </div>
            <p className="text-white/40 font-bold max-w-sm">
                We couldn't retrieve the details for this anime. It might be missing from the database.
            </p>
            <button onClick={() => refetch()} className="bg-primary text-black px-8 py-3 rounded-full font-black flex items-center gap-2 hover:scale-105 transition-all">
                <RefreshCcw size={20} /> RETRY
            </button>
        </div>
    );
  }

  return (
    <div className="flex flex-col pb-20">
      <div className="relative h-[400px] w-full">
        <Image
          src={media?.bannerImage || media?.coverImage?.extraLarge || media?.coverImage?.large}
          alt={media.title?.romaji || media.title?.english || 'Anime'}
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="px-6 md:px-16 -mt-32 relative z-10 flex flex-col md:flex-row gap-10">
        <div className="flex-shrink-0 w-64 mx-auto md:mx-0">
          <div className="aspect-[3/4] relative rounded-2xl overflow-hidden sexy-shadow border-4 border-background">
            <Image
              src={media?.coverImage?.extraLarge || media?.coverImage?.large}
              alt={media.title?.romaji || media.title?.english || 'Anime'}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-6 flex flex-col gap-3">
             {episodes && episodes.length > 0 ? (
               <Link
                href={`/watch/${id}/${episodes[0]}`}
                className="w-full bg-primary hover:bg-primary/90 text-black py-4 rounded-xl font-black text-center flex items-center justify-center gap-2 sexy-shadow transition-all hover:scale-[1.02]"
              >
                <Play fill="black" size={20} /> WATCH NOW
              </Link>
             ) : (
                <div className="w-full bg-white/5 text-white/40 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-center border border-white/5">
                  Coming Soon
                </div>
             )}
          </div>
        </div>

        <div className="flex-grow flex flex-col gap-6 pt-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none text-glow">
              {media.title?.english || media.title?.romaji}
            </h1>
            <h2 className="text-xl text-white/40 font-bold italic">{media.title?.native}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
            <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full border border-accent/20">
              <Star size={14} className="fill-accent" />
              {media?.averageScore ? (media.averageScore / 10).toFixed(1) : 'N/A'}/10
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Calendar size={14} />
              {media?.season} {media?.seasonYear}
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Clock size={14} />
              {media?.episodes} Episodes
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
              {media?.status}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {media?.genres?.map((genre: string) => (
              <span key={genre} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-default border border-white/5 uppercase">
                {genre}
              </span>
            ))}
          </div>

          <p className="text-white/70 leading-relaxed max-w-4xl text-lg font-medium"
             dangerouslySetInnerHTML={{ __html: media?.description }} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-4 pt-8 border-t border-white/5">
            <div>
              <div className="text-white/40 text-xs font-black uppercase mb-1">Format</div>
              <div className="font-bold">{media?.format || 'TV'}</div>
            </div>
            <div>
              <div className="text-white/40 text-xs font-black uppercase mb-1">Season</div>
              <div className="font-bold">{media?.season || 'N/A'}</div>
            </div>
            <div>
              <div className="text-white/40 text-xs font-black uppercase mb-1">Duration</div>
              <div className="font-bold">{media?.duration} min</div>
            </div>
             <div>
              <div className="text-white/40 text-xs font-black uppercase mb-1">Status</div>
              <div className="font-bold">{media?.status}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Episode List Section */}
      <section className="px-6 md:px-16 mt-20 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black uppercase tracking-tight">Episodes</h2>
          <span className="text-sm font-black text-white/40 uppercase tracking-widest">{episodes?.length || 0} Total</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {episodes?.map((ep: string) => (
                <Link
                    key={ep}
                    href={`/watch/${id}/${ep}`}
                    className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/5 transition-all hover:scale-[1.02] hover:border-primary/50"
                >
                    <div className="aspect-video relative overflow-hidden">
                        <Image
                            src={thumbnails[ep] ? thumbnails[ep] : media?.bannerImage || media?.coverImage?.large}
                            alt={`Episode ${ep}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play fill="white" size={32} />
                        </div>
                        <div className="absolute bottom-3 right-3 bg-primary text-black px-3 py-1 rounded-lg font-black text-xs">
                            EP {ep}
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="font-black uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                            Episode {ep}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
