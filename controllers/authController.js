const crypto = require("crypto");

const User = require("../models/User");
const Client = require("../models/Client");

// ==========================================
// Register User
// ==========================================
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                error: "Username, email, and password are required."
            });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                error: "Username already exists."
            });
        }

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({
                error: "Email already exists."
            });
        }

        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Registration failed."
        });

    }
};

// ==========================================
// Register OAuth Client
// ==========================================
const registerClient = async (req, res) => {

    try {

        const { name, redirectUri } = req.body;

        if (!name || !redirectUri) {

            return res.status(400).json({
                error: "App Name and Redirect URI are required."
            });

        }

        const clientId =
            "client_" + crypto.randomBytes(12).toString("hex");

        const clientSecret =
            "secret_" + crypto.randomBytes(24).toString("hex");

        const client = new Client({

            name,

            clientId,

            clientSecret,

            redirectUris: [redirectUri]

        });

        await client.save();

        res.status(201).json({

            message: "Client created.",

            clientId,

            clientSecret,

            redirectUri

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            error: "Failed to register client."

        });

    }

};

module.exports = {

    registerUser,

    registerClient

};