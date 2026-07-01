/**
 * dashboardCache.js
 *
 * Lightweight in-memory TTL cache for dashboard API responses.
 * No external dependencies — uses a plain Map with expiry timestamps.
 *
 * Usage:
 *   const cache = require('./dashboardCache');
 *   const cached = cache.get(key);
 *   if (cached) return res.json(cached);
 *   ...compute...
 *   cache.set(key, data, 60); // 60-second TTL
 */

const store = new Map();

/**
 * Build a consistent cache key from userId and period.
 * @param {string} userId
 * @param {string} period
 * @returns {string}
 */
function buildKey(userId, period) {
    return `dashboard:${userId}:${period || 'default'}`;
}

/**
 * Retrieve a cached value.
 * Returns null if the key is missing or has expired.
 * @param {string} key
 * @returns {any|null}
 */
function get(key) {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        store.delete(key);
        return null;
    }
    return entry.value;
}

/**
 * Store a value with a TTL.
 * @param {string} key
 * @param {any} value
 * @param {number} ttlSeconds  Default: 60
 */
function set(key, value, ttlSeconds = 60) {
    store.set(key, {
        value,
        expiresAt: Date.now() + ttlSeconds * 1000
    });
}

/**
 * Invalidate all cache entries for a specific userId.
 * Call this after any write operation that affects a user's dashboard data.
 * @param {string} userId
 */
function invalidateUser(userId) {
    const prefix = `dashboard:${userId}:`;
    for (const key of store.keys()) {
        if (key.startsWith(prefix)) {
            store.delete(key);
        }
    }
}

/**
 * Clear the entire cache (useful for testing).
 */
function clear() {
    store.clear();
}

module.exports = { buildKey, get, set, invalidateUser, clear };
