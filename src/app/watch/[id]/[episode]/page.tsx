'use client';

import { use, useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getKuroEpisodes, getKuroStream } from '@/lib/api/kuroverse';
import { getAniListMedia } from '@/lib/api/anilist';
import Player from '@/components/player/Player';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { List, Info, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHistory } from '@/hooks/useHistory';
import DisqusComments from '@/components/layout/DisqusComments';

export default function WatchPage({ params }: { params: Promise<{ id: string; episode: string }> }) {
  const { id, episode } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const paheId = searchParams.get('paheId');

  const currentEpisode = episode;
  const [autoNext, setAutoNext] = useState(true);
  const [streamType, setStreamType] = useState<'sub' | 'dub'>('sub');
  const [quality, setQuality] = useState<string | null>(null);
  const { addToHistory } = useHistory();

  const { data: media, isLoading: mediaLoading } = useQuery({
    queryKey: ['anime-details-anilist', id],
    queryFn: () => getAniListMedia(id),
  });

  const { data: episodesData, isLoading: episodesLoading } = useQuery({
    queryKey: ['kuro-episodes', paheId],
    queryFn: () => getKuroEpisodes(paheId!),
    enabled: !!paheId,
  });

  const episodeSession = useMemo(() => {
    return episodesData?.find((ep: any) => ep.episode === parseFloat(currentEpisode))?.session;
  }, [episodesData, currentEpisode]);

  const { data: streamData, isLoading: streamLoading, refetch: refetchStream } = useQuery({
    queryKey: ['kuro-stream', paheId, episodeSession, streamType],
    queryFn: () => getKuroStream(paheId!, episodeSession, streamType),
    enabled: !!paheId && !!episodeSession,
  });

  const sortedStreams = useMemo(() => {
    return streamData?.streams?.sort((a: any, b: any) => parseInt(b.quality) - parseInt(a.quality)) || [];
  }, [streamData]);

  useEffect(() => {
    if (sortedStreams.length > 0) {
      setQuality(sortedStreams[0].url);
    }
  }, [sortedStreams]);

  const streamUrl = quality || sortedStreams[0]?.url;

  const handleEpisodeEnd = useCallback(() => {
    if (!autoNext || !episodesData) return;

    const sortedEps = [...episodesData].sort((a: any, b: any) => a.episode - b.episode);
    const currentIndex = sortedEps.findIndex((ep: any) => ep.episode === parseFloat(currentEpisode));

    if (currentIndex !== -1 && currentIndex < sortedEps.length - 1) {
      const nextEp = sortedEps[currentIndex + 1];
      router.push(`/watch/${id}/${nextEp.episode}?paheId=${paheId}`);
    }
  }, [autoNext, episodesData, currentEpisode, id, paheId, router]);

  useEffect(() => {
    if (media && paheId) {
      addToHistory({
        id: parseInt(id),
        episode: parseFloat(currentEpisode),
        title: media.title?.english || media.title?.romaji || media.title || 'Unknown Anime',
        image: media.coverImage?.large || media.coverImage?.medium || media?.bannerImage,
        paheId: paheId,
        updatedAt: Date.now()
      });
    }
  }, [media, currentEpisode, paheId, id, addToHistory]);

  const disqusConfig = useMemo(() => ({
    url: typeof window !== 'undefined' ? window.location.origin + window.location.pathname + `?paheId=${paheId}` : '',
    identifier: `anime-${id}`,
    title: media?.title?.english || media?.title?.romaji || media?.title || 'Anime'
  }), [id, media, paheId]);

  if (!paheId) {
      return (
          <div className="h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
              <div className="text-primary text-4xl font-black uppercase">SESSION MISSING</div>
              <p className="text-white/40 font-bold max-w-sm">No streaming session was provided. Please go back to the details page and click Watch Now again.</p>
              <Link href={`/anime/${id}`} className="bg-primary text-black px-8 py-3 rounded-full font-black uppercase">Back to Details</Link>
          </div>
      )
  }

  return (
    <div className="flex flex-col gap-8 px-6 md:px-16 py-8">
      <div className="flex items-center gap-2 text-sm font-bold text-white/50 uppercase tracking-widest overflow-hidden">
        <Link href="/" className="hover:text-white transition-colors shrink-0">HOME</Link>
        <span>/</span>
        <Link href={`/anime/${id}`} className="hover:text-white transition-colors truncate max-w-[150px] md:max-w-none">
          {mediaLoading ? '...' : (media?.title?.english || media?.title?.romaji || media?.title || 'Anime')}
        </Link>
        <span>/</span>
        <span className="text-primary shrink-0">EP {currentEpisode}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-6">
          {streamLoading || episodesLoading ? (
            <div className="w-full aspect-video bg-white/5 rounded-2xl animate-pulse flex items-center justify-center border border-white/5">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <div className="text-primary font-black text-2xl animate-pulse uppercase tracking-tighter">FETCHING STREAM...</div>
              </div>
            </div>
          ) : streamUrl ? (
            <Player
              key={streamUrl}
              src={streamUrl}
              poster={media?.bannerImage || media?.coverImage?.large}
              title={`Episode ${currentEpisode}`}
              onEnded={handleEpisodeEnd}
            />
          ) : (
            <div className="w-full aspect-video bg-white/5 rounded-2xl flex flex-col items-center justify-center text-white/20 font-bold border border-white/5 gap-4">
              <div className="text-3xl font-black uppercase italic">STREAM NOT FOUND</div>
              <button onClick={() => refetchStream()} className="bg-primary/10 hover:bg-primary/20 text-primary px-6 py-2 rounded-full border border-primary/20 transition-all font-black text-xs uppercase flex items-center gap-2">
                  <RefreshCcw size={14} /> Retry Fetch
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4 bg-white/5 p-8 rounded-2xl border border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-black uppercase tracking-tight truncate max-w-xl">
                {media?.title?.english || media?.title?.romaji} - Episode {currentEpisode}
              </h1>
              <div className="flex items-center gap-3 shrink-0">
                 <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/5">
                   <button
                     onClick={() => setStreamType('sub')}
                     className={cn(
                       "px-4 py-1.5 rounded-full text-xs font-black uppercase transition-all",
                       streamType === 'sub' ? "bg-primary text-black" : "text-white/40 hover:text-white"
                     )}
                   >
                     SUB
                   </button>
                   <button
                     onClick={() => setStreamType('dub')}
                     className={cn(
                       "px-4 py-1.5 rounded-full text-xs font-black uppercase transition-all",
                       streamType === 'dub' ? "bg-primary text-black" : "text-white/40 hover:text-white"
                     )}
                   >
                     DUB
                   </button>
                 </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 border-t border-white/5 pt-4">
              <div className="flex items-center gap-6">
                {sortedStreams.length > 0 && (
                   <select
                    value={quality || ''}
                    onChange={(e) => setQuality(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer hover:bg-white/10 transition-all"
                   >
                     {sortedStreams.map((s: any) => (
                       <option key={s.url} value={s.url}>{s.quality}p ({s.filesize})</option>
                     ))}
                   </select>
                )}
                <div className="text-white/50 font-bold text-sm hidden md:block">
                  {media?.seasonYear} • {media?.format}
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
             shortname="kuroverse"
             config={disqusConfig}
          />
        </div>

        <div className="flex flex-col gap-6">
           <div className="bg-white/5 rounded-2xl border border-white/5 flex flex-col overflow-hidden">
             <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
               <h3 className="font-black uppercase tracking-tighter flex items-center gap-2">
                 <List size={18} /> Episode List
               </h3>
               <span className="text-xs font-bold text-primary tracking-widest">{episodesData?.length || 0} EPS</span>
             </div>
             <div className="max-h-[600px] overflow-y-auto p-2 flex flex-col gap-1">
               {episodesLoading ? (
                   [...Array(10)].map((_, i) => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)
               ) : (episodesData || []).slice().sort((a: any, b: any) => a.episode - b.episode).map((ep: any) => (
                 <Link
                   key={ep.episode}
                   href={`/watch/${id}/${ep.episode}?paheId=${paheId}`}
                   className={cn(
                     "px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between group",
                     parseFloat(currentEpisode) === ep.episode
                        ? "bg-primary text-black sexy-shadow scale-[1.02]"
                        : "hover:bg-white/5 text-white/50 hover:text-white"
                   )}
                 >
                   <span>Episode {ep.episode}</span>
                 </Link>
               ))}
             </div>
           </div>

           <Link href={`/anime/${id}`} className="bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/5 flex items-center gap-4 transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Info size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Information</div>
                <div className="font-black uppercase tracking-tight">View Details</div>
              </div>
           </Link>
        </div>
      </div>
    </div>
  );
}
