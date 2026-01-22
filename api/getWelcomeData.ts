import type { WelcomeApiResponse } from '../types/welcome';
import { cacheGet, cacheSet } from '../lib/cache';

const API_BASE = 'https://cmt-technologies.net/iptv-cms';
const DEFAULT_MAC = 'A4:34:D9:E6:F7:30';

/**
 * Fetches welcome data from welcome_api.php. Cached on first load.
 * @param macAddress - Device MAC (default: A4:34:D9:E6:F7:30)
 */
export async function getWelcomeData(
  macAddress: string = DEFAULT_MAC
): Promise<WelcomeApiResponse> {
  const key = `welcome:${macAddress}`;
  const cached = cacheGet<WelcomeApiResponse>(key);
  if (cached) return cached;

  const url = `${API_BASE}/api/welcome_api.php?mac_address=${encodeURIComponent(macAddress)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`welcome_api failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as WelcomeApiResponse;

  if (!data.success) {
    throw new Error('welcome_api returned success: false');
  }

  cacheSet(key, data);
  return data;
}

