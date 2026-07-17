import { useEffect, useState } from "react";
import socket from "../services/socket";
import Sidebar from "../components/Sidebar";
import Composer from "../components/composer";
import Tweet from "../components/Tweet";
import RightSidebar from "../components/RightSidebar";

export default function Home() {
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState("for-you");

 useEffect(() => {
  fetchFeed();

  socket.on("newTweet", (tweet) => {
    console.log("New Tweet Received:", tweet);
    fetchFeed();
  });

  return () => {
    socket.off("newTweet");
  };
}, []);
  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/tweets/feed?limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log(data);
if (Array.isArray(data.tweets)) {
const currentUserId = localStorage.getItem("userId");

const formattedTweets = data.tweets.map((tweet) => {
  console.log("CURRENT USER:", currentUserId);
  console.log("TWEET LIKES:", tweet.likes);

  return {
    id: tweet._id,
    authorId: tweet.author._id,
    name: tweet.author.username,
    handle: tweet.author.username,
    avatarBg: "#1d9bf0",
    time: new Date(tweet.createdAt).toLocaleDateString(),
    verified: false,
    text: tweet.content,

    likes: tweet.likes?.length || 0,
    retweets: tweet.retweetCount || 0,
    replies: tweet.replyCount || 0,

    liked: tweet.likes?.some(
      (likeId) => likeId.toString() === currentUserId
    ) || false,

    retweeted: false,
  };
});

setTweets(formattedTweets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePost = async (text) => {
  console.log("TEXT:", text);

  const token = localStorage.getItem("token");
  console.log("TOKEN:", token);

  try {
  const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/tweets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: text,
        }),
      }
    );

    console.log("STATUS:", res.status);

    const data = await res.json();
    console.log("DATA:", data);

   

    if (res.ok) {
      fetchFeed();
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
};
  const handleLike = async (id) => {
  console.log("LIKE CLICKED:", id);

  try {
    const token = localStorage.getItem("token");

   const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/tweets/${id}/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    console.log(data);

    fetchFeed();
  } catch (error) {
    console.log(error);
  }
};
const handleReply = async (tweetId, content) => {
  if (!content) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/tweets/${tweetId}/reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
        }),
      }
    );

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      fetchFeed();
    }
  } catch (error) {
    console.log(error);
  }
};
  const handleRetweet = async (id) => {
  console.log("RETWEET CLICKED", id);

  try {
    const token = localStorage.getItem("token");

  const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/tweets/${id}/retweet`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("STATUS:", res.status);

    const data = await res.json();

    console.log("DATA:", data);

    fetchFeed();
  } catch (error) {
    console.log(error);
  }
};
   

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "72px 1fr 320px",
        minHeight: "100vh",
        background: "#000",
        color: "#e7e9ea",
      }}
    >
      <Sidebar />

      <main
        style={{
          borderRight: "0.5px solid #2f3336",
        }}
      >
        <div
          style={{
            borderBottom: "0.5px solid #2f3336",
            display: "flex",
          }}
        >
          {["for-you", "following"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "16px 0 14px",
                color:
                  activeTab === tab
                    ? "#e7e9ea"
                    : "#71767b",
                fontWeight:
                  activeTab === tab ? 700 : 400,
                borderBottom:
                  activeTab === tab
                    ? "2px solid #1d9bf0"
                    : "2px solid transparent",
                cursor: "pointer",
                fontSize: 15,
              }}
            >
              {tab === "for-you"
                ? "For you"
                : "Following"}
            </div>
          ))}
        </div>

        <Composer onPost={handlePost} />

        {tweets.map((t) => (
         <Tweet
  key={t.id}
  tweet={t}
  onLike={handleLike}
  onRetweet={handleRetweet}
  onReply={handleReply}
/>
        ))}
      </main>

      <RightSidebar />
    </div>
  );
}