const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// ── Security Middleware ──────────────────────────────
app.use(helmet());

app.use(cors({
  origin: "*",
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." },
});
app.use(limiter);

// ── Body Parser ──────────────────────────────────────
app.use(express.json());

// ── Health Check Route ───────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Waybound API",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;