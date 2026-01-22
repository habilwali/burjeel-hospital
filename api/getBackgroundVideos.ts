import type { GetBackgroundVideosResponse } from '../types/video';
import { cacheGet, cacheSet } from '../lib/cache';

const API_BASE = 'https://cmt-technologies.net/iptv-cms';
const DEFAULT_MAC = 'A4:34:D9:E6:F7:30';

async function fetchWithRetry(url: string, attempts = 3, delayMs = 1000): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      console.log('[Video API] fetch attempt', attempt, 'for', url);
      const res = await fetch(url);

      if (res.ok) {
        return res;
      }

      lastError = new Error(`HTTP ${res.status} ${res.statusText}`);
      console.warn('[Video API] Non-OK response on attempt', attempt, {
        status: res.status,
        statusText: res.statusText,
      });
    } catch (err) {
      lastError = err;
      console.warn('[Video API] Network error on attempt', attempt, err);
    }

    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError ?? new Error('Failed to fetch after retries');
}

/**
 * Resolves file_url to a full absolute URL.
 * Handles relative paths (e.g. "uploads/videos/vid_xxx.mp4") and already-absolute URLs.
 */
export function toAbsoluteVideoUrl(fileUrl: string): string {
  const trimmed = fileUrl.replace(/^\//, '');
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  return `${base}/${trimmed}`;
}

/**
 * Fetches background videos from get_background_videos.php. Cached on first load.
 * @param mac - Device MAC (default: A4:34:D9:E6:F7:30)
 */
export async function getBackgroundVideos(
  mac: string = DEFAULT_MAC
): Promise<GetBackgroundVideosResponse> {
  const key = `backgroundVideos:${mac}`;
  const cached = cacheGet<GetBackgroundVideosResponse>(key);
  if (cached) {
    console.log('[Video API] Using cached background videos for MAC:', mac);
    return cached;
  }

  const url = `${API_BASE}/api/get_background_videos.php?mac=${encodeURIComponent(mac)}`;
  console.log('[Video API] Fetching background videos...', { url, mac });

  const res = await fetchWithRetry(url);

  if (!res.ok) {
    console.warn('[Video API] HTTP error when fetching background videos', {
      status: res.status,
      statusText: res.statusText,
      url,
    });
    throw new Error(`get_background_videos failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as GetBackgroundVideosResponse;

  if (data.status !== 'success') {
    console.warn('[Video API] API returned non-success status for background videos', {
      status: data.status,
      raw: data,
    });
    throw new Error(`get_background_videos returned status: ${data.status}`);
  }

  console.log('[Video API] Successfully fetched background videos', {
    count: data.videos?.length ?? 0,
  });

  cacheSet(key, data);
  return data;
}


