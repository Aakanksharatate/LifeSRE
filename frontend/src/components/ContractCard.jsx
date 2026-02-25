import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { switchContract } from "../api/dashboard";

const BASE = import.meta.env.VITE_API_BASE;

function ContractCard({ contract, refresh }) {
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRec, setLoadingRec] = useState(false);
  const [switching, setSwitching] = useState(false);

  if (!contract) return null;

  const isHighRisk = contract.riskLevel === "HIGH";
  const riskColor = isHighRisk ? "#fca5a5" : contract.riskLevel === "MEDIUM" ? "#fde047" : "#86efac";
  const riskBackground = isHighRisk ? "rgba(220, 38, 38, 0.15)" : contract.riskLevel === "MEDIUM" ? "rgba(202, 138, 4, 0.15)" : "rgba(22, 163, 74, 0.15)";
  const riskGlow = isHighRisk ? "0 0 15px rgba(220, 38, 38, 0.4)" : "none";

  useEffect(() => {
    if (!contract.id) return;
    if (contract.riskLevel === "LOW") return;

    async function fetchRecommendation() {
      try {
        setLoadingRec(true);
        const res = await fetch(`${BASE}/recommendation/${contract.id}`);
        if (!res.ok) throw new Error("Recommendation failed");
        
        const data = await res.json();
        setRecommendation(data);
      } catch (err) {
        console.error("Recommendation fetch failed:", err.message);
        setRecommendation(null);
      } finally {
        setLoadingRec(false);
      }
    }

    fetchRecommendation();
  }, [contract.id, contract.riskLevel]);

  async function handleSwitch() {
    if (!recommendation || !contract.id) return;

    try {
      setSwitching(true);
      await switchContract(contract.id, recommendation.potentialSavings || 0);
      if (refresh) await refresh();
    } catch (err) {
      console.error("Switch failed:", err.message);
    } finally {
      setSwitching(false);
    }
  }

  return (
    <>
      <style>
        {`
          @keyframes stripemove {
            0% { background-position: 0 0; }
            100% { background-position: 50px 50px; }
          }
          @keyframes pulseWarning {
            0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
            70% { box-shadow: 0 0 0 8px rgba(220, 38, 38, 0); }
            100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
          }
        `}
      </style>

      <div
        className="glass-shimmer"
        style={{
          backgroundColor: "rgba(30, 41, 59, 0.4)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${isHighRisk ? 'rgba(248, 113, 113, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
          borderRadius: "20px",
          padding: "28px",
          boxShadow: isHighRisk ? "0 10px 30px rgba(220, 38, 38, 0.1)" : "0 10px 30px rgba(0, 0, 0, 0.3)",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          position: "relative",
          overflow: "hidden"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.01)";
          e.currentTarget.style.borderColor = isHighRisk ? 'rgba(248, 113, 113, 0.6)' : 'rgba(139, 92, 246, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.borderColor = isHighRisk ? 'rgba(248, 113, 113, 0.3)' : 'rgba(255, 255, 255, 0.08)';
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#f8fafc", letterSpacing: "-0.5px" }}>
                {contract.vendor}
              </h3>
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  backgroundColor: riskBackground,
                  color: riskColor,
                  fontWeight: "800",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  border: `1px solid ${riskColor}40`,
                  boxShadow: riskGlow,
                  animation: isHighRisk ? "pulseWarning 2s infinite" : "none"
                }}
              >
                {contract.riskLevel}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "#cbd5e1" }}>⏳ Renews in</span> 
              <strong style={{ color: "#f8fafc", backgroundColor: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "6px" }}>{contract.daysLeft} days</strong>
            </p>
          </div>
          
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600", marginBottom: "4px" }}>Current Rate</p>
            <strong style={{ color: "#f8fafc", fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px" }}>₹{contract.renewalAmount}</strong>
          </div>
        </div>

        {/* ---------------- Recommendation UI ---------------- */}
        {loadingRec && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#a78bfa", fontSize: "14px", fontWeight: "600", marginTop: "24px", padding: "16px", backgroundColor: "rgba(139, 92, 246, 0.1)", borderRadius: "12px", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
            <span style={{ width: "16px", height: "16px", border: "2px solid rgba(168, 85, 247, 0.3)", borderTopColor: "#a78bfa", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            Running price arbitrage algorithms...
          </div>
        )}

        {recommendation && recommendation.potentialSavings > 0 && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(6, 78, 59, 0.3) 100%)",
              border: "1px solid rgba(74, 222, 128, 0.3)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "24px",
              marginTop: "24px",
              flexWrap: "wrap",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Background glowing orb for the savings box */}
            <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)", filter: "blur(20px)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ margin: "0 0 4px 0", color: "#86efac", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>Market Arbitrage Found</p>
              <h4 style={{ margin: "0 0 12px 0", color: "#4ade80", fontSize: "28px", fontWeight: "800", letterSpacing: "-1px", textShadow: "0 0 20px rgba(74, 222, 128, 0.4)" }}>
                Save ₹<CountUp end={recommendation.potentialSavings} duration={1.5} separator="," />
              </h4>
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#d1fae5", fontSize: "14px", backgroundColor: "rgba(16, 185, 129, 0.2)", padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                  Alternative available: <strong>₹{recommendation.bestAlternative}</strong>
                </span>
              </div>

              <div style={{ marginTop: "16px", width: "100%", maxWidth: "300px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6ee7b7", marginBottom: "8px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                  <span>Confidence Level</span>
                  <span>{recommendation.confidence || "Medium"}</span>
                </div>
                <div style={{ height: "8px", backgroundColor: "rgba(0,0,0,0.4)", borderRadius: "999px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)" }}>
                  <div
                    style={{
                      height: "100%",
                      width: recommendation.confidence === "High" ? "92%" : "65%",
                      backgroundColor: recommendation.confidence === "High" ? "#10b981" : "#f59e0b",
                      backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)",
                      backgroundSize: "20px 20px",
                      animation: "stripemove 2s linear infinite",
                      transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)"
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSwitch}
              disabled={switching}
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                border: "1px solid rgba(96, 165, 250, 0.5)",
                padding: "14px 28px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: switching ? "not-allowed" : "pointer",
                opacity: switching ? 0.7 : 1,
                whiteSpace: "nowrap",
                boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                transition: "all 0.2s ease",
                position: "relative",
                zIndex: 1,
                transform: switching ? "scale(0.98)" : "scale(1)"
              }}
              onMouseEnter={(e) => { if(!switching) { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 15px 25px -5px rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)"; } }}
              onMouseLeave={(e) => { if(!switching) { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 10px 20px -5px rgba(37, 99, 235, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)"; } }}
            >
              {switching ? (
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "12px", height: "12px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  Executing...
                </span>
              ) : (
                "Execute Switch"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ContractCard;