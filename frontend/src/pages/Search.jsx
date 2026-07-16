import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/search/users?q=${query}`
      );

      const data = await res.json();

      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h2>Search Users</h2>

      <input
        type="text"
        placeholder="Search username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "999px",
          border: "1px solid #2f3336",
          background: "#16181c",
          color: "#fff",
          marginTop: "15px",
        }}
      />

      <button
        onClick={handleSearch}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          background: "#1d9bf0",
          color: "#fff",
          border: "none",
          borderRadius: "999px",
          cursor: "pointer",
        }}
      >
        Search
      </button>

      <div style={{ marginTop: "20px" }}>
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => navigate(`/profile/${user._id}`)}
            style={{
              padding: "12px",
              borderBottom: "1px solid #2f3336",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontWeight: "700",
              }}
            >
              {user.username}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}