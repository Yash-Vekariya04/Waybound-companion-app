const http = require("http");
const app = require("./app");
const connectDB = require("./utils/connectDB");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`✅ Waybound server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
}

startServer();