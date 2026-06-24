import { useState, useEffect } from "react";

const T = {
  bg: "#0A0A0A",
  surface: "#141414",
  surfaceHigh: "#1C1C1C",
  border: "#2A2A2A",
  orange: "#FF5722",
  orangeDim: "rgba(255,87,34,0.12)",
  orangeGlow: "rgba(255,87,34,0.25)",
  green: "#00C853",
  greenDim: "rgba(0,200,83,0.1)",
  red: "#FF3B30",
  redDim: "rgba(255,59,48,0.1)",
  cyan: "#00BCD4",
  white: "#FFFFFF",
  gray2: "#9E9E9E",
  gray3: "#616161",
  gray4: "#2C2C2C",
  font: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
  mono: "'SF Mono', 'Fira Code', 'Courier New', monospace",
};

const Label = ({ children }) => (
  <span style={{ display: "block", fontSize: 11, fontWeight: 600, color: T.gray2, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, fontFamily: T.font }}>
    {children}
  </span>
);

const InputField = ({ label, type = "number", placeholder, value, onChange, hint }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Label>{label}</Label>
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "13px 16px",
          background: focused ? T.surfaceHigh : T.surface,
          border: `1.5px solid ${focused ? T.orange : T.border}`,
          borderRadius: 10, color: T.white, fontSize: 15, fontFamily: T.font,
          outline: "none", boxSizing: "border-box", transition: "all 0.18s ease",
          boxShadow: focused ? `0 0 0 3px ${T.orangeGlow}` : "none", colorScheme: "dark",
        }}
      />
      {hint && <span style={{ fontSize: 11, color: T.gray3, marginTop: 5, fontFamily: T.font, lineHeight: 1.4 }}>{hint}</span>}
    </div>
  );
};

const ResultCard = ({ label, value, unit, sub, color, icon }) => (
  <div style={{ flex: 1, minWidth: 0, padding: "16px", background: T.surfaceHigh, border: `1.5px solid ${color}30`, borderRadius: 12, display: "flex", flexDirection: "column", gap: 6 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ fontSize: 10, color: T.gray3, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: T.font }}>{label}</span>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
      <span style={{ fontSize: 24, fontWeight: 700, color, fontFamily: T.mono, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 13, color, opacity: 0.7, fontFamily: T.font }}>{unit}</span>
    </div>
    {sub && <span style={{ fontSize: 11, color: T.gray3, fontFamily: T.font }}>{sub}</span>}
  </div>
);

