import { NextRequest, NextResponse } from 'next/server';
import { getAnimePaheStream } from '@/lib/api/animepahe';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const animeId = searchParams.get('animeId');
  const episodeId = searchParams.get('episodeId');

  if (!animeId || !episodeId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const results = await getAnimePaheStream(animeId, episodeId);
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
