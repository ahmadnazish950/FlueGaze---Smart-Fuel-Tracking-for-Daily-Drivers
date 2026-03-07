import { useState, useEffect } from "react";

const Preloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState("fueling"); // fueling | ignition | ready
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Generate floating particles once on mount
        const pts = Array.from({ length: 18 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 3 + Math.random() * 4,
            size: 2 + Math.random() * 4,
        }));
        setParticles(pts);
    }, []);

    useEffect(() => {
        // Progress animation
        let current = 0;
        const interval = setInterval(() => {
            current += Math.random() * 2.5 + 0.5;
            if (current >= 100) {
                current = 100;
                clearInterval(interval);
                setPhase("ignition");
                setTimeout(() => setPhase("ready"), 900);
                setTimeout(() => onComplete?.(), 1800);
            }
            setProgress(Math.min(current, 100));
        }, 40);

        return () => clearInterval(interval);
    }, [onComplete]);

    const RADIUS = 54;
    const circumference = 2 * Math.PI * RADIUS;
    const strokeDash = ((100 - progress) / 100) * circumference;

    const FUEL_BARS = 8;
    const filledBars = Math.floor((progress / 100) * FUEL_BARS);

    const getStatusText = () => {
        if (phase === "ignition") return "IGNITION ▶";
        if (phase === "ready") return "LAUNCHING...";
        if (progress < 40) return "INITIALIZING...";
        if (progress < 80) return "LOADING MODULES...";
        return "ALMOST READY...";
    };

    const systemItems = [
        { label: "SYSTEM", value: progress > 20 ? "OK" : "—", active: progress > 20 },
        { label: "GPS", value: progress > 50 ? "LOCKED" : "—", active: progress > 50 },
        { label: "ENGINE", value: progress > 80 ? "READY" : "—", active: progress > 80 },
    ];

    return (
        <div style={styles.root(phase)}>
            {/* Ambient background glow */}
            <div style={styles.ambientGlow} />

            {/* Scanlines overlay */}
            <div style={styles.scanlines} />

            {/* Floating particles */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: "absolute",
                        left: `${p.x}%`,
                        bottom: "-10px",
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        borderRadius: "50%",
                        background: `rgba(255, ${140 + Math.floor(p.id * 3)}, 0, 0.6)`,
                        animation: `floatUp ${p.duration}s ${p.delay}s infinite ease-in`,
                        filter: "blur(1px)",
                    }}
                />
            ))}

            {/* Corner brackets */}
            {cornerPositions.map((pos, i) => (
                <div key={i} style={styles.cornerBracket(pos)} />
            ))}

            {/* Top label */}
            <div style={styles.topLabel}>
                <div style={styles.dot(0)} />
                <span style={styles.topLabelText}>FUEL TRACKER SYSTEM</span>
                <div style={styles.dot(0.6)} />
            </div>

            {/* Main content */}
            <div style={styles.mainContent}>

                {/* SVG Circular gauge */}
                <div style={{ position: "relative", width: 200, height: 200 }}>
                    <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
                        <defs>
                            <linearGradient id="fuelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FF4500" />
                                <stop offset="50%" stopColor="#FF8C00" />
                                <stop offset="100%" stopColor="#FFD700" />
                            </linearGradient>
                        </defs>

                        {/* Outer ring */}
                        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

                        {/* Track */}
                        <circle cx="100" cy="100" r={RADIUS} fill="none"
                            stroke="rgba(255,140,0,0.08)" strokeWidth="14"
                            strokeDasharray={circumference}
                        />

                        {/* Glow ring */}
                        <circle cx="100" cy="100" r={RADIUS} fill="none"
                            stroke="rgba(255,140,0,0.15)" strokeWidth="20"
                            strokeDasharray={circumference} strokeDashoffset={strokeDash}
                            strokeLinecap="round"
                            style={{ filter: "blur(6px)", transition: "stroke-dashoffset 0.08s linear" }}
                        />

                        {/* Main progress arc */}
                        <circle cx="100" cy="100" r={RADIUS} fill="none"
                            stroke="url(#fuelGrad)" strokeWidth="10"
                            strokeDasharray={circumference} strokeDashoffset={strokeDash}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 0.08s linear" }}
                        />

                        {/* Tick marks */}
                        {Array.from({ length: 36 }).map((_, i) => {
                            const angle = (i / 36) * 360;
                            const rad = (angle * Math.PI) / 180;
                            const r1 = 82;
                            const r2 = i % 9 === 0 ? 74 : 78;
                            const isActive = i / 36 <= progress / 100;
                            return (
                                <line key={i}
                                    x1={100 + r1 * Math.cos(rad)} y1={100 + r1 * Math.sin(rad)}
                                    x2={100 + r2 * Math.cos(rad)} y2={100 + r2 * Math.sin(rad)}
                                    stroke={isActive ? "rgba(255,140,0,0.6)" : "rgba(255,255,255,0.08)"}
                                    strokeWidth={i % 9 === 0 ? 2 : 1}
                                />
                            );
                        })}
                    </svg>

                    {/* Center content */}
                    <div style={styles.gaugeCenter}>
                        <FuelDropIcon progress={progress} />
                        <div style={styles.progressNumber}>{Math.floor(progress)}</div>
                        <div style={styles.percentLabel}>%</div>
                    </div>
                </div>

                {/* Fuel bar gauge (E → F) */}
                <div style={styles.fuelBarSection}>
                    <div style={styles.fuelBarRow}>
                        <span style={styles.fuelLabel}>E</span>
                        <div style={{ display: "flex", gap: 4 }}>
                            {Array.from({ length: FUEL_BARS }).map((_, i) => (
                                <div key={i} style={styles.fuelBar(i, filledBars)} />
                            ))}
                        </div>
                        <span style={styles.fuelLabel}>F</span>
                    </div>

                    {/* Status text */}
                    <div style={styles.statusText(phase)}>{getStatusText()}</div>
                </div>

                {/* System status rows */}
                <div style={styles.statusRows}>
                    {systemItems.map((item, i) => (
                        <div key={i} style={styles.statusRow(item.active)}>
                            <span style={styles.statusRowLabel}>{item.label}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={styles.statusDot(item.active)} />
                                <span style={styles.statusRowValue(item.active)}>{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div style={styles.bottomBar}>
                <div style={styles.progressTrack}>
                    <div style={styles.progressFill(progress)} />
                </div>
                <span style={styles.bottomLabel}>FUEL TRACKER v1.0 • LOADING</span>
            </div>

            <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.3; transform: scale(0.7); }
        }
      `}</style>
        </div>
    );
};

/* ─── Sub-component ─────────────────────────────────────────── */
const FuelDropIcon = ({ progress }) => (
    <svg width="22" height="26" viewBox="0 0 22 26" style={{ marginBottom: 4 }}>
        <path
            d="M11 0 C11 0 0 12 0 18 C0 23.5 4.9 26 11 26 C17.1 26 22 23.5 22 18 C22 12 11 0 11 0Z"
            fill={`rgba(255,140,0,${0.3 + (progress / 100) * 0.7})`}
            stroke="rgba(255,140,0,0.8)"
            strokeWidth="1"
        />
        <ellipse cx="8" cy="20" rx="2.5" ry="3.5" fill="rgba(255,255,255,0.15)" />
    </svg>
);

/* ─── Static data ────────────────────────────────────────────── */
const cornerPositions = [
    { top: 24, left: 24, rotate: "0deg" },
    { top: 24, right: 24, rotate: "90deg" },
    { bottom: 24, right: 24, rotate: "180deg" },
    { bottom: 24, left: 24, rotate: "270deg" },
];

/* ─── Styles ─────────────────────────────────────────────────── */
const styles = {
    root: (phase) => ({
        position: "fixed",
        inset: 0,
        background: "#080A0F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Courier New', monospace",
        overflow: "hidden",
        zIndex: 9999,
        opacity: phase === "ready" ? 0 : 1,
        transition: phase === "ready" ? "opacity 0.8s ease" : "none",
    }),
    ambientGlow: {
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,140,0,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
    },
    scanlines: {
        position: "absolute",
        inset: 0,
        backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
        pointerEvents: "none",
    },
    cornerBracket: (pos) => ({
        position: "absolute",
        ...pos,
        width: 32,
        height: 32,
        borderTop: "2px solid rgba(255,140,0,0.4)",
        borderLeft: "2px solid rgba(255,140,0,0.4)",
        transform: `rotate(${pos.rotate})`,
    }),
    topLabel: {
        position: "absolute",
        top: 28,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 8,
    },
    topLabelText: {
        color: "rgba(255,140,0,0.7)",
        fontSize: 11,
        letterSpacing: "0.25em",
        textTransform: "uppercase",
    },
    dot: (delay) => ({
        width: 6,
        height: 6,
        background: "#FF8C00",
        borderRadius: "50%",
        animation: `pulse 1.2s ${delay}s infinite`,
    }),
    mainContent: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
    },
    gaugeCenter: {
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
    },
    progressNumber: {
        fontSize: 36,
        fontWeight: 700,
        color: "#FF8C00",
        letterSpacing: "-1px",
        lineHeight: 1,
        fontFamily: "'Courier New', monospace",
        textShadow: "0 0 20px rgba(255,140,0,0.6)",
    },
    percentLabel: {
        fontSize: 11,
        color: "rgba(255,140,0,0.5)",
        letterSpacing: "0.2em",
    },
    fuelBarSection: {
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
    },
    fuelBarRow: {
        display: "flex",
        alignItems: "center",
        gap: 6,
    },
    fuelLabel: {
        fontSize: 10,
        color: "rgba(255,140,0,0.4)",
        letterSpacing: "0.2em",
    },
    fuelBar: (i, filledBars) => ({
        width: 22,
        height: 10,
        borderRadius: 2,
        background: i < filledBars ? `rgba(255, ${Math.max(60, 140 - i * 10)}, 0, 0.9)` : "rgba(255,255,255,0.05)",
        border: i < filledBars ? "1px solid rgba(255,200,0,0.4)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: i < filledBars ? "0 0 8px rgba(255,140,0,0.4)" : "none",
        transition: "all 0.2s",
    }),
    statusText: (phase) => ({
        fontSize: 11,
        color: phase === "ignition" ? "#FFD700" : "rgba(255,140,0,0.6)",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        minHeight: 16,
        transition: "color 0.3s",
    }),
    statusRows: {
        marginTop: 20,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: 260,
    },
    statusRow: (active) => ({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px 10px",
        background: "rgba(255,140,0,0.03)",
        border: "1px solid rgba(255,140,0,0.08)",
        borderRadius: 4,
        opacity: active ? 1 : 0.4,
        transition: "opacity 0.4s",
    }),
    statusRowLabel: {
        fontSize: 10,
        color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.2em",
    },
    statusDot: (active) => ({
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: active ? "#4ADE80" : "rgba(255,255,255,0.15)",
        boxShadow: active ? "0 0 6px #4ADE80" : "none",
        transition: "all 0.4s",
    }),
    statusRowValue: (active) => ({
        fontSize: 10,
        color: active ? "#4ADE80" : "rgba(255,255,255,0.2)",
        letterSpacing: "0.15em",
        transition: "color 0.4s",
    }),
    bottomBar: {
        position: "absolute",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        width: 260,
    },
    progressTrack: {
        width: "100%",
        height: 2,
        background: "rgba(255,140,0,0.1)",
        borderRadius: 2,
        overflow: "hidden",
    },
    progressFill: (progress) => ({
        height: "100%",
        width: `${progress}%`,
        background: "linear-gradient(90deg, #FF4500, #FFD700)",
        borderRadius: 2,
        boxShadow: "0 0 10px rgba(255,140,0,0.8)",
        transition: "width 0.08s linear",
    }),
    bottomLabel: {
        fontSize: 9,
        color: "rgba(255,140,0,0.3)",
        letterSpacing: "0.3em",
    },
};



export default Preloader;