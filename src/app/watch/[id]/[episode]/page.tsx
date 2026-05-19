'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnimeDetails } from '@/lib/api/anilist';
import Player from '@/components/player/Player';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, List, Info, Share2, Download, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHistory } from '@/hooks/useHistory';
import DisqusComments from '@/components/layout/DisqusComments';

export default function WatchPage({ params }: { params: Promise<{ id: string; episode: string }> }) {
  const { id, episode } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const paheId = searchParams.get('paheId');

  const [currentEpisode, setCurrentEpisode] = useState(episode);
  const [autoNext, setAutoNext] = useState(true);
  const { addToHistory } = useHistory();

  const { data: anime } = useQuery({
    queryKey: ['anime', id],
    queryFn: () => getAnimeDetails(parseInt(id)),
  });

  const { data: episodesData } = useQuery({
    queryKey: ['episodes', paheId],
    queryFn: async () => {
      const res = await fetch(`/api/animepahe/episodes?id=${paheId}`);
      return await res.json();
    },
    enabled: !!paheId,
  });

  const episodeSession = episodesData?.data?.find((ep: any) => ep.episode === parseFloat(currentEpisode))?.session;

  const { data: streamData, isLoading: streamLoading } = useQuery({
    queryKey: ['stream', paheId, episodeSession],
    queryFn: async () => {
      const res = await fetch(`/api/animepahe/stream?animeId=${paheId}&episodeId=${episodeSession}`);
      return await res.json();
    },
    enabled: !!paheId && !!episodeSession,
  });

  const streamUrl = streamData?.sources?.[0]?.url;

  const handleEpisodeEnd = useCallback(() => {
    if (!autoNext || !episodesData) return;

    // Sort episodes in ascending order to find the next one correctly
    const sortedEps = [...episodesData.data].sort((a: any, b: any) => a.episode - b.episode);
    const currentIndex = sortedEps.findIndex((ep: any) => ep.episode === parseFloat(currentEpisode));

    if (currentIndex !== -1 && currentIndex < sortedEps.length - 1) {
      const nextEp = sortedEps[currentIndex + 1];
      router.push(`/watch/${id}/${nextEp.episode}?paheId=${paheId}`);
    }
  }, [autoNext, episodesData, currentEpisode, id, paheId, router]);

  useEffect(() => {
    if (anime?.Media && paheId) {
      addToHistory({
        id: parseInt(id),
        episode: parseInt(currentEpisode),
        title: anime.Media.title.english || anime.Media.title.romaji,
        image: anime.Media.coverImage.large,
        paheId: paheId,
        updatedAt: Date.now()
      });
    }
  }, [anime, currentEpisode, paheId, id, addToHistory]);

  return (
    <div className="flex flex-col gap-8 px-6 md:px-16 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-bold text-white/50">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <Link href={`/anime/${id}`} className="hover:text-white transition-colors uppercase truncate max-w-[200px]">
          {anime?.Media?.title?.english || anime?.Media?.title?.romaji}
        </Link>
        <span>/</span>
        <span className="text-primary">EPISODE {currentEpisode}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-6">
          {streamLoading ? (
            <div className="w-full aspect-video bg-white/5 rounded-2xl animate-pulse flex items-center justify-center">
              <div className="text-white/20 font-black text-3xl animate-bounce">LOADING STREAM...</div>
            </div>
          ) : streamUrl ? (
            <Player
              src={streamUrl}
              poster={anime?.Media?.bannerImage}
              title={`Episode ${currentEpisode}`}
              onEnded={handleEpisodeEnd}
            />
          ) : (
            <div className="w-full aspect-video bg-white/5 rounded-2xl flex items-center justify-center text-white/20 font-bold border border-white/5">
              NO STREAM FOUND FOR THIS EPISODE
            </div>
          )}

          <div className="flex flex-col gap-4 bg-white/5 p-8 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black uppercase tracking-tight truncate">
                {anime?.Media?.title?.english || anime?.Media?.title?.romaji} - Episode {currentEpisode}
              </h1>
              <div className="flex items-center gap-3">
                <button className="p-3 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors border border-white/5">
                  <Share2 size={20} />
                </button>
                <button className="p-3 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors border border-white/5">
                  <Download size={20} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-black border border-primary/20">
                  SUB
                </div>
                <div className="text-white/50 font-bold text-sm">
                  {anime?.Media?.seasonYear} • {anime?.Media?.format}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <span className="text-[10px] font-black uppercase text-white/40 group-hover:text-white transition-colors">Auto Next</span>
                  <div
                    onClick={() => setAutoNext(!autoNext)}
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-all",
                      autoNext ? "bg-primary" : "bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                      autoNext ? "left-6" : "left-1"
                    )} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <DisqusComments
             shortname="reanime-1"
             config={{
               url: typeof window !== 'undefined' ? window.location.href : '',
               identifier: `anime-${id}`,
               title: anime?.Media?.title?.english || anime?.Media?.title?.romaji || 'Anime'
             }}
          />
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
           <div className="bg-white/5 rounded-2xl border border-white/5 flex flex-col overflow-hidden">
             <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
               <h3 className="font-black uppercase tracking-tighter flex items-center gap-2">
                 <List size={18} /> Episode List
               </h3>
               <span className="text-xs font-bold text-white/30">{episodesData?.total || 0} EPS</span>
             </div>
             <div className="max-h-[600px] overflow-y-auto p-2 flex flex-col gap-1">
               {[...(episodesData?.data || [])].sort((a: any, b: any) => a.episode - b.episode).map((ep: any) => (
                 <Link
                   key={ep.episode}
                   href={`/watch/${id}/${ep.episode}?paheId=${paheId}`}
                   className={cn(
                     "px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between group",
                     parseFloat(currentEpisode) === ep.episode
                        ? "bg-primary text-black sexy-shadow"
                        : "hover:bg-white/5 text-white/50 hover:text-white"
                   )}
                 >
                   <span>Episode {ep.episode}</span>
                   {ep.snapshot && (
                     <div className="w-16 h-10 relative rounded-md overflow-hidden bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                        <img src={ep.snapshot} className="object-cover w-full h-full" alt="" />
                     </div>
                   )}
                 </Link>
               ))}
             </div>
           </div>

           <Link href={`/anime/${id}`} className="bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/5 flex items-center gap-4 transition-all">
              <Info size={24} className="text-primary" />
              <div>
                <div className="text-xs font-black text-white/40 uppercase tracking-widest">More Info</div>
                <div className="font-bold">View Detail Page</div>
              </div>
           </Link>
        </div>
      </div>
    </div>
  );
}
