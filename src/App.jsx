import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FuelStats from "./Components/FuelStats";
import Preloader from "./Components/Preloader";

/* ─── FuelGaze Logo ─────────────────────────────────────────── */
const FuelGazeLogo = () => (
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: 9,
    userSelect: "none",
  }}>
    {/* Icon — fuel drop with gaze/eye detail */}
    <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 0 C14 0 1 14 1 21 C1 27.6 6.9 31 14 31 C21.1 31 27 27.6 27 21 C27 14 14 0 14 0Z"
        fill="url(#dropGrad)"
      />
      {/* Shine highlight */}
      <ellipse cx="10" cy="24" rx="3" ry="4" fill="rgba(255,255,255,0.18)" />
      {/* Eye / gaze pupil */}
      <circle cx="14" cy="20" r="4" fill="rgba(0,0,0,0.35)" />
      <circle cx="15.5" cy="18.5" r="1.4" fill="rgba(255,255,255,0.55)" />
      <defs>
        <linearGradient id="dropGrad" x1="0" y1="0" x2="28" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF5722" />
          <stop offset="100%" stopColor="#FF8C00" />
        </linearGradient>
      </defs>
    </svg>

    {/* Wordmark */}
    <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
      <span style={{
        fontSize: 18,
        fontWeight: 800,
        color: "#FFFFFF",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
        letterSpacing: "-0.5px",
        lineHeight: 1,
      }}>
        Fuel
      </span>
      <span style={{
        fontSize: 18,
        fontWeight: 800,
        background: "linear-gradient(90deg, #FF5722, #FF8C00)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
        letterSpacing: "-0.5px",
        lineHeight: 1,
      }}>
        Gaze
      </span>
    </div>
  </div>
);

/* ─── Navbar ─────────────────────────────────────────────────── */
const Navbar = () => (
  <nav style={{
    width: "100%",
    padding: "12px 24px",
    position: "fixed",
    top: 16,
    left: 0,
    zIndex: 50,
    boxSizing: "border-box",
  }}>
    <div style={{
      maxWidth: 1100,
      margin: "0 auto",
      background: "rgba(20,20,20,0.65)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
      padding: "10px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
    }}>
      {/* Logo */}
      <FuelGazeLogo />

      {/* Live pill */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        background: "rgba(255,87,34,0.1)",
        border: "1px solid rgba(255,87,34,0.2)",
        borderRadius: 999,
        padding: "5px 14px",
      }}>
        <div style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#FF5722",
          boxShadow: "0 0 6px #FF5722",
          animation: "navPulse 1.5s infinite",
        }} />
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: "rgba(255,140,0,0.9)",
          letterSpacing: "0.12em",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
        }}>
          LIVE TRACKING
        </span>
      </div>
    </div>

    <style>{`
      @keyframes navPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.4; transform: scale(0.7); }
      }
      @media (max-width: 480px) {
        nav { padding: 10px 16px !important; top: 10px !important; }
      }
    `}</style>
  </nav>
);

/* ─── App ────────────────────────────────────────────────────── */
function App() {
  const [loading, setLoading] = useState(true);

  return (
    loading
      ? <Preloader onComplete={() => setLoading(false)} />
      : <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<FuelStats />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;