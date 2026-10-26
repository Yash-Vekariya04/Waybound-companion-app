const http = require("http");
const app = require("./app");
const connectDB = require("./utils/connectDB");
const { initSocket } = require("./utils/socket");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// ── Handle uncaught errors ────────────────────────────
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err.message);
  process.exit(1);
});

async function startServer() {
  await connectDB();

  const server = http.createServer(app);

  initSocket(server);

  server.listen(PORT, () => {
    console.log(`✅ Waybound server running on http://localhost:${PORT}`);
    console.log(`⚡ Socket.io ready`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });

  // ── Graceful shutdown ─────────────────────────────
  process.on("SIGTERM", () => {
    console.log("👋 SIGTERM received. Shutting down gracefully...");
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  });
}

startServer();