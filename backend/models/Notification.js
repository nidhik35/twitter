const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senders: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

count: {
  type: Number,
  default: 1,
},

    type: {
      type: String,
      enum: ["like", "follow", "reply", "retweet"],
      required: true,
    },

    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);