// middleware/cache.js
const redis = require('../redis'); // Import your configured ioredis client

function cacheMiddleware(options = {}) {
  const {
    ttl = 300, // Default time-to-live is 5 minutes (in seconds)
    keyGenerator = (req) => `cache:${req.method}:${req.originalUrl}`, // Custom key generation
    condition = () => true,
  } = options;

  return async (req, res, next) => {
    // Skip caching for non-GET requests or if a custom condition isn't met
    if (req.method !== 'GET' || !condition(req)) {
      return next();
    }

    const key = keyGenerator(req);

    try {
      // 1. Check if the data exists in the cache
      const cached = await redis.get(key);

      if (cached) {
        console.log(`Cache HIT for key: ${key}`);
        const data = JSON.parse(cached);
        res.set('X-Cache', 'HIT'); // Optional: Set a header for easy debugging
        return res.json(data);
      }

      console.log(`Cache MISS for key: ${key}. Fetching new data...`);

      // 2. Store original json method
      const originalJson = res.json.bind(res);

      // 3. Override json method to cache the response before sending it
      res.json = async (data) => {
        // Cache the response
        await redis.setex(key, ttl, JSON.stringify(data));
        res.set('X-Cache', 'MISS');
        
        // Call the original json method to send the response
        return originalJson(data);
      };

      next(); // Proceed to your route handler

    } catch (error) {
      console.error('Cache middleware error:', error);
      next(); // If Redis fails, fall back to normal processing
    }
  };
}

module.exports = cacheMiddleware;