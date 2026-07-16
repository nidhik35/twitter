const express = require("express");
const router = express.Router();

const {
  getTrendingHashtags,
} = require("../controllers/trendingController");

router.get("/", getTrendingHashtags);

module.exports = router;