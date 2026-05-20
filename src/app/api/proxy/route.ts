import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  // Determine appropriate referer/origin
  let referer = 'https://kwik.cx/';
  let origin = 'https://kwik.cx';

  if (url.includes('animepahe')) {
    referer = 'https://animepahe.ru/';
    origin = 'https://animepahe.ru';
  } else if (url.includes('uwucdn.top') || url.includes('kwik.cx')) {
    referer = 'https://kwik.cx/';
    origin = 'https://kwik.cx';
  }

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      headers: {
        'Referer': referer,
        'Origin': origin,
        'User-Agent': USER_AGENT,
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      responseType: 'arraybuffer',
      timeout: 15000,
      validateStatus: () => true, // Allow any status code to handle redirects/errors manually
    });

    // Handle redirects manually if axios didn't
    if (response.status >= 300 && response.status < 400 && response.headers.location) {
      return GET(new NextRequest(new URL(`/api/proxy?url=${encodeURIComponent(response.headers.location)}`, request.url)));
    }

    if (response.status !== 200) {
      console.error(`Upstream returned ${response.status} for ${url}`);
      return new NextResponse(`Upstream error: ${response.status}`, { status: response.status });
    }

    const contentType = response.headers['content-type'] as string;
    let data = response.data;

    // Process HLS playlists
    if ((typeof contentType === 'string' && (contentType.includes('mpegurl') || contentType.includes('application/vnd.apple.mpegurl'))) || url.includes('.m3u8')) {
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

    // Cache segments longer, but playlists and keys shorter
    if (url.includes('.m3u8') || url.includes('.key') || url.includes('mon.key')) {
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      headers.set('Cache-Control', 'public, max-age=3600');
    }

    return new NextResponse(data, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Proxy error for URL:', url, error.message);
    return new NextResponse('Proxy error', { status: 500 });
  }
}
