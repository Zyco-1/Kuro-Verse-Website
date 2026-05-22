import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const response = await axios.get(`https://reanime.to/api/thumbnails/${id}`);

    if (response.data.success && response.data.thumbnails) {
      // Map thumbnails object to a sorted episode list
      const episodes = Object.keys(response.data.thumbnails)
        .sort((a, b) => parseFloat(a) - parseFloat(b))
        .map(epNum => ({
          episode: epNum,
          thumbnail: response.data.thumbnails[epNum]
        }));

      return NextResponse.json(episodes);
    }

    return NextResponse.json([], { status: 404 });
  } catch (error: any) {
    console.error('Failed to fetch episodes:', error.message);
    return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 });
  }
}
