import { useState } from "react";
import { useNavigate } from "react-router-dom";

const fmt = (n) =>
  n >= 1000 ? (n / 1000).toFixed(1) + "K" : n;

export default function Tweet({
  tweet,
  onLike,
  onRetweet,
   onReply,
}) {
  const navigate = useNavigate();
   const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const {
    id,
    authorId,
    name,
    handle,
    avatarBg,
    avatarColor = "#fff",
    time,
    verified,
    text,
    likes,
    retweets,
    replies,
    liked,
    retweeted,
  } = tweet;

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "14px 20px",
        borderBottom: "0.5px solid #2f3336",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "999px",
          background: avatarBg,
          color: avatarColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 15,
          flexShrink: 0,
        }}
      >
        {name[0]}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            marginBottom: 4,
            flexWrap: "wrap",
          }}
        >
          <span
            onClick={(e) => {
              e.stopPropagation();
              console.log("Profile:", authorId);
              navigate(`/profile/${authorId}`);
            }}
            style={{
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              color: "yellow",
            }}
          >
            {name}
            {verified && " ✓"}
          </span>

          <span
            onClick={(e) => {
              e.stopPropagation();
              console.log("Profile:", authorId);
              navigate(`/profile/${authorId}`);
            }}
            style={{
              color: "#71767b",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            @{handle}
          </span>

          <span style={{ color: "#71767b" }}>·</span>

          <span
            style={{
              color: "#71767b",
              fontSize: 15,
            }}
          >
            {time}
          </span>
        </div>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.5,
            marginBottom: 12,
          }}
        >
          {text}
        </p>

        <div
          style={{
            display: "flex",
            gap: 4,
            marginLeft: -8,
          }}
        >
       <ActionBtn
  icon="💬"
  count={replies}
  onClick={() => setShowReplyBox(!showReplyBox)}
/>

          <ActionBtn
            icon="🔁"
            count={retweets}
            active={retweeted}
            activeColor="#00ba7c"
            onClick={() => onRetweet(id)}
          />

          <ActionBtn
            icon={liked ? "❤️" : "🤍"}
            count={likes}
            active={liked}
            activeColor="#f91880"
            onClick={() => onLike(id)}
          />

          <ActionBtn icon="🔖" />
          <ActionBtn icon="↗" />
        </div>
        {showReplyBox && (
  <div
    style={{
      marginTop: "12px",
      background: "#16181c",
      padding: "12px",
      borderRadius: "12px",
      border: "1px solid #2f3336",
    }}
  >
    <textarea
      value={replyText}
      onChange={(e) => setReplyText(e.target.value)}
      placeholder="Write a reply..."
      style={{
        width: "100%",
        minHeight: "80px",
        background: "#000",
        color: "#fff",
        border: "1px solid #2f3336",
        borderRadius: "10px",
        padding: "10px",
      }}
    />

    <button
      onClick={() => {
        onReply(id, replyText);
        setReplyText("");
        setShowReplyBox(false);
      }}
      style={{
        marginTop: "10px",
        background: "#1d9bf0",
        color: "#fff",
        border: "none",
        padding: "8px 18px",
        borderRadius: "999px",
        cursor: "pointer",
      }}
    >
      Reply
    </button>
  </div>
)}
      </div>
    </div>
  );
}

function ActionBtn({
  icon,
  count,
  active,
  activeColor,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 8px",
        borderRadius: "999px",
        border: "none",
        background: "transparent",
        color: active
          ? activeColor
          : "#71767b",
        cursor: "pointer",
        fontSize: 13,
        minWidth: 60,
      }}
    >
      <span style={{ fontSize: 16 }}>
        {icon}
      </span>
      {count != null && fmt(count)}
    </button>
  );
}