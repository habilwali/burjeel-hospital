import type { WelcomeApiResponse } from '../types/welcome';
import { cacheGet, cacheSet } from '../lib/cache';
import { IPTV_API_BASE } from './config';

// Base URL for all IPTV CMS APIs
const API_BASE = IPTV_API_BASE;

/**
 * Fetches welcome data from welcome_api.php. Cached on first load.
 * @param macAddress - Device MAC (must be provided dynamically)
 */
export async function getWelcomeData(macAddress: string): Promise<WelcomeApiResponse> {
  const key = `welcome:${macAddress}`;
  const cached = cacheGet<WelcomeApiResponse>(key);
  if (cached) return cached;

  const url = `${API_BASE}/welcome_api.php?mac_address=${encodeURIComponent(macAddress)}`;
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

