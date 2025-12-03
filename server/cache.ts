import NodeCache from "node-cache";
import logger from "./logger";

// Create cache instance
// stdTTL: default time to live in seconds
// checkperiod: period in seconds to check for expired keys
const cache = new NodeCache({
    stdTTL: 300, // 5 minutes default
    checkperiod: 60, // Check every minute
    useClones: false, // Don't clone objects (better performance)
});

// Cache wrapper function
export function cacheMiddleware(duration: number) {
    return (req: any, res: any, next: any) => {
        // Only cache GET requests
        if (req.method !== "GET") {
            return next();
        }

        const key = req.originalUrl || req.url;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            logger.debug(`Cache HIT for ${key}`);
            return res.json(cachedResponse);
        }

        // Store original res.json
        const originalJson = res.json.bind(res);

        // Override res.json
        res.json = (body: any) => {
            // Cache the response
            cache.set(key, body, duration);
            logger.debug(`Cache SET for ${key} (${duration}s)`);
            return originalJson(body);
        };

        next();
    };
}

// Helper functions
export function clearCache(pattern?: string) {
    if (pattern) {
        const keys = cache.keys();
        const matchingKeys = keys.filter((key) => key.includes(pattern));
        cache.del(matchingKeys);
        logger.info(`Cleared ${matchingKeys.length} cache entries matching "${pattern}"`);
    } else {
        cache.flushAll();
        logger.info("Cleared all cache");
    }
}

export function getCacheStats() {
    return cache.getStats();
}

export default cache;
