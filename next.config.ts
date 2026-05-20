import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
      },
      {
        protocol: 'https',
        hostname: 'artworks.thetvdb.com',
      },
      {
        protocol: 'https',
        hostname: 'i.animepahe.com',
      },
      {
        protocol: 'https',
        hostname: 'i.animepahe.ru',
      },
      {
        protocol: 'https',
        hostname: 'animepahe.ru',
      },
      {
        protocol: 'https',
        hostname: 'animepahe.com',
      },
    ],
  },
};

export default nextConfig;
