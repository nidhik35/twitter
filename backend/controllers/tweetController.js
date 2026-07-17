const Tweet = require("../models/Tweet");
const User = require("../models/User");
const redisClient = require("../config/redis");
const Reply = require("../models/Reply");
const Notification = require("../models/Notification");

// Create Tweet
// Create Tweet
const createTweet = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    // Extract hashtags from tweet content
    const hashtags = [...new Set(
      (content.match(/#\w+/g) || []).map(tag => tag.toLowerCase())
    )];

    const tweet = await Tweet.create({
      author: req.user.id,
      content,
      hashtags,
    });

    // Populate author so frontend gets user details immediately
    await tweet.populate("author", "name username profileImageUrl");

    // Emit realtime event
    const io = req.app.get("io");
    io.emit("newTweet", tweet);

    // Increase tweet count
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { tweetsCount: 1 },
      }
    );

    res.status(201).json(tweet);

  } catch (error) {
    next(error);
  }
};
// Get Tweet by ID
const getTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id)
      .populate("author", "username profileImageUrl");

    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found",
      });
    }

    res.status(200).json(tweet);

  } catch (error) {
    next(error);
  }
};

// Delete Tweet
const deleteTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found",
      });
    }

    // Check ownership
    if (tweet.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await tweet.deleteOne();

    // Decrease tweet count
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { tweetsCount: -1 } }
    );

    res.status(200).json({
      message: "Tweet deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};

// Like / Unlike Tweet
const likeTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found",
      });
    }

    const userId = req.user.id;

    const alreadyLiked = tweet.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      tweet.likes = tweet.likes.filter(
        (id) => id.toString() !== userId
      );

      await tweet.save();

      await Notification.deleteOne({
        recipient: tweet.author,
        sender: userId,
        type: "like",
        tweet: tweet._id,
      });

      await redisClient.flushAll();

      return res.json({
        message: "Tweet unliked",
      });
    }

    tweet.likes.push(userId);

    await tweet.save();
    await redisClient.flushAll();
if (tweet.author.toString() !== userId) {

  // Find an existing unread like notification for this tweet
  const existingNotification = await Notification.findOne({
    recipient: tweet.author,
    type: "like",
    tweet: tweet._id,
    read: false,
  });

  if (existingNotification) {

    // Add sender only if not already present
    if (
      !existingNotification.senders.some(
        (id) => id.toString() === userId
      )
    ) {
      existingNotification.senders.push(userId);
      existingNotification.count += 1;

      await existingNotification.save();
    }

  } else {

    await Notification.create({
      recipient: tweet.author,
      sender: userId,
      senders: [userId],
      count: 1,
      type: "like",
      tweet: tweet._id,
    });

  }

  const io = req.app.get("io");
  io.emit("newNotification");
}
    return res.json({
      message: "Tweet liked",
    });

  } catch (error) {
    next(error);
  }
};
// Feed API with Redis Cache + Pagination
// Feed API with Cursor Pagination + Redis Cache
const getFeed = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor;

    // Redis cache key
    // Redis cache key
const cacheKey = `feed:${req.user.id}:${cursor || "first"}:${limit}`;

// TEMPORARY: clear Redis cache
//await redisClient.flushAll();

// Check Redis first
const cachedFeed = await redisClient.get(cacheKey);

  if (cachedFeed) {
      console.log("Feed served from Redis");

     return res.status(200).json(
       JSON.parse(cachedFeed)
      );
    }

    // Get current user
    const currentUser = await User.findById(req.user.id);

    // Build query
  let query = {
  author: {
    $in: [...currentUser.following, req.user.id],
  },
};

    // Cursor pagination
    if (cursor) {
      query._id = {
        $lt: cursor,
      };
    }

    // Fetch tweets
    const tweets = await Tweet.find(query)
      .populate(
        "author",
        "username profileImageUrl"
      )
      .sort({ _id: -1 })
      .limit(limit);

    // Next cursor
    const nextCursor =
      tweets.length > 0
        ? tweets[tweets.length - 1]._id
        : null;

   const response = {
  tweets,
  nextCursor,
};

// Store in Redis for 60 seconds
await redisClient.set(
  cacheKey,
  JSON.stringify(response),
  {
    EX: 60,
  }
);

res.status(200).json(response);

    console.log("Feed served from MongoDB");

    res.status(200).json(response);

  } catch (error) {
    next(error);
  }
};
const retweetTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found",
      });
    }

    const userId = req.user.id;

    const alreadyRetweeted = tweet.retweets.some(
      (id) => id.toString() === userId
    );

    if (alreadyRetweeted) {
      tweet.retweets = tweet.retweets.filter(
        (id) => id.toString() !== userId
      );

      tweet.retweetCount -= 1;

      await tweet.save();
      await redisClient.flushAll();

      return res.json({
        message: "Retweet removed",
      });
    }

    tweet.retweets.push(userId);
    tweet.retweetCount += 1;

    await tweet.save();
    await redisClient.flushAll();

    res.json({
      message: "Tweet retweeted",
    });

  } catch (error) {
    next(error);
  }
};
const createReply = async (req, res, next) => {
  try {
    const { content } = req.body;

    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found",
      });
    }

  const reply = await Reply.create({
  tweet: tweet._id,
  author: req.user.id,
  content,
});

if (tweet.author.toString() !== req.user.id) {
  await Notification.create({
    recipient: tweet.author,
    sender: req.user.id,
    type: "reply",
    tweet: tweet._id,
  });

}
const io = req.app.get("io");
io.emit("newNotification");

tweet.replyCount += 1;
await tweet.save();
    await redisClient.flushAll();

    res.status(201).json(reply);

  } catch (error) {
    next(error);
  }
};
const getReplies = async (req, res, next) => {
  try {
    const replies = await Reply.find({
      tweet: req.params.id,
    })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(replies);

  } catch (error) {
    next(error);
  }
};
module.exports = {
  createTweet,
  getTweet,
  deleteTweet,
  likeTweet,
  getFeed,
  retweetTweet,
  createReply,
  getReplies,
};