const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // timeout after 5s
    });
    console.log("✅ MongoDB connected successfully");

    // Handle connection errors after initial connection
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;