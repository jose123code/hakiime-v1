const mongoose = require('mongoose');

const AuthCodeSchema = new mongoose.Schema(
    {
        code: { 
            type: String, 
            required: true, 
            unique: true, 
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
        redirectUri: { 
            type: String, 
            required: true 
        },
        codeChallenge: { 
            type: String, 
            required: true 
        },
        expiresAt: { 
            type: Date, 
            required: true, 
            index: { expires: 0 } // Auto-deletes document upon expiration
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('AuthCode', AuthCodeSchema);