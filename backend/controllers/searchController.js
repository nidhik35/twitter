const User = require("../models/User");
const Tweet = require("../models/Tweet");

// Search Users
const searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q;

    const users = await User.find({
      username: {
        $regex: query,
        $options: "i",
      },
    }).select("username profileImageUrl");

    res.status(200).json(users);

  } catch (error) {
    next(error);
  }
};

// Search Tweets
const searchTweets = async (req, res, next) => {
  try {
    const query = req.query.q;

    const tweets = await Tweet.find({
      $text: {
        $search: query,
      },
    }).populate(
      "author",
      "username profileImageUrl"
    );

    res.status(200).json(tweets);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchUsers,
  searchTweets,
};