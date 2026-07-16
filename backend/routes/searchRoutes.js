const express = require("express");
const router = express.Router();

const {
  searchUsers,
  searchTweets,
} = require("../controllers/searchController");

router.get("/users", searchUsers);
router.get("/tweets", searchTweets);

module.exports = router;