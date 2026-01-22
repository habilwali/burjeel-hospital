import type { GetChannelsResponse } from '../types/channels';
import { cacheGet, cacheSet } from '../lib/cache';

const API_BASE = 'https://cmt-technologies.net/iptv-cms';

/**
 * Fetches channels for a category from getChannels.php. Cached on first load per category.
 * @param categoryId - Package/category id from getPackages (e.g. 37 for "News")
 */
export async function getChannels(categoryId: number): Promise<GetChannelsResponse> {
  const key = `channels:${categoryId}`;
  const cached = cacheGet<GetChannelsResponse>(key);
  if (cached) {
    // Return cached data immediately, then refresh in the background.
    void refreshChannelsInBackground(categoryId, key, cached);
    return cached;
  }

  const fresh = await fetchChannelsFromNetwork(categoryId);
  cacheSet(key, fresh);
  return fresh;
}

async function fetchChannelsFromNetwork(categoryId: number): Promise<GetChannelsResponse> {
  const url = `${API_BASE}/api/getChannels.php?category_id=${categoryId}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`getChannels failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as GetChannelsResponse;

  if (!data.success) {
    throw new Error('getChannels returned success: false');
  }

  return data;
}

async function refreshChannelsInBackground(
  categoryId: number,
  key: string,
  previous: GetChannelsResponse
): Promise<void> {
  try {
    const fresh = await fetchChannelsFromNetwork(categoryId);
    const prevJson = JSON.stringify(previous.channels ?? []);
    const nextJson = JSON.stringify(fresh.channels ?? []);

    if (prevJson !== nextJson) {
      cacheSet(key, fresh);
    }
  } catch {
    // Ignore background refresh errors; keep using cached data.
  }
}


