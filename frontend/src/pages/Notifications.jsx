import { useEffect, useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

  const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log(data);
      setNotifications(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2>🔔 Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            style={{
              padding: "15px",
              borderBottom: "1px solid #2f3336",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#1d9bf0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {n.sender?.username?.[0]?.toUpperCase()}
              </div>

              <div>
                <strong>
  {n.senders?.length > 0
    ? n.senders[0].username
    : n.sender?.username}
</strong>

                {n.type === "follow" && (
                  <span> followed you 👤</span>
                )}

              {n.type === "like" && (
  <span>
    {n.count > 1 ? (
      <>
        {" "}
        and {n.count - 1} other
        {n.count > 2 ? "s" : ""} liked your tweet ❤️
      </>
    ) : (
      <> liked your tweet ❤️</>
    )}
  </span>
)}

                {n.type === "reply" && (
                  <span> replied to your tweet 💬</span>
                )}

                {n.type === "retweet" && (
                  <span> retweeted your tweet 🔁</span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}