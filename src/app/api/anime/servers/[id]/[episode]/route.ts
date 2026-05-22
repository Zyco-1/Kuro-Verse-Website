import { NextRequest, NextResponse } from 'next/server';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; episode: string }> }
) {
  const { id, episode } = await params;

  try {
    const response = await fetch(`https://reanime.to/api/flix/${id}/${episode}`, {
        headers: {
            'User-Agent': USER_AGENT,
            'Referer': 'https://reanime.to/',
            'Accept': 'application/json',
        }
    });

    if (!response.ok) {
        console.error(`reanime.to returned ${response.status} for servers ${id}/${episode}`);
        return NextResponse.json({ error: `Provider error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();

    if (data.success && data.servers) {
      return NextResponse.json(data.servers);
    }

    return NextResponse.json([], { status: 404 });
  } catch (error: any) {
    console.error('Failed to fetch servers:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
