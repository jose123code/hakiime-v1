// v1/routes/oauth.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Client = require('../models/Client');
const AuthCode = require('../models/AuthCode');
const Token = require('../models/Token');

// Helper function to calculate S256 Code Challenge from Verifier (RFC 7636)
function calculateChallenge(verifier) {
    return crypto
        .createHash('sha256')
        .update(verifier)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

// =========================================================================
// 1. PKCE AUTHORIZATION ENDPOINT (/oauth/authorize)
// =========================================================================
router.post('/authorize', async (req, res, next) => {
    const { client_id, redirect_uri, response_type, username, password, code_challenge, code_challenge_method } = req.body;

    if (response_type !== 'code') {
        return res.status(400).json({ error: 'unsupported_response_type', error_description: 'Only response_type=code is supported.' });
    }

    // Enforce PKCE S256 Method
    if (!code_challenge || code_challenge_method !== 'S256') {
        return res.status(400).json({ 
            error: 'invalid_request', 
            error_description: 'PKCE code_challenge and code_challenge_method=S256 are required.' 
        });
    }

    try {
        const client = await Client.findOne({ clientId: client_id });
        if (!client || !client.redirectUris.includes(redirect_uri)) {
            return res.status(400).json({ error: 'invalid_client', error_description: 'Invalid client_id or redirect_uri.' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'invalid_grant', error_description: 'Invalid user credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'invalid_grant', error_description: 'Invalid user credentials.' });
        }

        const code = crypto.randomBytes(16).toString('hex');

        // Save authorization code (5-minute TTL)
        await AuthCode.create({
            code,
            clientId: client_id,
            userId: user._id,
            redirectUri: redirect_uri,
            codeChallenge: code_challenge,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        return res.json({
            message: 'Authorization granted',
            authorization_code: code,
            redirect_uri: `${redirect_uri}?code=${code}`
        });

    } catch (err) {
        next(err);
    }
});

// =========================================================================
// 2. TOKEN ENDPOINT (/oauth/token)
// Supports: authorization_code (PKCE) & refresh_token
// =========================================================================
router.post('/token', async (req, res, next) => {
    const { grant_type, code, client_id, redirect_uri, code_verifier, refresh_token } = req.body;

    // --- GRANT TYPE 1: Authorization Code (PKCE) ---
    if (grant_type === 'authorization_code') {
        if (!code_verifier) {
            return res.status(400).json({ error: 'invalid_request', error_description: 'code_verifier is required for PKCE.' });
        }

        try {
            const authCode = await AuthCode.findOne({ code, clientId: client_id });
            if (!authCode || authCode.redirectUri !== redirect_uri) {
                return res.status(400).json({ error: 'invalid_grant', error_description: 'Invalid authorization code or redirect URI.' });
            }

            // Expiration check
            if (new Date() > authCode.expiresAt) {
                await AuthCode.deleteOne({ _id: authCode._id });
                return res.status(400).json({ error: 'invalid_grant', error_description: 'Authorization code has expired.' });
            }

            // PKCE Verification
            const calculatedChallenge = calculateChallenge(code_verifier);
            if (calculatedChallenge !== authCode.codeChallenge) {
                return res.status(400).json({ error: 'invalid_grant', error_description: 'PKCE verification failed.' });
            }

            const userId = authCode.userId;
            
            // Single-use enforcement: Delete used authorization code
            await AuthCode.deleteOne({ _id: authCode._id });

            if (!process.env.JWT_SECRET) {
                console.warn("WARNING: JWT_SECRET is not set in environment variables!");
            }

            const accessToken = jwt.sign(
                { userId: userId, clientId: client_id },
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: '1h' }
            );

            const newRefreshToken = crypto.randomBytes(32).toString('hex');

            await Token.create({
                accessToken,
                refreshToken: newRefreshToken,
                clientId: client_id,
                userId: userId,
                accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
                refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
            });

            return res.json({
                access_token: accessToken,
                token_type: 'Bearer',
                expires_in: 3600,
                refresh_token: newRefreshToken
            });

        } catch (err) {
            return next(err);
        }
    }

    // --- GRANT TYPE 2: Refresh Token ---
    if (grant_type === 'refresh_token') {
        if (!refresh_token) {
            return res.status(400).json({ error: 'invalid_request', error_description: 'refresh_token is required.' });
        }

        try {
            const existingToken = await Token.findOne({ refreshToken: refresh_token, clientId: client_id });
            if (!existingToken || new Date() > existingToken.refreshTokenExpiresAt) {
                return res.status(400).json({ error: 'invalid_grant', error_description: 'Invalid or expired refresh token.' });
            }

            const newAccessToken = jwt.sign(
                { userId: existingToken.userId, clientId: client_id },
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: '1h' }
            );

            existingToken.accessToken = newAccessToken;
            existingToken.accessTokenExpiresAt = new Date(Date.now() + 3600 * 1000);
            await existingToken.save();

            return res.json({
                access_token: newAccessToken,
                token_type: 'Bearer',
                expires_in: 3600
            });
        } catch (err) {
            return next(err);
        }
    }

    return res.status(400).json({ error: 'unsupported_grant_type' });
});

module.exports = router;