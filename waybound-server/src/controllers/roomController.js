const { validationResult } = require("express-validator");
const Room = require("../models/Room");

// ── Helper: generate room code ───────────────────────
function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segment = () =>
    Array.from({ length: 4 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  return `WB-${segment()}`;
}

// ── Create Room ──────────────────────────────────────
async function createRoom(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, icon, maxMembers, isPrivate, safetyAlerts, shareLocation } = req.body;

    // Generate a unique room code
    let code;
    let isUnique = false;
    while (!isUnique) {
      code = generateRoomCode();
      const existing = await Room.findOne({ code });
      if (!existing) isUnique = true;
    }

    // Create the room
    const room = await Room.create({
      name,
      code,
      icon: icon || "🚴",
      maxMembers: maxMembers || 6,
      isPrivate: isPrivate !== undefined ? isPrivate : true,
      safetyAlerts: safetyAlerts !== undefined ? safetyAlerts : true,
      shareLocation: shareLocation !== undefined ? shareLocation : true,
      host: req.user._id,
      members: [req.user._id], // host is auto-added as first member
    });

    res.status(201).json({
      message: "Room created successfully",
      room: {
        id: room._id,
        name: room.name,
        code: room.code,
        icon: room.icon,
        maxMembers: room.maxMembers,
        isPrivate: room.isPrivate,
        safetyAlerts: room.safetyAlerts,
        shareLocation: room.shareLocation,
        host: req.user._id,
        members: room.members,
        active: room.active,
      },
    });

  } catch (error) {
    console.error("Create room error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
}

// ── Join Room ────────────────────────────────────────
async function joinRoom(req, res) {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Room code is required" });
    }

    // Find the room
    const room = await Room.findOne({ code: code.toUpperCase() });
    if (!room) {
      return res.status(404).json({ error: "Room not found. Check your code." });
    }

    // Check if room is still active
    if (!room.active) {
      return res.status(400).json({ error: "This room has ended." });
    }

    // Check if already a member
    const alreadyMember = room.members.some(
      (m) => m.toString() === req.user._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ error: "You are already in this room." });
    }

    // Check if room is full
    if (room.members.length >= room.maxMembers) {
      return res.status(400).json({ error: "Room is full." });
    }

    // Add user to members
    room.members.push(req.user._id);
    await room.save();

    res.json({
      message: "Joined room successfully",
      room: {
        id: room._id,
        name: room.name,
        code: room.code,
        icon: room.icon,
        maxMembers: room.maxMembers,
        isPrivate: room.isPrivate,
        safetyAlerts: room.safetyAlerts,
        shareLocation: room.shareLocation,
        host: room.host,
        members: room.members,
        active: room.active,
      },
    });

  } catch (error) {
    console.error("Join room error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
}

// ── Get Room Details ─────────────────────────────────
async function getRoom(req, res) {
  try {
    const room = await Room.findById(req.params.id)
      .populate("host", "name avatar")
      .populate("members", "name avatar");

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json({ room });

  } catch (error) {
    console.error("Get room error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
}

// ── End Room (host only) ─────────────────────────────
async function endRoom(req, res) {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Only host can end the room
    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Only the host can end the room." });
    }

    room.active = false;
    await room.save();

    res.json({ message: "Room ended successfully" });

  } catch (error) {
    console.error("End room error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
}

// ── Get My Rooms ─────────────────────────────────────
async function getMyRooms(req, res) {
  try {
    const rooms = await Room.find({
      members: req.user._id,
      active: true,
    })
      .populate("host", "name avatar")
      .sort({ createdAt: -1 }) // newest first
      .limit(10);

    res.json({ rooms });

  } catch (error) {
    console.error("Get my rooms error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
}

module.exports = { createRoom, joinRoom, getRoom, endRoom, getMyRooms };