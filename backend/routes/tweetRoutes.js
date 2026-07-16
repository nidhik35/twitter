const express = require("express");
const router = express.Router();

const {
  createTweet,
  getTweet,
  deleteTweet,
  likeTweet,
  retweetTweet,
  createReply,
  getReplies,
  getFeed,
} = require("../controllers/tweetController");

const protect = require("../middleware/authMiddleware");
const {
  tweetLimiter,
} = require("../middleware/rateLimiter");
// Create Tweet
router.post(
  "/",
  protect,
  tweetLimiter,
  createTweet
);

// Delete Tweet
router.delete("/:id", protect, deleteTweet);
// Get Feed
router.get("/feed", protect, getFeed);

// Get Tweet by ID
router.get("/:id", getTweet);

// Like Tweet
router.post("/:id/like", protect, likeTweet);

router.post("/:id/retweet", protect, retweetTweet);
router.post(
  "/:id/reply",
  protect,
  createReply
);

router.get(
  "/:id/replies",
  getReplies
);

module.exports = router;