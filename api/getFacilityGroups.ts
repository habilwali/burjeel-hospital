import type { FacilityGroupsApiResponse } from '../types/facility';
import { cacheGet, cacheSet } from '../lib/cache';
import { IPTV_API_BASE } from './config';

/**
 * Fetches facility groups from facility_groups.php. Cached on first load.
 */
export async function getFacilityGroups(): Promise<FacilityGroupsApiResponse> {
  const key = 'facilityGroups';
  const cached = cacheGet<FacilityGroupsApiResponse>(key);
  if (cached) {
    return cached;
  }

  const url = `${IPTV_API_BASE}/facility_groups.php`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`facility_groups API failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as FacilityGroupsApiResponse;

  if (data.status !== 'success') {
    throw new Error(`facility_groups returned status: ${data.status}`);
  }
  cacheSet(key, data);
  return data;
}
