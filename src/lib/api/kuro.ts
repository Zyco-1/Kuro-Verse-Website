const KURO_API_BASE = 'https://kuro-api-c0q2.onrender.com';

export const searchKuro = async (query: string) => {
  const res = await fetch(`${KURO_API_BASE}/api/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Kuro Search API Error');
  return res.json();
};

export const getKuroAnimeDetails = async (id: string | number) => {
  const res = await fetch(`${KURO_API_BASE}/api/anime?id=${id}`);
  if (!res.ok) throw new Error('Kuro Anime Details API Error');
  return res.json();
};

export const getKuroStream = async (
  id: string | number,
  episode: string | number,
  type: 'sub' | 'dub' = 'sub',
  server: string = 'flixcloud'
) => {
  const res = await fetch(
    `${KURO_API_BASE}/api/stream?id=${id}&episode=${episode}&type=${type}&server=${server}`
  );
  if (!res.ok) throw new Error('Kuro Stream API Error');
  return res.json();
};
