'use client';

import { use, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getKuroAnimeDetails, getKuroStream } from '@/lib/api/kuro';
import Link from 'next/link';
import { List, Info, Sparkles, RefreshCcw } from 'lucide-react';
import ArtPlayer from '@/components/player/ArtPlayer';
import DisqusComments from '@/components/layout/DisqusComments';
import { useHistory } from '@/hooks/useHistory';
import { cn } from '@/lib/utils';

export default function WatchPage({
  params,
}: {
  params: Promise<{ id: string, episode: string }>
}) {
  const { id, episode: currentEpisode } = use(params);
  const router = useRouter();
  const { addToHistory } = useHistory();
  const [streamType, setStreamType] = useState<'sub' | 'dub'>('sub');

  const { data: detailsData, isLoading: detailsLoading } = useQuery({
    queryKey: ['anime-details-kuro', id],
    queryFn: () => getKuroAnimeDetails(id),
  });

  const { data: streamData, isLoading: streamLoading, refetch: refetchStream } = useQuery({
    queryKey: ['anime-stream-kuro', id, currentEpisode, streamType],
    queryFn: () => getKuroStream(id, currentEpisode, streamType),
  });

  const media = detailsData?.anime;
  const episodes = detailsData?.episodes;

  useEffect(() => {
    if (media) {
      addToHistory({
        id: parseInt(id),
        episode: parseFloat(currentEpisode),
        title: media.title?.english || media.title?.romaji || 'Unknown Anime',
        image: media.coverImage?.large || media.coverImage?.extraLarge || media?.bannerImage,
        updatedAt: Date.now()
      });
    }
  }, [media, currentEpisode, id, addToHistory]);

  const handleEpisodeEnd = useCallback(() => {
    if (!episodes) return;
    const currentIndex = episodes.indexOf(currentEpisode);
    if (currentIndex !== -1 && currentIndex < episodes.length - 1) {
      router.push(`/watch/${id}/${episodes[currentIndex + 1]}`);
    }
  }, [episodes, currentEpisode, id, router]);

  const disqusConfig = useMemo(() => ({
    url: typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '',
    identifier: `anime-${id}`,
    title: media?.title?.english || media?.title?.romaji || 'Anime'
  }), [id, media]);

  const videoUrl = streamData?.stream?.video_url;
  const subtitles = streamData?.stream?.subtitles || [];

  return (
    <div className="flex flex-col gap-8 px-6 md:px-16 py-8">
      <div className="flex items-center gap-2 text-sm font-bold text-white/50 uppercase tracking-widest overflow-hidden">
        <Link href="/" className="hover:text-white transition-colors shrink-0">HOME</Link>
        <span>/</span>
        <Link href={`/anime/${id}`} className="hover:text-white transition-colors truncate max-w-[150px] md:max-w-none">
          {detailsLoading ? '...' : (media?.title?.english || media?.title?.romaji || 'Anime')}
        </Link>
        <span>/</span>
        <span className="text-primary shrink-0">EP {currentEpisode}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-6">
          {streamLoading || detailsLoading ? (
            <div className="w-full aspect-video bg-white/5 rounded-2xl animate-pulse flex items-center justify-center border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
                <div className="flex flex-col items-center gap-4 z-10">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="text-primary font-black text-2xl uppercase tracking-tighter text-glow">
                        Loading Stream...
                    </div>
                </div>
            </div>
          ) : videoUrl ? (
            <ArtPlayer
              key={videoUrl}
              src={videoUrl}
              poster={media?.bannerImage || media?.coverImage?.large}
              title={`${media?.title?.english || media?.title?.romaji} - Episode ${currentEpisode}`}
              subtitles={subtitles}
              audioPreference={streamType}
              onEnded={handleEpisodeEnd}
            />
          ) : (
            <div className="w-full aspect-video bg-white/5 rounded-2xl flex flex-col items-center justify-center text-white/20 font-bold border border-white/5 gap-4">
              <div className="text-4xl font-black uppercase italic tracking-tighter text-primary">COMING SOON</div>
              <p className="text-xs uppercase tracking-widest text-white/40 font-black">This episode or server is not available yet.</p>
              <button onClick={() => refetchStream()} className="bg-primary/10 hover:bg-primary/20 text-primary px-8 py-3 rounded-full border border-primary/20 transition-all font-black text-xs uppercase flex items-center gap-2 mt-4 hover:scale-105">
                  <RefreshCcw size={16} /> Force Reload
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4 bg-white/5 p-8 rounded-2xl border border-white/5 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50 group-hover:h-full transition-all duration-500" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-black uppercase tracking-tight truncate max-w-xl text-glow">
                  {media?.title?.english || media?.title?.romaji}
                </h1>
                <div className="text-xs font-black text-primary uppercase tracking-[0.2em]">Episode {currentEpisode}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                 <div className="flex items-center bg-black/40 rounded-full p-1.5 border border-white/5 shadow-inner">
                   <button
                     onClick={() => setStreamType('sub')}
                     className={cn(
                       "px-6 py-2 rounded-full text-xs font-black uppercase transition-all tracking-widest",
                       streamType === 'sub' ? "bg-primary text-black shadow-lg shadow-primary/20" : "text-white/40 hover:text-white"
                     )}
                   >
                     SUB
                   </button>
                   <button
                     onClick={() => setStreamType('dub')}
                     className={cn(
                       "px-6 py-2 rounded-full text-xs font-black uppercase transition-all tracking-widest",
                       streamType === 'dub' ? "bg-primary text-black shadow-lg shadow-primary/20" : "text-white/40 hover:text-white"
                     )}
                   >
                     DUB
                   </button>
                 </div>
              </div>
            </div>
          </div>

          <DisqusComments
             shortname="kuroverse"
             config={disqusConfig}
          />
        </div>

        <div className="flex flex-col gap-6">
           <div className="bg-white/5 rounded-2xl border border-white/5 flex flex-col overflow-hidden backdrop-blur-md">
             <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
               <h3 className="font-black uppercase tracking-tighter flex items-center gap-2 text-primary">
                 <List size={20} /> Episode List
               </h3>
               <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{`${episodes?.length || 0} EPS`}</span>
             </div>
             <div className="max-h-[600px] overflow-y-auto p-3 flex flex-col gap-2 custom-scrollbar">
               {detailsLoading ? (
                   [...Array(10)].map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)
               ) : (episodes || []).map((ep: string) => (
                 <Link
                   key={ep}
                   href={`/watch/${id}/${ep}`}
                   className={cn(
                     "px-5 py-4 rounded-xl font-black text-xs transition-all flex items-center justify-between group relative overflow-hidden",
                     currentEpisode === ep
                        ? "bg-primary text-black sexy-shadow translate-x-1"
                        : "hover:bg-white/5 text-white/50 hover:text-white hover:translate-x-1"
                   )}
                 >
                   <span className="relative z-10 uppercase tracking-widest">Episode {ep}</span>
                   {currentEpisode === ep && <Sparkles size={14} className="relative z-10" />}
                 </Link>
               ))}
             </div>
           </div>

           <Link href={`/anime/${id}`} className="bg-white/5 hover:bg-white/10 p-6 rounded-2xl border border-white/5 flex items-center gap-5 transition-all group hover:scale-[1.02]">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <Info size={28} className="text-primary" />
              </div>
              <div>
                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Anime Info</div>
                <div className="font-black uppercase tracking-tighter text-lg">View Details</div>
              </div>
           </Link>
        </div>
      </div>
    </div>
  );
}
