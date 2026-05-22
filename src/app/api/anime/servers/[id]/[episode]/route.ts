import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; episode: string }> }
) {
  const { id, episode } = await params;

  try {
    const response = await axios.get(`https://reanime.to/api/flix/${id}/${episode}`, {
        headers: {
            'User-Agent': USER_AGENT,
            'Referer': 'https://reanime.to/',
            'Accept': 'application/json',
        }
    });

    if (response.data.servers) {
      return NextResponse.json(response.data.servers);
    }

    return NextResponse.json([], { status: 404 });
  } catch (error: any) {
    console.error('Failed to fetch servers:', error.message);
    return NextResponse.json({ error: 'Failed to fetch servers' }, { status: 500 });
  }
}
