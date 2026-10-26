const http = require("http");
const app = require("./app");
const connectDB = require("./utils/connectDB");
const { initSocket } = require("./utils/socket");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();

  const server = http.createServer(app);

  // Initialise Socket.io
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`✅ Waybound server running on http://localhost:${PORT}`);
    console.log(`⚡ Socket.io ready`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
}

startServer();