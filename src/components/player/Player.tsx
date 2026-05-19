'use client';

import { MediaPlayer, MediaProvider, Poster, Track } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { useEffect, useRef } from 'react';
import { FastForward } from 'lucide-react';

interface PlayerProps {
  src: string;
  poster?: string;
  title?: string;
  subtitles?: { label: string; src: string; lang: string; default?: boolean }[];
  onEnded?: () => void;
  autoPlay?: boolean;
}

export default function Player({ src, poster, title, subtitles, onEnded, autoPlay = true }: PlayerProps) {
  const player = useRef<any>(null);

  const skipIntro = () => {
    if (player.current) {
      player.current.currentTime += 85;
    }
  };

  return (
    <div className="group relative w-full aspect-video rounded-2xl overflow-hidden sexy-shadow bg-black">
      <MediaPlayer
        ref={player}
        title={title}
        src={src}
        className="w-full h-full"
        crossOrigin
        onEnded={onEnded}
        autoplay={autoPlay}
      >
        <MediaProvider>
          <Poster
            src={poster}
            alt={title}
            className="absolute inset-0 block h-full w-full object-cover opacity-0 transition-opacity data-[visible]:opacity-100"
          />
          {subtitles?.map((track, i) => (
            <Track
              key={track.src}
              src={track.src}
              label={track.label}
              lang={track.lang}
              kind="subtitles"
              default={track.default}
            />
          ))}
        </MediaProvider>

        <div className="absolute bottom-20 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={skipIntro}
            className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 font-black uppercase text-xs hover:bg-primary transition-all active:scale-95"
          >
            <FastForward size={16} /> Skip Intro
          </button>
        </div>

        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
}
