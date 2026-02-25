import type { GetBackgroundVideosResponse } from '../types/video';
import { cacheGet, cacheSet } from '../lib/cache';
import { IPTV_API_BASE } from './config';

// Base URL for all IPTV CMS APIs
const API_BASE = IPTV_API_BASE;

async function fetchWithRetry(url: string, attempts = 3, delayMs = 1000): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url);

      if (res.ok) {
        return res;
      }

      lastError = new Error(`HTTP ${res.status} ${res.statusText}`);
    } catch (err) {
      lastError = err;
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
  // Video files live under /iptv-cms/uploads, not /iptv-cms/api
  // Strip a trailing "/api" from the base so relative paths resolve correctly.
  const root = API_BASE.replace(/\/api\/?$/, '');
  const base = root.endsWith('/') ? root.slice(0, -1) : root;
  return `${base}/${trimmed}`;
}

/**
 * Fetches background videos from get_background_videos.php. Cached on first load.
 * @param mac - Device MAC (must be provided dynamically)
 */
export async function getBackgroundVideos(mac: string): Promise<GetBackgroundVideosResponse> {
  const key = `backgroundVideos:${mac}`;
  const cached = cacheGet<GetBackgroundVideosResponse>(key);
  if (cached) {
    return cached;
  }

  const url = `${API_BASE}/get_background_videos.php?mac=${encodeURIComponent(mac)}`;
  console.log('[Video API] Fetching background videos...', { url, mac });

  const res = await fetchWithRetry(url);

  if (!res.ok) {
    throw new Error(`get_background_videos failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as GetBackgroundVideosResponse;

  if (data.status !== 'success') {
    throw new Error(`get_background_videos returned status: ${data.status}`);
  }

  cacheSet(key, data);
  return data;
}