const VehicleRunner = ({ vehicleIndex, animateKey }) => {
  const emojis = ["🚗", "🏍️", "🚙", "🛵", "🛻"];
  return (
    <div style={{ position: "relative", height: 64, overflow: "hidden", width: "100%", marginBottom: 8 }}>
      <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${T.orange}40, transparent)` }} />
      {[0, 1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ position: "absolute", bottom: 14, left: `${i * 18}%`, width: "10%", height: 2, background: T.gray4, borderRadius: 2 }} />
      ))}
      <div key={animateKey} style={{ position: "absolute", bottom: 10, right: "-70px", fontSize: 40, animation: "carRun 4.5s linear forwards" }}>
        {emojis[vehicleIndex]}
      </div>
    </div>
  );
};

const FuelStats = () => {
  const [todayKm, setTodayKm] = useState("");
  const [odometerKm, setOdometerKm] = useState("");
  const [litres, setLitres] = useState("");
  const [mileage, setMileage] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState(null);
  const [warning, setWarning] = useState(false);
  const [error, setError] = useState("");
  const [vehicleIndex, setVehicleIndex] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fuel-history") || "[]"); } catch { return []; }
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const onResize = () => { setIsMobile(window.innerWidth < 768); setIsTablet(window.innerWidth < 1024); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleIndex(prev => (prev + 1) % 5);
      setAnimateKey(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCalculate = () => {
    setError(""); setResults(null);
    const todayKmVal = parseFloat(todayKm);
    const odometerVal = odometerKm !== "" ? parseFloat(odometerKm) : null; 
    const litresVal = parseFloat(litres);
    const mileageVal = parseFloat(mileage);

    if (!todayKmVal || !litresVal || !mileageVal) { setError("Please fill all required fields (KM driven, fuel, and mileage)."); return; }
    if (todayKmVal <= 0 || litresVal <= 0 || mileageVal <= 0) { setError("All values must be greater than zero."); return; }

    const fuelUsedToday = todayKmVal / mileageVal;
    const remaining = litresVal - fuelUsedToday;
    
    const odometerNote = odometerVal !== null ? `Odometer reading: ${odometerVal.toLocaleString()} km` : null;

    if (remaining <= 0) {
      setWarning(true);
      setResults({ fuelUsedToday: fuelUsedToday.toFixed(2), fuelRemaining: 0, kmRemaining: 0, estimatedDays: "0", refillDate: "Today", fuelEfficiency: mileageVal, odometerNote, invalid: true });
      return;
    }

    const kmRemaining = remaining * mileageVal;
    const estimatedDays = kmRemaining / todayKmVal;
    const today = new Date();
    const refillDate = new Date(today.getTime() + estimatedDays * 24 * 60 * 60 * 1000);
    const refillDateStr = refillDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const isWarning = remaining <= 2 || estimatedDays <= 1;
    setWarning(isWarning);

  
    const dailyFuelNeeded = todayKmVal / mileageVal;         
    const refillLitres = Math.ceil(dailyFuelNeeded * 3);   

    const res = { fuelUsedToday: fuelUsedToday.toFixed(2), fuelRemaining: remaining.toFixed(2), kmRemaining: kmRemaining.toFixed(1), estimatedDays: estimatedDays.toFixed(1), refillDate: refillDateStr, fuelEfficiency: mileageVal, odometerNote, dailyFuelNeeded: dailyFuelNeeded.toFixed(2), refillLitres, invalid: false };
    setResults(res);

    const entry = { date: date || today.toISOString().split("T")[0], todayKm: todayKmVal, odometerKm: odometerVal || null, litres: litresVal, mileage: mileageVal, fuelUsedToday: parseFloat(fuelUsedToday.toFixed(2)), fuelRemaining: parseFloat(remaining.toFixed(2)), kmRemaining: parseFloat(kmRemaining.toFixed(1)), estimatedDays: parseFloat(estimatedDays.toFixed(1)), refillDate: refillDateStr };
    const updated = [entry, ...history].slice(0, 50);
    setHistory(updated);
    localStorage.setItem("fuel-history", JSON.stringify(updated));
  };

  const isStack = isMobile || isTablet;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.white, fontFamily: T.font, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 50% 70% at 15% 50%, rgba(255,87,34,0.04) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 85% 50%, rgba(0,188,212,0.03) 0%, transparent 60%)" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", minHeight: "100vh", display: "grid", gridTemplateColumns: isStack ? "1fr" : "1fr 1fr", gap: isStack ? 0 : 48, padding: isStack ? "80px 20px 48px" : "100px 40px 60px", alignItems: "start", boxSizing: "border-box" }}>

        
        <div style={{ display: "flex", flexDirection: "column", paddingBottom: isStack ? 28 : 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.orangeDim, border: `1px solid ${T.orange}30`, borderRadius: 20, padding: "5px 14px", marginBottom: 22, width: "fit-content" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.orange, boxShadow: `0 0 6px ${T.orange}` }} />
            <span style={{ fontSize: 11, color: T.orange, fontWeight: 600, letterSpacing: "0.12em" }}>FUEL TRACKER</span>
          </div>

          <h1 style={{ fontSize: isMobile ? 42 : 60, fontWeight: 800, lineHeight: 1.08, margin: "0 0 14px 0", letterSpacing: "-1.5px", fontFamily: T.font }}>
            <span style={{ color: T.white }}>Smart </span><span style={{ color: T.orange }}>Fuel</span>
            <br /><span style={{ color: T.white }}>Tracking</span>
          </h1>

          <p style={{ fontSize: 15, color: T.gray2, lineHeight: 1.65, marginBottom: 20, maxWidth: 380 }}>
            Know exactly how far you can go. Track daily fuel consumption, get refill predictions, and never be stranded again.
          </p>

          <VehicleRunner vehicleIndex={vehicleIndex} animateKey={animateKey} />
          <div style={{ height: 1, background: T.border, margin: "16px 0 20px" }} />

          <div style={{ display: "flex", gap: isMobile ? 20 : 32, flexWrap: "wrap" }}>
            {[
              { val: `${history.length}`, label: "Trips logged" },
              { val: history.length > 0 ? `${(history.reduce((a, b) => a + (b.mileage || 0), 0) / history.length).toFixed(1)}` : "—", label: "Avg km/L" },
              { val: `${history.reduce((a, b) => a + (b.todayKm || 0), 0).toFixed(0)}`, label: "KM tracked" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: T.orange, fontFamily: T.mono }}>{s.val}</span>
                <span style={{ fontSize: 11, color: T.gray3, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</span>
              </div>
            ))}
          </div>

          {!isStack && (
            <div style={{ marginTop: 32, padding: "20px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14 }}>
              <span style={{ fontSize: 11, color: T.gray3, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 14 }}>How it works</span>
              {[
                { icon: "①", text: "Enter today's KM + fuel currently in tank" },
                { icon: "②", text: "Add odometer reading for better accuracy" },
                { icon: "③", text: "See fuel left, days remaining & refill date" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                  <span style={{ fontSize: 14, color: T.orange, fontWeight: 700, minWidth: 22, marginTop: 1 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, color: T.gray2, lineHeight: 1.5 }}>{s.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        
        <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: isMobile ? "22px 18px" : "30px 28px", display: "flex", flexDirection: "column", gap: 18 }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: T.orangeDim, border: `1px solid ${T.orange}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⛽</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.white, fontFamily: T.font }}>Fuel Entry</div>
                <div style={{ fontSize: 11, color: T.gray3, fontFamily: T.font }}>Fill in your trip details</div>
              </div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: T.green, border: `1px solid ${T.green}30`, borderRadius: 6, padding: "4px 10px", background: T.greenDim, letterSpacing: "0.12em" }}>● LIVE</div>
          </div>

          <div style={{ height: 1, background: T.border }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <InputField label="KM Driven Today *" placeholder="e.g. 45" value={todayKm} onChange={e => setTodayKm(e.target.value)} hint="How many kilometres did you drive today?" />
            <InputField label="Odometer Reading (optional)" placeholder="e.g. 0 or 12450" value={odometerKm} onChange={e => setOdometerKm(e.target.value)} hint="Total KM on your meter — 0 is valid for new vehicles or reset meters" />
            <InputField label="Fuel in Tank (Litres) *" placeholder="e.g. 8.5" value={litres} onChange={e => setLitres(e.target.value)} hint="Current fuel in tank after today's refill or remaining amount" />
            <InputField label="Your Mileage (KM per Litre) *" placeholder="e.g. 18" value={mileage} onChange={e => setMileage(e.target.value)} hint="Average fuel efficiency — check your vehicle manual or past data" />
            <InputField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} hint="Leave blank to use today's date automatically" />
          </div>

          {error && (
            <div style={{ padding: "12px 16px", background: T.redDim, border: `1px solid ${T.red}30`, borderRadius: 10, fontSize: 13, color: T.red, display: "flex", alignItems: "center", gap: 8, fontFamily: T.font }}>
              ⚠ {error}
            </div>
          )}

          <button onClick={handleCalculate}
            style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg, ${T.orange}, #E64A19)`, border: "none", borderRadius: 12, color: T.white, fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em", fontFamily: T.font, boxShadow: `0 4px 20px ${T.orangeGlow}`, transition: "all 0.18s ease" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 30px ${T.orangeGlow}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${T.orangeGlow}`; }}
          >
            Calculate Fuel →
          </button>

          {results && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 1, background: T.border }} />
                <span style={{ fontSize: 10, color: T.gray3, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: T.font }}>Results</span>
                <div style={{ flex: 1, height: 1, background: T.border }} />
              </div>

              {results.invalid ? (
                <div style={{ padding: "18px", background: T.redDim, border: `1.5px solid ${T.red}30`, borderRadius: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>⛽</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.red, fontFamily: T.font }}>Fuel Insufficient</div>
                  <div style={{ fontSize: 12, color: T.gray3, marginTop: 6, lineHeight: 1.5, fontFamily: T.font }}>
                    You drove {todayKm} km but used {results.fuelUsedToday}L — more than tank capacity. Please refill immediately.
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <ResultCard icon="💧" label="Fuel Left" value={results.fuelRemaining} unit="L" sub={`Used ${results.fuelUsedToday}L today`} color={warning ? T.red : T.green} />
                    <ResultCard icon="📅" label="Days Left" value={results.estimatedDays} unit="days" sub={`Refill by ${results.refillDate}`} color={warning ? T.orange : T.cyan} />
                  </div>

                  <div style={{ padding: "14px 18px", background: T.surfaceHigh, border: `1.5px solid ${T.border}`, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>🛣️</span>
                      <div>
                        <div style={{ fontSize: 10, color: T.gray3, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: T.font }}>Distance Left</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: T.white, fontFamily: T.mono }}>{results.kmRemaining}<span style={{ fontSize: 13, color: T.gray2, fontFamily: T.font, marginLeft: 4 }}>km</span></div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: T.gray3, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: T.font }}>Efficiency</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: T.orange, fontFamily: T.mono }}>{results.fuelEfficiency}<span style={{ fontSize: 11, color: T.gray3, fontFamily: T.font, marginLeft: 3 }}>km/L</span></div>
                    </div>
                  </div>

                  {results.odometerNote && (
                    <div style={{ fontSize: 11, color: T.gray3, textAlign: "center", padding: "8px 12px", background: T.surfaceHigh, borderRadius: 8, fontFamily: T.font }}>
                      🔢 {results.odometerNote}
                    </div>
                  )}

                  {/* Daily Fuel Advisor */}
                  <div style={{ padding: "16px 18px", background: T.surfaceHigh, border: `1.5px solid ${T.orange}25`, borderRadius: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15 }}>📊</span>
                      <span style={{ fontSize: 10, color: T.orange, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: T.font }}>Daily Fuel Advisor</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 10, color: T.gray3, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: T.font }}>Daily consumption</span>
                        <span style={{ fontSize: 20, fontWeight: 700, color: T.white, fontFamily: T.mono }}>
                          {results.dailyFuelNeeded}<span style={{ fontSize: 12, color: T.gray2, marginLeft: 3, fontFamily: T.font }}>L/day</span>
                        </span>
                        <span style={{ fontSize: 11, color: T.gray3, fontFamily: T.font }}>at {todayKm} km/day pace</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 10, color: T.gray3, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: T.font }}>Suggested top-up</span>
                        <span style={{ fontSize: 20, fontWeight: 700, color: T.orange, fontFamily: T.mono }}>
                          {results.refillLitres}<span style={{ fontSize: 12, color: T.gray2, marginLeft: 3, fontFamily: T.font }}>L</span>
                        </span>
                        <span style={{ fontSize: 11, color: T.gray3, fontFamily: T.font }}>for 3-day buffer</span>
                      </div>
                    </div>
                    <div style={{ padding: "9px 12px", background: "rgba(255,87,34,0.06)", border: `1px solid ${T.orange}20`, borderRadius: 8, fontSize: 12, color: T.gray2, lineHeight: 1.5, fontFamily: T.font }}>
                      💡 At your current pace, fill <strong style={{ color: T.orange }}>{results.refillLitres}L</strong> before <strong style={{ color: T.white }}>{results.refillDate}</strong> to avoid running dry.
                    </div>
                  </div>

                  {warning && (
                    <div style={{ padding: "11px 14px", background: "rgba(255,87,34,0.08)", border: `1px solid ${T.orange}30`, borderRadius: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.orange, fontWeight: 600, fontFamily: T.font }}>
                      ⚠️ Low fuel — refill within {results.estimatedDays} day(s)!
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 11, color: T.gray3, fontFamily: T.font }}>🔒 All data saved on your device only</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes carRun {
          0%   { right: -70px; opacity: 0; }
          6%   { opacity: 1; }
          94%  { opacity: 1; }
          100% { right: 105%; opacity: 0; }
        }
        input::placeholder { color: #4A4A4A !important; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        * { box-sizing: border-box; }
        @media (max-width: 480px) { input { font-size: 16px !important; } }
      `}</style>
    </div>
  );
};

export default FuelStats;
