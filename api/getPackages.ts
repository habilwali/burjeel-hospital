import type { GetPackagesResponse } from '../types/packages';
import { cacheGet, cacheSet } from '../lib/cache';
import { IPTV_API_BASE } from './config';

// Base URL for all IPTV CMS APIs
const API_BASE = IPTV_API_BASE;
const CACHE_KEY = 'packages';

/**
 * Fetches packages (categories) from getPackages.php. Cached on first load.
 * @param mac - Device MAC (must be provided dynamically)
 */
export async function getPackages(mac: string): Promise<GetPackagesResponse> {
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
  const url = `${API_BASE}/getPackages.php?mac=${encodeURIComponent(mac)}`;
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


