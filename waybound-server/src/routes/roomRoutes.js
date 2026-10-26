const express = require("express");
const { body } = require("express-validator");
const { createRoom, joinRoom, getRoom, endRoom } = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");
const { getMyRooms } = require("../controllers/roomController");

const router = express.Router();

// All room routes are protected (must be logged in)
router.use(protect);

// ── Get My Rooms ─────────────────────────────────────
router.get("/my-rooms", getMyRooms);

// ── Create Room ──────────────────────────────────────
router.post(
  "/create",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage("Room name must be 2 to 30 characters"),
  ],
  createRoom
);

// ── Join Room ────────────────────────────────────────
router.post("/join", joinRoom);

// ── Get Room Details ─────────────────────────────────
router.get("/:id", getRoom);

// ── End Room ─────────────────────────────────────────
router.patch("/:id/end", endRoom);

module.exports = router;