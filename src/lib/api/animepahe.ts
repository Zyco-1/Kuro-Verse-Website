import animepahe from 'animepahe-api';

export const searchAnimePahe = async (query: string) => {
  return await animepahe.search(query);
};

export const getAnimePaheInfo = async (animeSession: string) => {
  // Use getInfo or just search and find the right one if session is needed
  // Based on the README, search returns session IDs usually.
  return await animepahe.getInfo(animeSession);
};

export const getAnimePaheEpisodes = async (animeSession: string, page = 1) => {
  return await animepahe.getReleases(animeSession, 'episode_desc', page);
};

export const getAnimePaheStream = async (animeSession: string, episodeSession: string) => {
  return await animepahe.getStreamingLinks(animeSession, episodeSession);
};

/**
 * Maps AniList Anime to AnimePahe
 * We use the romaji or english title to search on AnimePahe
 */
export const mapAniListToPahe = async (title: string) => {
  const results = await searchAnimePahe(title);
  if (results && results.length > 0) {
    // Return the first match for now, or implement better fuzzy matching
    return results[0];
  }
  return null;
};
