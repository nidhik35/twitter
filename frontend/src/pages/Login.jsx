import { useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#000",
    fontFamily: "-apple-system, 'Inter', sans-serif",
  },
  brandPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "64px 56px",
    borderRight: "1px solid #1a1a1a",
  },
  logo: {
    fontSize: "52px",
    fontWeight: 800,
    color: "#1d9bf0",
    letterSpacing: "-2px",
    marginBottom: "40px",
    lineHeight: 1,
  },
  headline: {
    fontSize: "36px",
    fontWeight: 800,
    color: "#e7e9ea",
    lineHeight: 1.2,
    marginBottom: "16px",
  },
  tagline: {
    fontSize: "16px",
    color: "#536471",
    lineHeight: 1.6,
    maxWidth: "380px",
  },
  features: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  featItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "15px",
    color: "#71767b",
  },
  featDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#1d9bf0",
    flexShrink: 0,
  },
  badgeRow: {
    display: "flex",
    gap: "8px",
    marginTop: "36px",
    flexWrap: "wrap",
  },
  badge: {
    fontSize: "12px",
    padding: "5px 12px",
    borderRadius: "9999px",
    border: "1px solid #2f3336",
    color: "#536471",
  },
  formPanel: {
    width: "420px",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "64px 48px",
  },
  formTitle: {
    fontSize: "26px",
    fontWeight: 800,
    color: "#e7e9ea",
    marginBottom: "6px",
  },
  formSub: {
    fontSize: "15px",
    color: "#536471",
    marginBottom: "36px",
  },
  fieldWrap: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#71767b",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "6px",
    border: "1px solid #2f3336",
    background: "#0d0d0d",
    color: "#e7e9ea",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  inputFocused: {
    borderColor: "#1d9bf0",
  },
  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "8px",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#1d9bf0",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
  },
  submitBtn: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "9999px",
    background: "#1d9bf0",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "8px",
    marginBottom: "24px",
    transition: "background 0.15s",
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },
  divLine: {
    flex: 1,
    height: "1px",
    background: "#2f3336",
  },
  divText: {
    fontSize: "13px",
    color: "#536471",
  },
  ghostBtn: {
    width: "100%",
    padding: "14px",
    border: "1px solid #2f3336",
    borderRadius: "9999px",
    background: "none",
    color: "#e7e9ea",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "28px",
    transition: "background 0.15s",
  },
  switchText: {
    fontSize: "14px",
    color: "#536471",
    textAlign: "center",
    lineHeight: 1.6,
  },
  switchLink: {
    color: "#1d9bf0",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    fontSize: "14px",
  },
  errorBox: {
    background: "rgba(244,33,46,0.1)",
    border: "1px solid rgba(244,33,46,0.3)",
    borderRadius: "6px",
    padding: "12px 14px",
    color: "#f4212e",
    fontSize: "14px",
    marginBottom: "16px",
  },
};

const FEATURES = [
  "Redis-powered feed in under 15ms",
  "Real-time tweets via Socket.io",
  "Cursor-based infinite scroll",
  "JWT-secured, rate-limited API",
];

const BADGES = ["MERN Stack", "Redis", "Socket.io", "MongoDB"];

function FocusInput({ type, placeholder, value, onChange, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...styles.input,
        ...(focused ? styles.inputFocused : {}),
      }}
    />
  );
}

function Login({ onNavigateToRegister }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverGhost, setHoverGhost]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }
localStorage.setItem("token", data.token);
localStorage.setItem("userId", data.user._id);
      // navigate("/home") — plug in your router here
    window.location.href = "/home";
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Responsive: collapse brand panel on small screens ─────────
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div style={styles.page}>

      {/* ── Left brand panel (hidden on mobile) ───────────────── */}
      {!isMobile && (
        <div style={styles.brandPanel}>
          <div style={styles.logo}>Twitter</div>
          <div style={styles.headline}>
            What's happening<br />in your world
          </div>
          <p style={styles.tagline}>
            Join developers sharing ideas, system design insights,
            and real-time tech discussions — powered by Redis and Socket.io.
          </p>
          <div style={styles.features}>
            {FEATURES.map((f) => (
              <div key={f} style={styles.featItem}>
                <div style={styles.featDot} />
                {f}
              </div>
            ))}
          </div>
          <div style={styles.badgeRow}>
            {BADGES.map((b) => (
              <span key={b} style={styles.badge}>{b}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Right form panel ──────────────────────────────────── */}
      <div style={styles.formPanel}>

        {/* Show logo on mobile since brand panel is hidden */}
        {isMobile && <div style={{ ...styles.logo, marginBottom: "24px" }}>Twitter</div>}

        <div style={styles.formTitle}>Sign in to Twitter</div>
        <div style={styles.formSub}>Welcome back. Enter your details below.</div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldWrap}>
            <label style={styles.label}>Email address</label>
            <FocusInput
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div style={styles.fieldWrap}>
            <label style={styles.label}>Password</label>
            <FocusInput
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <div style={styles.forgotRow}>
              <button type="button" style={styles.forgotLink}>
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setHoverSubmit(true)}
            onMouseLeave={() => setHoverSubmit(false)}
            style={{
              ...styles.submitBtn,
              background: hoverSubmit ? "#1a8cd8" : "#1d9bf0",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div style={styles.dividerRow}>
          <div style={styles.divLine} />
          <span style={styles.divText}>or</span>
          <div style={styles.divLine} />
        </div>

        <button
          type="button"
          onMouseEnter={() => setHoverGhost(true)}
          onMouseLeave={() => setHoverGhost(false)}
        onClick={() => {
  window.location.href = "/register";
}}
          style={{
            ...styles.ghostBtn,
            background: hoverGhost ? "#0d0d0d" : "none",
          }}
        >
          Create a new account
        </button>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <button type="button" style={styles.switchLink} onClick={() => {}}>
            Sign in
          </button>
          <br />
          <span style={{ fontSize: "12px", color: "#2f3336", marginTop: "8px", display: "block" }}>
            By continuing you agree to our Terms of Service and Privacy Policy.
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;