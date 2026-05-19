const ANILIST_API_URL = 'https://graphql.anilist.co';

async function fetchAniList(query: string, variables: any = {}) {
  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || 'AniList API Error');
  }
  return json.data;
}

export const getTrendingAnime = async (page = 1, perPage = 20) => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: TRENDING_DESC, type: ANIME) {
          id
          idMal
          title {
            romaji
            english
            native
          }
          coverImage {
            extraLarge
            large
            color
          }
          bannerImage
          description
          format
          episodes
          status
          averageScore
          genres
          season
          seasonYear
        }
      }
    }
  `;
  return fetchAniList(query, { page, perPage });
};

export const getPopularAnime = async (page = 1, perPage = 20) => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: POPULAR_DESC, type: ANIME) {
          id
          idMal
          title {
            romaji
            english
            native
          }
          coverImage {
            extraLarge
            large
            color
          }
          bannerImage
          description
          format
          episodes
          status
          averageScore
          genres
        }
      }
    }
  `;
  return fetchAniList(query, { page, perPage });
};

export const searchAnime = async (search: string, page = 1, perPage = 20) => {
  const query = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(search: $search, type: ANIME) {
          id
          idMal
          title {
            romaji
            english
            native
          }
          coverImage {
            extraLarge
            large
            color
          }
          bannerImage
          description
          format
          episodes
          status
          averageScore
          genres
        }
      }
    }
  `;
  return fetchAniList(query, { search, page, perPage });
};

export const getAnimeDetails = async (id: number) => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        idMal
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
          color
        }
        bannerImage
        description
        format
        episodes
        status
        averageScore
        genres
        season
        seasonYear
        studios(isMain: true) {
          nodes {
            name
          }
        }
        trailer {
          id
          site
          thumbnail
        }
        recommendations {
          nodes {
            mediaRecommendation {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              type
            }
          }
        }
      }
    }
  `;
  return fetchAniList(query, { id });
};

export const getAiringSchedule = async (start: number, end: number, page = 1) => {
  const query = `
    query ($page: Int, $airingAt_greater: Int, $airingAt_lesser: Int) {
      Page(page: $page, perPage: 50) {
        airingSchedules(airingAt_greater: $airingAt_greater, airingAt_lesser: $airingAt_lesser, sort: TIME) {
          id
          airingAt
          episode
          media {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
              extraLarge
            }
            bannerImage
            format
            genres
          }
        }
      }
    }
  `;
  return fetchAniList(query, { page, airingAt_greater: start, airingAt_lesser: end });
};
