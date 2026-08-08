const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            trim: true 
        },
        clientId: { 
            type: String, 
            required: true, 
            unique: true, 
            index: true 
        },
        clientSecret: { 
            type: String, 
            required: true 
        },
        redirectUris: [{ 
            type: String, 
            required: true 
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Client', ClientSchema);