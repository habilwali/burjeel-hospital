import { IPTV_API_BASE } from './config';

export interface GetMacResponse {
  ip: string;
  mac: string;
}

/**
 * Calls get_mac.php and returns `{ ip, mac }`.
 * Your PHP already detects the client IP/MAC, so no params are needed.
 *
 * Usage:
 *   const { ip, mac } = await getMac();
 */
export async function getMac(): Promise<GetMacResponse> {
  const url = `${IPTV_API_BASE}/get_mac.php`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`get_mac failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as GetMacResponse;
  return data;
}

