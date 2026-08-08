const Redis = require('ioredis');

// Support either full REDIS_URL string or granular options
const redisConfig = process.env.REDIS_URL
    ? process.env.REDIS_URL
    : {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: Number(process.env.REDIS_DB) || 0,
        retryStrategy(times) {
            // Reconnect backoff (max 2 seconds delay)
            return Math.min(times * 50, 2000);
        }
    };

const redis = new Redis(redisConfig);

redis.on('connect', () => {
    console.log('Redis connected successfully');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err.message);
});

module.exports = redis;