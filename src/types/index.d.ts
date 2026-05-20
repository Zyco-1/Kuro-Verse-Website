export interface Anime {
  id: number;
  title: {
    english?: string;
    romaji: string;
    native?: string;
  };
  coverImage?: {
    extraLarge: string;
    large: string;
    medium: string;
  };
  bannerImage?: string;
  description: string;
  episodes?: number;
  status: string;
  season?: string;
  seasonYear?: number;
  averageScore?: number;
  genres: string[];
  format: string;
  studios?: {
    nodes: Array<{ name: string }>;
  };
  session?: string;
}

export interface Episode {
  episode: number;
  title?: string;
  session: string;
  snapshot?: string;
}

export interface Stream {
  quality: string;
  url: string;
  filesize: string;
}

export interface WatchedAnime {
  id: number;
  title: string;
  episode: number;
  image?: string;
  paheId: string;
  updatedAt: number;
}
