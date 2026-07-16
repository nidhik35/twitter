const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      maxlength: 280,
      trim: true,
    },

    // Stores hashtags extracted from tweet content
    hashtags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    retweets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    retweetCount: {
      type: Number,
      default: 0,
    },

    replyCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Feed generation
tweetSchema.index({ author: 1, createdAt: -1 });

// Text search
tweetSchema.index({ content: "text" });

// Fast hashtag lookup
tweetSchema.index({ hashtags: 1 });

module.exports = mongoose.model("Tweet", tweetSchema);