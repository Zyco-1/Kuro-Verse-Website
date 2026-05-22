import { NextRequest, NextResponse } from 'next/server';
import { extractFlixCloud } from '@/lib/api/flixcloud';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
  }

  try {
    const data = await extractFlixCloud(url);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Extraction error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
