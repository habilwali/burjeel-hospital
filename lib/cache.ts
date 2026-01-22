/**
 * In-memory cache for API responses. Persists for the app session.
 * On first load: fetch and store. Subsequent reads use cache.
 */

const memory = new Map<string, unknown>();

export function cacheGet<T>(key: string): T | undefined {
  return memory.get(key) as T | undefined;
}

export function cacheSet<T>(key: string, data: T): void {
  memory.set(key, data);
}

export function cacheHas(key: string): boolean {
  return memory.has(key);
}

/** Clear all cached entries (e.g. on logout). */
export function cacheClear(): void {
  memory.clear();
}

