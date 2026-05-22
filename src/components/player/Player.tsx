'use client';

import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { useEffect, useRef } from 'react';
import { Track } from '@vidstack/react';

interface PlayerProps {
  src: string;
  poster?: string;
  title?: string;
  subtitles?: any[];
  onEnded?: () => void;
}

export default function Player({ src, poster, title, subtitles, onEnded }: PlayerProps) {
  const player = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!player.current) return;

      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case 'f':
          e.preventDefault();
          if (player.current.isElementFullscreen) {
            player.current.exitFullscreen();
          } else {
            player.current.enterFullscreen();
          }
          break;
        case ' ':
          e.preventDefault();
          if (player.current.paused) {
            player.current.play();
          } else {
            player.current.pause();
          }
          break;
        case 'j':
          e.preventDefault();
          player.current.currentTime -= 10;
          break;
        case 'l':
          e.preventDefault();
          player.current.currentTime += 10;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 sexy-shadow bg-black">
      <MediaPlayer
        ref={player}
        title={title}
        src={src}
        onEnded={onEnded}
        crossOrigin
        playsInline
        className="w-full h-full"
      >
        <MediaProvider>
          <Poster
            className="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 object-cover"
            src={poster}
            alt={title}
          />
          {subtitles?.map((sub, idx) => (
            <Track
              key={idx.toString()}
              src={`/api/proxy?url=${encodeURIComponent(sub.url)}`}
              label={sub.language}
              lang={sub.language.substring(0, 2).toLowerCase()}
              kind="subtitles"
              default={sub.default}
            />
          ))}
        </MediaProvider>
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
        />
        <style jsx global>{`
          :root {
            --video-brand: #a3e635;
            --video-controls-color: #a3e635;
            --video-progress-played: #a3e635;
            --video-progress-handle: #facc15;
          }
          .vds-video-layout {
            --video-brand: #a3e635;
          }
        `}</style>
      </MediaPlayer>
    </div>
  );
}
