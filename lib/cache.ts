// In-Memory Stale-While-Revalidate Cache for Dashboard & Reports
// Ensures instantaneous display when navigating between dashboard views,
// while refreshing data in the background seamlessly.

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

// Default Time-To-Live: 5 minutes for freshness, but data remains accessible
// for immediate background revalidation.
export const DEFAULT_TTL_MS = 5 * 60 * 1000;

export function getCachedData<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  // If entry exists, return it even if stale for instant UI paint
  return entry.data as T;
}

export function isCacheFresh(key: string, maxAgeMs = DEFAULT_TTL_MS): boolean {
  const entry = memoryCache.get(key);
  if (!entry) return false;
  return Date.now() - entry.timestamp < maxAgeMs;
}

export function setCachedData<T>(key: string, data: T): void {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function invalidateCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.startsWith(keyPrefix)) {
      memoryCache.delete(key);
    }
  }
}
