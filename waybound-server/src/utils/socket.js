const { sendPushNotification } = require("./pushNotification");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Room = require("../models/Room");

// Store active room members in memory
// { roomCode: { socketId: { userId, name, avatar, latitude, longitude } } }
const activeRooms = {};

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // ── Auth Middleware for Socket ─────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return next(new Error("User not found"));
      }

      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  // ── Connection ─────────────────────────────────────
  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.user.name} (${socket.id})`);

    // ── Join Room ──────────────────────────────────────
    socket.on("join_room", async ({ roomCode }) => {
      try {
        // Check room exists and is active
        const room = await Room.findOne({ code: roomCode.toUpperCase() });
        if (!room || !room.active) {
          socket.emit("error", { message: "Room not found or has ended." });
          return;
        }

        // Check user is a member
        const isMember = room.members.some(
          (m) => m.toString() === socket.user._id.toString(),
        );
        if (!isMember) {
          socket.emit("error", {
            message: "You are not a member of this room.",
          });
          return;
        }

        // Join the socket room
        socket.join(roomCode);

        // Add to activeRooms
        if (!activeRooms[roomCode]) {
          activeRooms[roomCode] = {};
        }
        activeRooms[roomCode][socket.id] = {
          userId: socket.user._id,
          name: socket.user.name,
          avatar: socket.user.avatar,
          latitude: null,
          longitude: null,
        };

        // Tell this user who else is in the room
        socket.emit("room_members", Object.values(activeRooms[roomCode]));

        // Tell everyone else this user joined
        socket.to(roomCode).emit("member_joined", {
          userId: socket.user._id,
          name: socket.user.name,
          avatar: socket.user.avatar,
        });

        console.log(`📍 ${socket.user.name} joined room ${roomCode}`);
      } catch (error) {
        console.error("join_room error:", error.message);
        socket.emit("error", { message: "Could not join room." });
      }
    });

    // ── Location Update ────────────────────────────────
    socket.on("location_update", ({ roomCode, latitude, longitude }) => {
      // Update in memory
      if (activeRooms[roomCode] && activeRooms[roomCode][socket.id]) {
        activeRooms[roomCode][socket.id].latitude = latitude;
        activeRooms[roomCode][socket.id].longitude = longitude;
      }

      // Broadcast to everyone else in the room
      socket.to(roomCode).emit("member_location", {
        userId: socket.user._id,
        name: socket.user.name,
        avatar: socket.user.avatar,
        latitude,
        longitude,
      });
    });

    // ── Safety Alert ───────────────────────────────────────
    socket.on(
      "safety_alert",
      async ({ roomCode, latitude, longitude, message }) => {
        // Broadcast SOS to everyone in the room via socket
        io.to(roomCode).emit("safety_alert_received", {
          userId: socket.user._id,
          name: socket.user.name,
          avatar: socket.user.avatar,
          latitude,
          longitude,
          message: message || "SOS! I need help!",
          timestamp: new Date().toISOString(),
        });

        console.log(`🚨 SOS from ${socket.user.name} in room ${roomCode}`);

        // ── Send push notification to all room members ──────
        try {
          const room = await Room.findOne({ code: roomCode }).populate(
            "members",
            "pushToken name",
          );

          if (room) {
            // Get all push tokens except the sender
            const tokens = room.members
              .filter((m) => m._id.toString() !== socket.user._id.toString())
              .map((m) => m.pushToken)
              .filter(Boolean);

            await sendPushNotification({
              tokens,
              title: `🚨 SOS from ${socket.user.name}`,
              body: message || "SOS! I need help! Check Waybound.",
            });
          }
        } catch (error) {
          console.error("Push notification send error:", error.message);
        }
      },
    );

    // ── Leave Room ─────────────────────────────────────
    socket.on("leave_room", ({ roomCode }) => {
      handleLeave(socket, roomCode, io);
    });

    // ── Disconnect ─────────────────────────────────────
    socket.on("disconnect", () => {
      // Find which rooms this socket was in and clean up
      for (const roomCode in activeRooms) {
        if (activeRooms[roomCode][socket.id]) {
          handleLeave(socket, roomCode, io);
        }
      }
      console.log(`🔴 User disconnected: ${socket.user.name}`);
    });
  });

  return io;
}

// ── Helper: handle a user leaving a room ────────────
function handleLeave(socket, roomCode, io) {
  if (activeRooms[roomCode]) {
    const member = activeRooms[roomCode][socket.id];
    if (member) {
      delete activeRooms[roomCode][socket.id];

      // Clean up empty rooms from memory
      if (Object.keys(activeRooms[roomCode]).length === 0) {
        delete activeRooms[roomCode];
      }

      // Tell everyone else this user left
      socket.to(roomCode).emit("member_left", {
        userId: member.userId,
        name: member.name,
      });

      console.log(`👋 ${member.name} left room ${roomCode}`);
    }
  }
  socket.leave(roomCode);
}

module.exports = { initSocket };
