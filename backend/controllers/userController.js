const User = require("../models/User");
const Tweet = require("../models/Tweet");
const Notification = require("../models/Notification");

const followUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({
        message: "Already following user",
      });
    }

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();
    await Notification.create({
  recipient: targetUserId,
  sender: currentUserId,
  type: "follow",
});
const io = req.app.get("io");
io.emit("newNotification");

    res.status(200).json({
      message: "User followed successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      message: "User unfollowed successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      bio: user.bio,
      profileImageUrl: user.profileImageUrl,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      tweetsCount: user.tweetsCount,
      isVerified: user.isVerified,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getUserTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find({
      author: req.params.id,
    })
      .populate("author", "username profileImageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(tweets);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const checkFollowStatus = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const isFollowing = currentUser.following.some(
      (id) => id.toString() === req.params.id
    );

    res.json({
      isFollowing,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { bio, profileImageUrl } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        bio,
        profileImageUrl,
      },
      { new: true }
    ).select("-password -refreshToken");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getSuggestedUsers = async (req, res) => {
  try {
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
module.exports = {
  followUser,
  unfollowUser,
   getUserProfile,
    getUserTweets,
    checkFollowStatus,
    updateProfile,
    getSuggestedUsers,
};