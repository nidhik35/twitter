const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    })
      .populate("sender", "username")
.populate("senders", "username")

      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getNotificationCount = async (
  req,
  res
) => {
  try {
    const count =
      await Notification.countDocuments({
        recipient: req.user.id,
      });

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getNotifications,
   getNotificationCount,
};