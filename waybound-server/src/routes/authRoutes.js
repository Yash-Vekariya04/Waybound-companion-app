const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// ── Validation Rules ─────────────────────────────────
const registerRules = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("Name must be 2 to 30 characters"),
  body("email")
    .isEmail()
    .withMessage("Enter a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email")
    .isEmail()
    .withMessage("Enter a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// ── Routes ───────────────────────────────────────────
router.post("/register", registerRules, register);
router.post("/login", loginRules, login);
router.post("/push-token", protect, savePushToken);

module.exports = router;