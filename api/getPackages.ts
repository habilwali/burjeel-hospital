import type { GetPackagesResponse } from '../types/packages';
import { cacheGet, cacheSet } from '../lib/cache';

const API_BASE = 'https://cmt-technologies.net/iptv-cms';
const DEFAULT_MAC = 'A4:34:D9:E6:F7:30';
const CACHE_KEY = 'packages';

/**
 * Fetches packages (categories) from getPackages.php. Cached on first load.
 * @param mac - Device MAC (default: A4:34:D9:E6:F7:30)
 */
export async function getPackages(mac: string = DEFAULT_MAC): Promise<GetPackagesResponse> {
  const key = `${CACHE_KEY}:${mac}`;
  const cached = cacheGet<GetPackagesResponse>(key);
  if (cached) {
    // Return cached data immediately, then refresh in the background.
    void refreshPackagesInBackground(key, mac, cached);
    return cached;
  }

  const fresh = await fetchPackagesFromNetwork(mac);
  cacheSet(key, fresh);
  return fresh;
}

async function fetchPackagesFromNetwork(mac: string): Promise<GetPackagesResponse> {
  const url = `${API_BASE}/api/getPackages.php?mac=${encodeURIComponent(mac)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`getPackages failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as GetPackagesResponse;

  if (!data.success) {
    throw new Error('getPackages returned success: false');
  }

  return data;
}

async function refreshPackagesInBackground(
  key: string,
  mac: string,
  previous: GetPackagesResponse
): Promise<void> {
  try {
    const fresh = await fetchPackagesFromNetwork(mac);
    const prevJson = JSON.stringify(previous.packages ?? []);
    const nextJson = JSON.stringify(fresh.packages ?? []);

    if (prevJson !== nextJson) {
      cacheSet(key, fresh);
    }
  } catch {
    // Ignore background refresh errors; keep using cached data.
  }
}


