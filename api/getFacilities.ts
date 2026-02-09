import type { FacilitiesApiResponse, Facility } from '../types/facility';
import { cacheGet, cacheSet } from '../lib/cache';
import { IPTV_API_BASE } from './config';

/**
 * Fetches facilities for a specific group from get_facilities.php. Cached on first load.
 * @param groupId - Facility group ID
 */
export async function getFacilities(groupId: string): Promise<FacilitiesApiResponse> {
  const key = `facilities:${groupId}`;
  const cached = cacheGet<FacilitiesApiResponse>(key);
  if (cached) {
    return cached;
  }

  const url = `${IPTV_API_BASE}/get_facilities.php?group_id=${encodeURIComponent(groupId)}`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`get_facilities API failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as FacilitiesApiResponse;

  if (data.status !== 'success') {
    throw new Error(`get_facilities returned status: ${data.status}`);
  }
  cacheSet(key, data);
  return data;
}
