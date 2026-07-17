import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();
 const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [following, setFollowing] = useState(false);
  const [hoveringFollow, setHoveringFollow] = useState(false);
  const [activeTab, setActiveTab] = useState("Posts");
  const [editing, setEditing] = useState(false);
const [bio, setBio] = useState("");
const [profileImageUrl, setProfileImageUrl] = useState("");

useEffect(() => {
  fetchProfile();
  fetchTweets();
   checkFollowStatus();
}, [id]);

  const fetchProfile = async () => {
    try {
     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`);
      const data = await res.json();
      setProfile(data);
      setBio(data.bio || "");
setProfileImageUrl(data.profileImageUrl || "");
    } catch (err) {
      console.log(err);
    }
  };
  const checkFollowStatus = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
   `${import.meta.env.VITE_API_URL}/api/users/${id}/follow-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    setFollowing(data.isFollowing);
  } catch (error) {
    console.log(error);
  }
};
const fetchTweets = async () => {
  try {
    const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/${id}/tweets`
    );

    const data = await res.json();

    setTweets(data);
  } catch (error) {
    console.log(error);
  }
};
const handleFollow = async () => {
  try {
    const token = localStorage.getItem("token");

    const endpoint = following
      ? "unfollow"
      : "follow";

    const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/users/${endpoint}/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      setFollowing(!following);
      fetchProfile();
    }
  } catch (error) {
    console.log(error);
  }
};
const handleSaveProfile = async () => {
  try {
    const token = localStorage.getItem("token");

   const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/users/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio,
          profileImageUrl,
        }),
      }
    );

    const data = await res.json();

    console.log(data);

    setEditing(false);
    fetchProfile();
  } catch (error) {
    console.log(error);
  }
};
  if (!profile) return (
    <div style={{ background: "#000", color: "#71767b", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
      <span>Loading profile…</span>
    </div>
  );

  const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + "K" : n;
  const tabs = ["Posts", "Replies", "Media", "Likes"];
const handleDeleteTweet = async (tweetId) => {
  try {
    const token = localStorage.getItem("token");

  const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/tweets/${tweetId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      fetchTweets();
      fetchProfile();
    }
  } catch (error) {
    console.log(error);
  }
};
  return (
    <div style={{ background: "#000", color: "#e7e9ea", minHeight: "100vh", maxWidth: 600, margin: "0 auto", borderLeft: "0.5px solid #2f3336", borderRight: "0.5px solid #2f3336", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* Sticky header */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 16px", position: "sticky", top: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 10, borderBottom: "0.5px solid #2f3336" }}>
        <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "transparent", color: "#e7e9ea", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{profile.username}</div>
          <div style={{ fontSize: 13, color: "#71767b" }}>{fmt(profile.tweetsCount)} posts</div>
        </div>
      </div>

      {/* Banner */}
      <div style={{ height: 180, background: "linear-gradient(135deg, #1d9bf0 0%, #0d6eaf 100%)" }} />

      {/* Avatar */}
      <div style={{ width: 108, height: 108, borderRadius: "50%", background: "#333", border: "4px solid #000", marginTop: -54, marginLeft: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 700, color: "#fff" }}>
        {profile.username[0].toUpperCase()}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 16px 0" }}>
        {["⋯", "✉"].map(icon => (
          <button key={icon} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid #536471", background: "transparent", color: "#e7e9ea", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</button>
        ))}
     {currentUserId === id && (
  <button
    onClick={() => setEditing(true)}
    style={{
      padding: "0 20px",
      height: 34,
      borderRadius: 999,
      border: "1px solid #536471",
      background: "transparent",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 700,
    }}
  >
    Edit Profile
  </button>
)}

{currentUserId !== id && (
  <button
    onClick={handleFollow}
    onMouseEnter={() => setHoveringFollow(true)}
    onMouseLeave={() => setHoveringFollow(false)}
    style={{
      padding: "0 20px",
      height: 34,
      borderRadius: 999,
      fontWeight: 700,
      fontSize: 15,
      cursor: "pointer",
      background: following ? "transparent" : "#e7e9ea",
      color:
        following && hoveringFollow
          ? "#f4212e"
          : following
          ? "#e7e9ea"
          : "#000",
      border: following
        ? `1px solid ${
            hoveringFollow ? "#f4212e" : "#536471"
          }`
        : "none",
    }}
  >
    {following
      ? hoveringFollow
        ? "Unfollow"
        : "Following"
      : "Follow"}
  </button>
)}
      </div>

      {/* Info */}
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{profile.username}</div>
        <div style={{ color: "#71767b", fontSize: 15, marginTop: 2 }}>@{profile.username}</div>
        {profile.bio && <p style={{ fontSize: 15, lineHeight: 1.5, marginTop: 12 }}>{profile.bio}</p>}

        {/* Meta */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12, color: "#71767b", fontSize: 14 }}>
          {profile.location && <span>📍 {profile.location}</span>}
          {profile.website && <span style={{ color: "#1d9bf0" }}>🔗 {profile.website}</span>}
          <span>📅 Joined {profile.joinedDate || "2021"}</span>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 20, marginTop: 14, fontSize: 14 }}>
          <span><strong style={{ color: "#e7e9ea" }}>{fmt(profile.followingCount)}</strong> <span style={{ color: "#71767b" }}>Following</span></span>
          <span><strong style={{ color: "#e7e9ea" }}>{fmt(profile.followersCount)}</strong> <span style={{ color: "#71767b" }}>Followers</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "0.5px solid #2f3336", marginTop: 14 }}>
        {tabs.map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, textAlign: "center", padding: "16px 0 13px", fontSize: 15, cursor: "pointer",
            color: activeTab === tab ? "#e7e9ea" : "#71767b",
            fontWeight: activeTab === tab ? 700 : 400,
            borderBottom: activeTab === tab ? "2px solid #1d9bf0" : "2px solid transparent",
          }}>{tab}</div>
        ))}
      </div>
      {editing && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <div
      style={{
        width: "500px",
        background: "#000",
        border: "1px solid #2f3336",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Edit Profile</h2>

        <button
          onClick={() => setEditing(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      <label
        style={{
          color: "#71767b",
          fontSize: "14px",
        }}
      >
        Bio
      </label>

      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={4}
        placeholder="Tell people about yourself"
        style={{
          width: "100%",
          marginTop: "8px",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #2f3336",
          background: "#16181c",
          color: "#fff",
          resize: "none",
        }}
      />

      <label
        style={{
          color: "#71767b",
          fontSize: "14px",
          marginTop: "16px",
          display: "block",
        }}
      >
        Profile Image URL
      </label>

      <input
        type="text"
        value={profileImageUrl}
        onChange={(e) =>
          setProfileImageUrl(e.target.value)
        }
        placeholder="https://..."
        style={{
          width: "100%",
          marginTop: "8px",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #2f3336",
          background: "#16181c",
          color: "#fff",
        }}
      />

      <button
        onClick={handleSaveProfile}
        style={{
          marginTop: "24px",
          width: "100%",
          padding: "12px",
          borderRadius: "999px",
          border: "none",
          background: "#1d9bf0",
          color: "#fff",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        Save Changes
      </button>
    </div>
  </div>
)}

      <div>
  {tweets.map((tweet) => (
    <div
      key={tweet._id}
      style={{
        padding: "16px",
        borderBottom: "0.5px solid #2f3336",
      }}
    >
      <div
        style={{
          fontWeight: "700",
          marginBottom: "6px",
        }}
      >
        @{tweet.author.username}
      </div>

    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <div>{tweet.content}</div>

  {currentUserId === tweet.author._id && (
    <button
      onClick={() => handleDeleteTweet(tweet._id)}
      style={{
        background: "transparent",
        border: "none",
        color: "#f4212e",
        cursor: "pointer",
        fontSize: "18px",
      }}
    >
      🗑️
    </button>
  )}
</div>

      <div
        style={{
          color: "#71767b",
          fontSize: "13px",
          marginTop: "8px",
        }}
      >
        {new Date(tweet.createdAt).toLocaleDateString()}
      </div>
    </div>
  ))}
</div>
    </div>
  );
}