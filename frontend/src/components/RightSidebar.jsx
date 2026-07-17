import { useEffect, useState } from "react";



export default function RightSidebar() {
  const [trends, setTrends] = useState([]);
const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
  fetchTrending();
  fetchSuggestions();
}, []);
const fetchTrending = async () => {
  try {
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/trending`);

    if (!res.ok) {
      throw new Error("Failed to fetch trending hashtags");
    }

    const data = await res.json();
    setTrends(data);
  } catch (error) {
    console.error(error);
  }
};
 const fetchSuggestions = async () => {
  try {
    const token = localStorage.getItem("token");

   const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/users/suggestions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch suggestions");
    }

    const data = await res.json();

    setSuggestions(data);

  } catch (error) {
    console.error(error);
  }
};
const handleFollow = async (userId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
     `${import.meta.env.VITE_API_URL}/api/users/follow/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    // Remove followed user from suggestions
    // Refresh suggestions after following
await fetchSuggestions();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};
  return (
    <aside
      style={{
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Search Box */}
      <input
        placeholder="Search"
        style={{
          width: "100%",
          background: "#202327",
          border: "1px solid transparent",
          borderRadius: "999px",
          padding: "10px 16px",
          color: "#e7e9ea",
          fontSize: 15,
          outline: "none",
        }}
      />

      {/* Trending */}
      <div
        style={{
          background: "#16181c",
          borderRadius: 16,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            padding: "14px 16px 10px",
            color: "#e7e9ea",
          }}
        >
          Trends for you
        </div>

        {trends.length === 0 ? (
          <div
            style={{
              padding: "16px",
              color: "#71767b",
            }}
          >
            No trending hashtags yet.
          </div>
        ) : (
          trends.map((trend) => (
            <div
              key={trend.hashtag}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                borderTop: "1px solid #2f3336",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#71767b",
                }}
              >
                Trending
              </div>

              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#e7e9ea",
                }}
              >
                {trend.hashtag}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#71767b",
                }}
              >
                {trend.count} post{trend.count !== 1 ? "s" : ""}
              </div>
            </div>
          ))
        )}
      </div>
{/* Who to Follow */}
<div
  style={{
    background: "#16181c",
    borderRadius: 16,
  }}
>
  <div
    style={{
      fontSize: 20,
      fontWeight: 800,
      padding: "14px 16px 10px",
      color: "#e7e9ea",
    }}
  >
    Who to follow
  </div>

  {suggestions.length === 0 ? (
   <div
  style={{
    padding: "16px",
    color: "#71767b",
    textAlign: "center",
    lineHeight: 1.6,
  }}
>
  🎉 You're following everyone!
  <br />
  Check back later for more suggestions.
</div>
  ) : (
    suggestions.map((user) => (
      <div
        key={user._id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          borderTop: "1px solid #2f3336",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            overflow: "hidden",
            background: "#1d9bf0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.username}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            user.username?.charAt(0).toUpperCase()
          )}
        </div>

        {/* User Details */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                color: "#e7e9ea",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {user.username}
            </span>

            {user.isVerified && (
              <span
                style={{
                  color: "#1d9bf0",
                  fontSize: 14,
                }}
              >
                ✔
              </span>
            )}
          </div>

          <div
            style={{
              color: "#71767b",
              fontSize: 13,
            }}
          >
            @{user.username}
          </div>

          <div
            style={{
              color: "#71767b",
              fontSize: 12,
            }}
          >
            {(user.followers?.length || 0)} Followers
          </div>
        </div>

        {/* Follow Button */}
       <button
  onClick={() => handleFollow(user._id)}
  style={{
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "999px",
    padding: "8px 18px",
    fontWeight: 700,
    cursor: "pointer",
  }}
>
  Follow
</button>
      </div>
    ))
  )}
</div>
    </aside>
  );
}