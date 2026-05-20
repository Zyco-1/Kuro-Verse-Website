import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const HEADERS = {
  'Referer': 'https://kwik.cx/',
  'Origin': 'https://kwik.cx',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      headers: HEADERS,
      responseType: 'arraybuffer',
      timeout: 10000,
    });

    const contentType = response.headers['content-type'] as string;
    let data = response.data;

    // Process HLS playlists
    if ((typeof contentType === 'string' && contentType.includes('mpegurl')) || url.includes('.m3u8')) {
      const text = Buffer.from(data).toString('utf-8');
      const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);

      const lines = text.split('\n').map(line => {
        if (line.trim() === '') return line;

        // Handle URIs in tags like #EXT-X-KEY:METHOD=AES-128,URI="mon.key"
        if (line.startsWith('#')) {
          return line.replace(/URI="([^"]+)"/g, (match, p1) => {
            const absoluteUrl = p1.startsWith('http') ? p1 : new URL(p1, baseUrl).href;
            return `URI="/api/proxy?url=${encodeURIComponent(absoluteUrl)}"`;
          });
        }

        // Handle segment URLs
        const absoluteUrl = line.startsWith('http') ? line : new URL(line, baseUrl).href;
        return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
      });

      data = Buffer.from(lines.join('\n'));
    }

    const headers = new Headers();
    headers.set('Content-Type', contentType || 'application/octet-stream');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, max-age=3600');

    return new NextResponse(data, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Proxy error for URL:', url, error.message);
    return new NextResponse('Proxy error', { status: 500 });
  }
}
