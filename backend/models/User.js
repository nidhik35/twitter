const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 160,
    },

    profileImageUrl: {
      type: String,
      default: "",
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    tweetsCount: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search and feed generation

userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });

module.exports = mongoose.model("User", userSchema);
const User = require("../models/User");

const getSuggestedUsers = async (req, res) => {
  try {
    // Logged-in user
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Exclude yourself and users you already follow
    const excludedUsers = [
      currentUser._id,
      ...currentUser.following,
    ];

    const suggestions = await User.find({
      _id: { $nin: excludedUsers },
    })
      .select(
        "username profileImageUrl followers tweetsCount isVerified"
      )
      .limit(5);

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};