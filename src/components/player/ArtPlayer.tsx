import { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';

interface ArtPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  subtitles?: any[];
  onEnded?: () => void;
  audioPreference?: string;
}

export default function ArtPlayer({ src, poster, title, subtitles = [], onEnded, audioPreference }: ArtPlayerProps) {
  const artRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (!artRef.current) return;

    const targetLang = audioPreference?.toLowerCase().includes('sub') ? 'Native' : 'English';

    const art = new Artplayer({
      container: artRef.current,
      url: src,
      type: 'm3u8',
      poster: poster,
      volume: 0.7,
      autoplay: true,
      pip: true,
      screenshot: true,
      setting: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      theme: '#a3e635', // Match KuroVerse Primary Green
      customType: {
        m3u8: function (video, url) {
          if (Hls.isSupported()) {
            const hls = new Hls({
              lowLatencyMode: true,
              backBufferLength: 90,
              enableWorker: true,
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
              // Audio Track Sync
              const tracks = hls.audioTracks;
              const trackIndex = tracks.findIndex(t =>
                t.name.includes(targetLang) ||
                t.lang?.includes(targetLang.substring(0, 2).toLowerCase())
              );
              if (trackIndex !== -1) hls.audioTrack = trackIndex;

              // Quality Sync
              art.setting.update({
                name: 'quality',
                html: 'Quality',
                list: hls.levels.map((l, i) => ({
                  html: (l.height || 'Auto') + 'P',
                  value: i,
                })),
              });
            });
            art.on('setting:quality', (i: any) => {
                hls.currentLevel = i;
            });
            art.hls = hls; // Store hls instance on art object for cleanup
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          }
        },
      },
      subtitle: {
        url: subtitles.length > 0 ? (subtitles.find(s => s.default)?.url || subtitles[0].url) : '',
        type: subtitles.length > 0 ? subtitles[0].format : 'vtt',
        style: { color: '#facc15', fontSize: '28px', textShadow: '0 0 4px #000' }, // Yellow subtitles
      },
      settings: [
        {
          width: 200,
          name: 'quality',
          html: 'Quality',
          title: 'Quality Selector',
          list: [],
        },
      ],
      controls: [
        {
          position: 'right',
          html: 'Subtitles',
          selector: subtitles.map(s => ({
            html: s.language,
            url: s.url,
            default: s.default
          })),
          onSelect: function (item) {
            art.subtitle.url = item.url;
            return item.html;
          },
        },
      ],
    });

    // Add Skip Buttons (requested)
    art.controls.add({
      name: 'backward',
      position: 'left',
      index: 10,
      html: '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.5,3C17.15,3 21.08,6.03 22.47,10.22L20.1,10.9C19.05,7.81 16.04,5.5 12.5,5.5C9.41,5.5 6.74,7.53 5.72,10.3H9V12.3H2.5V5.8H4.5V9.05C5.87,5.5 9.42,3 12.5,3M9,13.5V20.5H11V18H13V20.5H15V13.5H13V16H11V13.5H9Z"/></svg>',
      tooltip: 'Back 10s',
      click: function () { art.backward = 10; },
    });

    art.controls.add({
      name: 'forward',
      position: 'left',
      index: 11,
      html: '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11.5,3C6.85,3 2.92,6.03 1.53,10.22L3.9,10.9C4.95,7.81 7.96,5.5 11.5,5.5C14.59,5.5 17.26,7.53 18.28,10.3H15V12.3H21.5V5.8H19.5V9.05C18.13,5.5 14.58,3 11.5,3M9,13.5V20.5H11V18H13V20.5H15V13.5H13V16H11V13.5H9Z"/></svg>',
      tooltip: 'Forward 10s',
      click: function () { art.forward = 10; },
    });

    // F key fullscreen and Space play/pause (requested)
    const handleGlobalKeys = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

        if (e.key.toLowerCase() === 'f') {
            e.preventDefault();
            art.fullscreen = !art.fullscreen;
        }
        if (e.key === ' ') {
            e.preventDefault();
            art.toggle();
        }
    };

    window.addEventListener('keydown', handleGlobalKeys);

    art.on('video:ended', () => {
      if (onEnded) onEnded();
    });

    playerRef.current = art;

    return () => {
      window.removeEventListener('keydown', handleGlobalKeys);
      if (art && art.destroy) {
        if ((art as any).hls) {
            (art as any).hls.destroy();
        }
        art.destroy(false);
      }
    };
  }, [src, poster, title, subtitles, onEnded, audioPreference]);

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 sexy-shadow bg-black">
      <div ref={artRef} className="w-full h-full" />
      <style jsx global>{`
        .art-video-player { background-color: #000 !important; }
        .art-video-player .art-control-progress .art-control-progress-played { background: #a3e635 !important; }
        .art-video-player .art-control-progress .art-control-progress-handle { background: #facc15 !important; border: 2px solid #000 !important; }
        .art-video-player .art-control svg { fill: #a3e635 !important; }
        .art-video-player .art-control { color: #a3e635 !important; }
        .art-video-player .art-settings .art-settings-item.art-current { color: #facc15 !important; }
        .art-video-player .art-header { background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent) !important; }
        .art-video-player .art-bottom { background: linear-gradient(to top, rgba(0,0,0,0.9), transparent) !important; }
        .art-video-player .art-subtitle { text-shadow: 0 0 10px rgba(0,0,0,0.8) !important; }
      `}</style>
    </div>
  );
}
