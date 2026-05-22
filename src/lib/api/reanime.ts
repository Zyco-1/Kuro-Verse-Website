export const getReAnimeThumbnails = async (animeId: string | number) => {
    try {
        const res = await fetch(`https://reanime.to/api/thumbnails/${animeId}`);
        if (!res.ok) return null;
        const data = await res.json();
        if (data.success && data.thumbnails) {
            return data;
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch thumbnails:', error);
        return null;
    }
}

export const getReAnimeServers = async (animeId: string | number, episode: string | number) => {
    try {
        const res = await fetch(`https://reanime.to/api/flix/${animeId}/${episode}`);
        if (!res.ok) return null;
        const data = await res.json();
        if (data.success && data.servers) {
            return data.servers;
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch servers:', error);
        return null;
    }
}
