const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
    {
        accessToken: { 
            type: String, 
            required: true, 
            unique: true, 
            index: true 
        },
        refreshToken: { 
            type: String, 
            unique: true, 
            sparse: true, 
            index: true 
        },
        clientId: { 
            type: String, 
            required: true 
        },
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        accessTokenExpiresAt: { 
            type: Date, 
            required: true 
        },
        refreshTokenExpiresAt: { 
            type: Date, 
            required: true, 
            index: { expires: 0 } // Auto-deletes document when refresh token expires
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Token', TokenSchema);