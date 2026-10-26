const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    icon: {
      type: String,
      default: "🚴",
    },
    maxMembers: {
      type: Number,
      default: 6,
      min: 2,
      max: 20,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
    safetyAlerts: {
      type: Boolean,
      default: true,
    },
    shareLocation: {
      type: Boolean,
      default: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);