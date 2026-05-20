import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function getCorsHeaders() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Range, User-Agent, Referer, Origin');
  headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
  return headers;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    console.error("[Proxy] Missing URL parameter in request:", request.url);
    return new NextResponse('Missing URL parameter', { status: 400, headers: getCorsHeaders() });
  }

  if (url.startsWith('/api/proxy')) {
     console.error("[Proxy] Recursive proxy call detected for:", url);
     return new NextResponse('Recursive proxy call', { status: 400, headers: getCorsHeaders() });
  }

  let referer = 'https://kwik.cx/';
  let origin = 'https://kwik.cx';

  if (url.includes('animepahe')) {
    referer = 'https://animepahe.ru/';
    origin = 'https://animepahe.ru';
  } else if (url.includes('uwucdn.top') || url.includes('owocdn.top') || url.includes('kwik.cx')) {
    referer = 'https://kwik.cx/';
    origin = 'https://kwik.cx';
  } else if (url.includes('i.animepahe.ru')) {
    referer = 'https://animepahe.ru/';
    origin = 'https://animepahe.ru';
  }

  try {
    const forwardHeaders: Record<string, string> = {
      'Referer': referer,
      'Origin': origin,
      'User-Agent': USER_AGENT,
      'Accept': '*/*',
    };

    const range = request.headers.get('range');
    if (range) {
      forwardHeaders['Range'] = range;
    }

    const response = await axios({
      method: 'GET',
      url: url,
      headers: forwardHeaders,
      responseType: 'arraybuffer',
      timeout: 15000,
      validateStatus: () => true,
    });

    if (response.status >= 300 && response.status < 400 && response.headers.location) {
      const redirectUrl = response.headers.location;
      return GET(new NextRequest(new URL(`/api/proxy?url=${encodeURIComponent(redirectUrl)}`, request.url)));
    }

    if (response.status !== 200 && response.status !== 206) {
      console.error(`[Proxy] Upstream returned ${response.status} for ${url}`);
      return new NextResponse(`Upstream error: ${response.status}`, { status: response.status, headers: getCorsHeaders() });
    }

    let contentType = (response.headers['content-type'] as string) || 'application/octet-stream';
    let data = response.data;

    // Force video MIME type for segments
    if (url.includes('segment-') || url.includes('uwu') || url.includes('.ts')) {
        if (!url.endsWith('.m3u8') && !url.endsWith('.key')) {
           contentType = 'video/mp2t';
        }
    }

    if ((typeof contentType === 'string' && (contentType.includes('mpegurl') || contentType.includes('application/vnd.apple.mpegurl'))) || url.includes('.m3u8')) {
      const text = Buffer.from(data).toString('utf-8');
      const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);

      const lines = text.split(/[\r\n]+/).map(line => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return '';

        if (trimmedLine.startsWith('#')) {
          return trimmedLine.replace(/URI="([^"]+)"/g, (match, p1) => {
            if (!p1 || p1.startsWith('/api/proxy') || p1.startsWith('data:')) return match;
            const absoluteUrl = p1.startsWith('http') ? p1 : new URL(p1, baseUrl).href;
            return `URI="/api/proxy?url=${encodeURIComponent(absoluteUrl)}"`;
          });
        }

        if (trimmedLine.length > 0 && !trimmedLine.startsWith('/api/proxy') && !trimmedLine.startsWith('data:')) {
            const absoluteUrl = trimmedLine.startsWith('http') ? trimmedLine : new URL(trimmedLine, baseUrl).href;
            return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
        }
        return trimmedLine;
      });

      data = Buffer.from(lines.filter(l => l !== '').join('\n'));
      contentType = 'application/vnd.apple.mpegurl';
    }

    const headers = getCorsHeaders();
    headers.set('Content-Type', contentType);

    if (response.headers['content-range']) headers.set('Content-Range', response.headers['content-range']);
    if (response.headers['accept-ranges']) headers.set('Accept-Ranges', response.headers['accept-ranges']);
    if (response.headers['content-length']) headers.set('Content-Length', response.headers['content-length']);

    if (url.includes('.m3u8') || url.includes('.key') || url.includes('mon.key')) {
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      headers.set('Cache-Control', 'public, max-age=3600');
    }

    return new NextResponse(data, {
      status: response.status,
      headers,
    });
  } catch (error: any) {
    console.error('[Proxy] Error for URL:', url, error.message);
    return new NextResponse('Proxy error', { status: 500, headers: getCorsHeaders() });
  }
}
