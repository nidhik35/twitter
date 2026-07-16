const Tweet = require("../models/Tweet");

const getTrendingHashtags = async (req, res, next) => {
  try {
    const trending = await Tweet.aggregate([
      // Break hashtags array into separate documents
      {
        $unwind: "$hashtags",
      },

      // Count each hashtag
      {
        $group: {
          _id: "$hashtags",
          count: { $sum: 1 },
        },
      },

      // Highest count first
      {
        $sort: {
          count: -1,
        },
      },

      // Top 10
      {
        $limit: 10,
      },

      // Rename fields
      {
        $project: {
          _id: 0,
          hashtag: "$_id",
          count: 1,
        },
      },
    ]);

    res.status(200).json(trending);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTrendingHashtags,
};