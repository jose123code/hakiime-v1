// middleware/authCache.js
const redis = require('../factory/connection/redis'); // Adjust path as needed
const crypto = require('crypto');

// Best Practice: Always encrypt tokens at rest.
// Store this ENCRYPTION_KEY securely in your environment variables (.env)
// It must be exactly 32 bytes for aes-256-cbc.
const ENCRYPTION_KEY = crypto.scryptSync(process.env.SECRET_PHRASE || 'your-secret-phrase', 'salt', 32);
const IV_LENGTH = 16;

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// The Cache-Aside Middleware function
const checkTokenCache = async (req, res, next) => {
    try {
        // Assuming the token is passed in the Authorization header: "Bearer <token>"
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        // Use a structured key naming convention: {service}:{entity}:{id}
        const cacheKey = `auth:token:${token}`;

        // 1. Check Redis for the token
        const cachedEncryptedToken = await redis.get(cacheKey);

        if (cachedEncryptedToken) {
            // CACHE HIT
            console.log('Cache HIT for token');
            const decryptedTokenData = JSON.parse(decrypt(cachedEncryptedToken));
            // Attach the token data to the request object for downstream controllers
            req.tokenData = decryptedTokenData;
            return next();
        }

        // 2. CACHE MISS
        console.log('Cache MISS for token. Falling back to DB/Auth Service.');

        // This is a placeholder. You need to replace this with your actual logic
        // to validate the token against your MongoDB database or OAuth provider.
        const isValidInDB = await validateTokenInDatabase(token); // IMPLEMENT THIS

        if (isValidInDB) {
            const tokenData = {
                token: token,
                userId: isValidInDB.userId, // Example data from DB
                // ... any other relevant data
            };

            // 3. Populate Cache
            // Important: Set a TTL that matches the token's actual expiration time!
            const ttlSeconds = 3600; // Example: 1 hour. Get real expiry from DB.
            const encryptedData = encrypt(JSON.stringify(tokenData));

            await redis.setex(cacheKey, ttlSeconds, encryptedData);

            req.tokenData = tokenData;
            return next();
        } else {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

    } catch (error) {
        console.error("Cache error:", error);
        // Fallback: If Redis fails, you might want to bypass the cache and check the DB directly 
        // to prevent a complete system outage, rather than just returning a 500 error.
        return res.status(500).json({ error: 'Internal Server Error during auth check' });
    }
};

const jwt = require('jsonwebtoken');

async function validateTokenInDatabase(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        return { userId: decoded.userId, clientId: decoded.clientId };
    } catch (err) {
        return null;
    }
}

module.exports = { checkTokenCache };