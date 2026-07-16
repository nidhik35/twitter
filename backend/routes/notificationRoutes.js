const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getNotifications,
    getNotificationCount,
} = require("../controllers/notificationController");
router.get(
  "/count",
  protect,
  getNotificationCount
);
router.get("/", protect, getNotifications);

module.exports = router;