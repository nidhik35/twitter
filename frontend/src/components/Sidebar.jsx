import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import socket from "../services/socket";
const NAV = [
  { icon: "🏠", label: "Home" },
  { icon: "#", label: "Explore" },
  { icon: "🔔", label: "Notifications" },
  { icon: "✉️", label: "Messages" },
  { icon: "🔖", label: "Bookmarks" },
  { icon: "👤", label: "Profile" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] =
    useState(0);

 useEffect(() => {
  fetchNotificationCount();

  socket.on("newNotification", () => {
    console.log("New notification received");
    fetchNotificationCount();
  });

  return () => {
    socket.off("newNotification");
  };
}, []);
  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("token");

     const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/notifications/count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setNotificationCount(data.count || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/login");
  };

  const handleNavigation = (label) => {
    if (label === "Notifications") {
      navigate("/notifications");
    }

    if (label === "Home") {
      navigate("/home");
    }

    if (label === "Explore") {
      navigate("/search");
    }

    if (label === "Profile") {
      const userId =
        localStorage.getItem("userId");
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px 0",
        borderRight: "0.5px solid #2f3336",
        gap: 4,
      }}
    >
      <div
        style={{
          padding: 12,
          marginBottom: 4,
          fontSize: 28,
          color: "#fff",
        }}
      >
        𝕏
      </div>

      {NAV.map(({ icon, label }) => (
        <button
          key={label}
          title={label}
          onClick={() =>
            handleNavigation(label)
          }
          style={{
            position: "relative",
            width: 48,
            height: 48,
            borderRadius: "999px",
            border: "none",
            background: "transparent",
            color: "#e7e9ea",
            cursor: "pointer",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}

          {label === "Notifications" &&
            notificationCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "#f4212e",
                  minWidth: 18,
                  height: 18,
                  borderRadius: "999px",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  padding: "0 4px",
                }}
              >
                {notificationCount}
              </span>
            )}
        </button>
      ))}

      <button
        style={{
          marginTop: "auto",
          marginBottom: 12,
          width: 48,
          height: 48,
          borderRadius: "999px",
          background: "#1d9bf0",
          border: "none",
          color: "#fff",
          fontSize: 22,
          cursor: "pointer",
        }}
      >
        ✏
      </button>

      <button
        onClick={handleLogout}
        style={{
          marginBottom: 12,
          padding: "10px 16px",
          borderRadius: "999px",
          border: "none",
          background: "#f4212e",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: 12,
        }}
      >
        Logout
      </button>

      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "999px",
          background: "#1d9bf0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          color: "#fff",
          marginBottom: 8,
        }}
      >
        👤
      </div>
    </nav>
  );
}