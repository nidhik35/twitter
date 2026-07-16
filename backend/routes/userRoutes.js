const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  followUser,
  unfollowUser,
  getUserProfile,
  getUserTweets,
  checkFollowStatus,
  updateProfile,
  getSuggestedUsers,
} = require("../controllers/userController");

// Suggestions (must come before /:id routes)
router.get("/suggestions", protect, getSuggestedUsers);

// Profile update
router.put("/profile", protect, updateProfile);

// Follow / Unfollow
router.post("/follow/:id", protect, followUser);
router.post("/unfollow/:id", protect, unfollowUser);

// Follow status
router.get("/:id/follow-status", protect, checkFollowStatus);

// User tweets
router.get("/:id/tweets", getUserTweets);

// User profile (keep LAST)
router.get("/:id", getUserProfile);

module.exports = router;