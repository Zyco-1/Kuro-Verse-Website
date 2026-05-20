'use client';

import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

interface PlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onEnded?: () => void;
}

export default function Player({ src, poster, title, onEnded }: PlayerProps) {
  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 sexy-shadow bg-black">
      <MediaPlayer
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
          {/* Tracks like subtitles could be added here if available */}
        </MediaProvider>
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
        />
      </MediaPlayer>
    </div>
  );
}
