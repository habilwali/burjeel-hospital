import { IPTV_API_BASE } from './config';

export interface GetMacResponse {
  ip: string;
  mac: string;
}

// Fallback MAC used when the API is unreachable or returns no MAC.
// This is only for testing.
const FALLBACK_MAC = '48:5C:2C:A6:62:16';

/**
 * Calls get_mac.php and returns `{ ip, mac }`.
 * Your PHP already detects the client IP/MAC, so no params are needed.
 *
 * Usage:
 *   const { ip, mac } = await getMac();
 */
export async function getMac(): Promise<GetMacResponse> {
  const url = `${IPTV_API_BASE}/get_mac.php`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`get_mac failed: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as GetMacResponse;

    // If the API didn't send a MAC for some reason, fall back to the testing MAC.
    if (!data?.mac) {
      return {
        ip: data?.ip ?? '',
        mac: FALLBACK_MAC,
      };
    }

    return data;
  } catch {
    // Network / parsing failure: fall back to the testing MAC.
    return {
      ip: '',
      mac: FALLBACK_MAC,
    };
  }
}

