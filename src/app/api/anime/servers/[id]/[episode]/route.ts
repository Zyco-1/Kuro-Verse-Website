import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; episode: string }> }
) {
  const { id, episode } = await params;

  try {
    const response = await axios.get(`https://reanime.to/api/flix/${id}/${episode}`);

    if (response.data.servers) {
      return NextResponse.json(response.data.servers);
    }

    return NextResponse.json([], { status: 404 });
  } catch (error: any) {
    console.error('Failed to fetch servers:', error.message);
    return NextResponse.json({ error: 'Failed to fetch servers' }, { status: 500 });
  }
}
