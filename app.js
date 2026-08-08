require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");

const apiRouter = require("./routes/api");
const authRoutes = require("./routes/auth");
const oauthRoutes = require("./routes/oauth");

const app = express();

// Database Connection
connectDB();

// Core Middlewares
app.use(cors());
app.use(express.json());
// CRITICAL FOR OAUTH: Parses x-www-form-urlencoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Route Mounting
app.use("/api", apiRouter);
app.use("/", authRoutes);
app.use("/oauth", oauthRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});