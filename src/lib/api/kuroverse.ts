const BASE_URL = 'https://kuroverse-api.vercel.app/api';

export const searchKuro = async (query: string) => {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  return await res.json();
};

export const getKuroEpisodes = async (session: string) => {
  const res = await fetch(`${BASE_URL}/episodes?session=${session}`);
  if (!res.ok) throw new Error('Failed to fetch episodes');
  return await res.json();
};

export const getKuroStream = async (anime: string, episode: string, type: 'sub' | 'dub' = 'sub') => {
  const res = await fetch(`${BASE_URL}/stream?anime=${anime}&episode=${episode}&type=${type}`);
  if (!res.ok) throw new Error('Failed to fetch streams');
  return await res.json();
};

export const getKuroAnimeDetails = async (id: string | number) => {
  const res = await fetch(`${BASE_URL}/anime?id=${id}`);
  if (!res.ok) throw new Error('Failed to fetch anime details');
  return await res.json();
};

export const getKuroTrending = async () => {
  const res = await fetch(`${BASE_URL}/trending`);
  if (!res.ok) throw new Error('Failed to fetch trending anime');
  return await res.json();
};

export const getKuroTopRated = async () => {
  const res = await fetch(`${BASE_URL}/top`);
  if (!res.ok) throw new Error('Failed to fetch top rated anime');
  return await res.json();
};

export const getKuroRecent = async () => {
  const res = await fetch(`${BASE_URL}/recent`);
  if (!res.ok) throw new Error('Failed to fetch recent anime');
  return await res.json();
};
