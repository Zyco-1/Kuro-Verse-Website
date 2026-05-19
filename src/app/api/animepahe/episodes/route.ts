import { NextRequest, NextResponse } from 'next/server';
import { getAnimePaheEpisodes } from '@/lib/api/animepahe';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const animeId = searchParams.get('id');
  const page = parseInt(searchParams.get('page') || '1');

  if (!animeId) {
    return NextResponse.json({ error: 'Missing anime id' }, { status: 400 });
  }

  try {
    const results = await getAnimePaheEpisodes(animeId, page);
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
