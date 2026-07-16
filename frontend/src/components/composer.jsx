import { useState } from "react";

const MAX = 280;

export default function Composer({ onPost }) {
  const [text, setText] = useState("");
  const pct = text.length / MAX;
  const circumference = 75.4;
  const offset = circumference - pct * circumference;
  const ringColor = pct > 0.8 ? "#ffd400" : "#1d9bf0";

const handlePost = () => {
  console.log("POST CLICKED");
  console.log(text);

  if (!text.trim()) return;

  onPost(text.trim());
  setText("");
};

  return (
    <div style={{ display: "flex", gap: 12, padding: "16px 20px", borderBottom: "0.5px solid #2f3336" }}>
      <div style={{ width: 40, height: 40, borderRadius: "999px", background: "#1d9bf0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", flexShrink: 0 }}>Y</div>
      <div style={{ flex: 1 }}>
        <textarea
          value={text} onChange={e => setText(e.target.value.slice(0, MAX))}
          placeholder="What is happening?!"
          rows={2}
          style={{ background: "transparent", border: "none", color: "#e7e9ea", fontSize: 20, width: "100%", resize: "none", outline: "none", fontFamily: "inherit" }}
        />
        <div style={{ display: "flex", alignItems: "center", paddingTop: 12, borderTop: "0.5px solid #2f3336", gap: 4 }}>
          {["📷", "GIF", "📊", "😊", "📅"].map(icon => (
            <button key={icon} style={{ background: "transparent", border: "none", color: "#1d9bf0", cursor: "pointer", padding: "6px 8px", borderRadius: "999px", fontSize: 16 }}>{icon}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="14" cy="14" r="12" strokeWidth="2" stroke="#2f3336" fill="none" />
              <circle cx="14" cy="14" r="12" strokeWidth="2" stroke={ringColor} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.15s" }} />
            </svg>
            <div style={{ width: 1, height: 28, background: "#2f3336" }} />
            <button onClick={handlePost} disabled={!text.trim()} style={{ background: "#1d9bf0", border: "none", color: "#fff", fontWeight: 700, fontSize: 15, padding: "8px 20px", borderRadius: "999px", cursor: text.trim() ? "pointer" : "default", opacity: text.trim() ? 1 : 0.5 }}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}