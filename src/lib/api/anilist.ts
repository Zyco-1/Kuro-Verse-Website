const ANILIST_API = 'https://graphql.anilist.co';

export const queryAniList = async (query: string, variables: any = {}) => {
  const res = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors?.[0]?.message || 'AniList API Error');
  }
  return json.data;
};

export const GET_TRENDING = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: TRENDING_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
        }
        bannerImage
        averageScore
        format
        description
        seasonYear
      }
    }
  }
`;

export const GET_POPULAR = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
        }
        bannerImage
        averageScore
        format
        description
        seasonYear
      }
    }
  }
`;

export const SEARCH_ANIME = `
  query ($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
        }
        bannerImage
        averageScore
        format
        seasonYear
      }
    }
  }
`;

export const GET_ANIME_DETAILS = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
      }
      bannerImage
      description
      episodes
      status
      season
      seasonYear
      averageScore
      genres
      format
      studios(isMain: true) {
        nodes {
          name
        }
      }
    }
  }
`;

export const getAniListMedia = async (id: string | number) => {
    const data = await queryAniList(GET_ANIME_DETAILS, { id: parseInt(id.toString()) });
    return data.Media;
}

export const getAniListMediaByTitle = async (title: string) => {
    const data = await queryAniList(SEARCH_ANIME, { search: title, perPage: 1 });
    return data.Page.media[0];
}

export const searchAniList = async (search: string, page: number = 1, perPage: number = 24) => {
    const data = await queryAniList(SEARCH_ANIME, { search, page, perPage });
    return data;
}

export const getTrending = async (page: number = 1, perPage: number = 24) => {
    const data = await queryAniList(GET_TRENDING, { page, perPage });
    return data.Page.media;
}

export const getPopular = async (page: number = 1, perPage: number = 24) => {
    const data = await queryAniList(GET_POPULAR, { page, perPage });
    return data.Page.media;
}
