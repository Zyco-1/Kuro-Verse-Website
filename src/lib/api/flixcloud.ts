import crypto from 'crypto';
import axios from 'axios';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function ht(t: string): string {
    return crypto.createHash('sha256').update(t).digest('hex');
}

function le(seed: string) {
    let e = seed;
    for (let s = 0; s < 3; s++) e = ht(e + s.toString());
    let l = e;
    for (let s = 0; s < 3; s++) l = ht(l + s.toString());
    return {
        videoField: `vf_${e.substring(0, 8)}`,
        keyField: `kf_${e.substring(8, 16)}`,
        ivField: `ivf_${e.substring(16, 24)}`,
        tokenField: `${e.substring(48, 64)}_${e.substring(56, 64)}`,
        keyFrag2Field: `${l.substring(0, 16)}_${l.substring(16, 24)}`
    };
}

function findValue(html: string, key: string): string | null {
    const regex = new RegExp(`[",']?${key}[",']?\\s*:\\s*["']([^"']+)["']`);
    const match = html.match(regex);
    return match ? match[1] : null;
}

function parseSubtitles(html: string): any[] {
    const start = html.indexOf('subtitles:[');
    if (start === -1) return [];

    let balance = 1;
    let end = -1;
    for (let i = start + 11; i < html.length; i++) {
        if (html[i] === '[') balance++;
        else if (html[i] === ']') balance--;
        if (balance === 0) {
            end = i;
            break;
        }
    }

    if (end === -1) return [];

    const content = html.substring(start + 11, end);
    const parsed: any[] = [];

    // Regex based parsing for fields
    const objRegex = /\{[^{}]+\}/g;
    let match;
    while ((match = objRegex.exec(content)) !== null) {
        const objStr = match[0];
        const d: any = {};
        ['url', 'language', 'format'].forEach(field => {
            const fRegex = new RegExp(`${field}:"(.*?)"`);
            const fm = objStr.match(fRegex);
            if (fm) d[field] = fm[1];
        });
        const defMatch = objStr.match(/default:(true|false)/);
        if (defMatch) d.default = defMatch[1] === 'true';
        parsed.push(d);
    }
    return parsed;
}

async function runWasm(frag1: Buffer, frag2: Buffer, apiFrag: Buffer, seedInt: number, wPayloadB64: string): Promise<Buffer> {
    const wasmBuffer = Buffer.from(wPayloadB64, 'base64');
    const { instance } = await WebAssembly.instantiate(wasmBuffer);
    const exports = instance.exports as any;
    const memory = exports.memory as WebAssembly.Memory;
    const heap = new Uint8Array(memory.buffer);

    const len = frag1.length;
    const y = 1000;
    const v = y + len;
    const T = v + len;
    const i = T + len;

    heap.set(frag1, y);
    heap.set(frag2, v);
    heap.set(apiFrag, T);

    exports._s(seedInt);
    exports._r(y, v, T, i, len);

    return Buffer.from(heap.slice(i, i + len));
}

export async function extractFlixCloud(url: string) {
    const headers = {
        "User-Agent": USER_AGENT,
        "Referer": "https://flixcloud.cc/",
    };

    const response = await axios.get(url, { headers });
    const html = response.data;

    const subtitles = parseSubtitles(html);
    const seedMatch = html.match(/obfuscation_seed:\s*"([^"]+)"/);
    const payloadMatch = html.match(/w_payload:\s*"([^"]+)"/);

    if (!seedMatch || !payloadMatch) {
        throw new Error("Failed to find obfuscation seed or WASM payload in HTML");
    }

    const seed = seedMatch[1];
    const wPayload = payloadMatch[1];
    const mapping = le(seed);

    const token = findValue(html, mapping.tokenField);
    const keyFrag2B64 = findValue(html, mapping.keyFrag2Field);
    const frag1B64 = findValue(html, mapping.keyField);
    const ivB64 = findValue(html, mapping.ivField);

    if (!token || !keyFrag2B64 || !frag1B64 || !ivB64) {
        throw new Error("Missing required mapping values in HTML");
    }

    const apiUrl = `https://flixcloud.cc/api/m3u8/${token}`;
    const apiResponse = await axios.get(apiUrl, {
        headers: { ...headers, Referer: url }
    });
    const apiData = apiResponse.data;

    const vidKey = ht(token + "vid").substring(0, 10);
    const keyKey = ht(token + "key").substring(0, 10);

    const vB64 = apiData[vidKey];
    const tB64 = apiData[keyKey];

    if (!vB64 || !tB64) {
        throw new Error("Missing video or key data from API");
    }

    const frag1 = Buffer.from(frag1B64, 'base64');
    const keyFrag2 = Buffer.from(keyFrag2B64, 'base64');
    const apiFrag = Buffer.from(tB64, 'base64');
    const seedInt = parseInt(seed.substring(0, 8), 16);

    const derivedKeyBase = await runWasm(frag1, keyFrag2, apiFrag, seedInt, wPayload);

    // PBKDF2: derived_key = PBKDF2(derived_key_base, seed.encode(), dkLen=32, count=1000, hmac_hash_module=SHA256)
    const derivedKey = crypto.pbkdf2Sync(derivedKeyBase, seed, 1000, 32, 'sha256');

    const keyFinal = Buffer.alloc(32);
    for (let j = 0; j < 32; j++) {
        keyFinal[j] = derivedKey[j] ^ seed.charCodeAt(j % seed.length);
    }

    const keyHash = crypto.createHash('sha256').update(keyFinal).digest();
    const iv = Buffer.from(ivB64, 'base64');
    const ciphertext = Buffer.from(vB64, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-cbc', keyHash, iv);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

    const videoUrl = decrypted.toString('utf-8').trim();

    return {
        videoUrl,
        subtitles
    };
}
