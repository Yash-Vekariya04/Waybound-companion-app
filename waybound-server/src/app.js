const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
require("dotenv").config();

const app = express();

// ── Security Headers ─────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Rate Limiting ─────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." },
});
app.use(globalLimiter);

// ── Stricter limit for auth routes ───────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many auth attempts. Please try again later." },
});
app.use("/api/auth", authLimiter);

// ── Body Parser ───────────────────────────────────────
app.use(express.json({ limit: "10kb" }));

// ── Routes ────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

// ── Health Check ──────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Waybound API",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler ──────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

module.exports = app;