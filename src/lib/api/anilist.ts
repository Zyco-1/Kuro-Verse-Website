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

export const searchAniList = async (search: string) => {
  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 20) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          format
          episodes
          status
          averageScore
          seasonYear
        }
      }
    }
  `;
  return fetchAniList(query, { search });
};

export const getAniListMediaByTitle = async (title: string) => {
  const query = `
    query ($title: String) {
      Media(search: $title, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          extraLarge
        }
        bannerImage
        format
        episodes
        status
        averageScore
        seasonYear
        season
        description
        genres
        studios(isMain: true) {
          nodes {
            name
          }
        }
      }
    }
  `;
  const data = await fetchAniList(query, { title });
  return data.Media;
};
