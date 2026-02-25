import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { switchContract } from "../api/dashboard";

const BASE = import.meta.env.VITE_API_BASE;

function ContractCard({ contract, refresh }) {
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRec, setLoadingRec] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [status, setStatus] = useState(contract.status || "ACTIVE");

  if (!contract) return null;

  const isHighRisk = contract.riskLevel === "HIGH";

  const riskColor = isHighRisk
    ? "#fca5a5"
    : contract.riskLevel === "MEDIUM"
    ? "#fde047"
    : "#86efac";

  const riskBackground = isHighRisk
    ? "rgba(220,38,38,0.15)"
    : contract.riskLevel === "MEDIUM"
    ? "rgba(202,138,4,0.15)"
    : "rgba(22,163,74,0.15)";

  const riskGlow = isHighRisk
    ? "0 0 15px rgba(220,38,38,0.4)"
    : "none";

  useEffect(() => {
    if (!contract.id || contract.riskLevel === "LOW") return;

    async function fetchRecommendation() {
      try {
        setLoadingRec(true);
        const res = await fetch(`${BASE}/recommendation/${contract.id}`);
        const data = await res.json();
        setRecommendation(data);
      } catch {
        setRecommendation(null);
      } finally {
        setLoadingRec(false);
      }
    }

    fetchRecommendation();
  }, [contract.id, contract.riskLevel]);

  async function handleSwitch() {
    if (!recommendation || status !== "ACTIVE") return;
    setSwitching(true);
    await switchContract(contract.id, recommendation.potentialSavings || 0);
    if (refresh) await refresh();
    setSwitching(false);
  }

  async function handleAction(action) {
    setActionLoading(true);
    const res = await fetch(`${BASE}/subscriptionActions/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contractId: contract.id }),
    });
    const data = await res.json();
    if (data.success) {
      setStatus(action === "paid" ? "PAID" : "CANCELLED");
      if (refresh) await refresh();
    }
    setActionLoading(false);
  }

  return (
    <>
      <style>{`
        .glass-shimmer {
          position: relative;
          overflow: hidden;
        }
        .glass-shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255,255,255,0.08),
            transparent
          );
          transform: skewX(-25deg);
          transition: left .8s ease;
          pointer-events: none;
        }
        .glass-shimmer:hover::after {
          left: 160%;
        }

        @keyframes stripemove {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
        @keyframes pulseWarning {
          0% { box-shadow: 0 0 0 0 rgba(220,38,38,.4); }
          70% { box-shadow: 0 0 0 8px rgba(220,38,38,0); }
          100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        className="glass-shimmer"
        style={{
          backgroundColor: "rgba(30,41,59,0.4)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${
            isHighRisk
              ? "rgba(248,113,113,0.3)"
              : "rgba(255,255,255,0.08)"
          }`,
          borderRadius: 20,
          padding: 28,
          boxShadow: isHighRisk
            ? "0 10px 30px rgba(220,38,38,0.1)"
            : "0 10px 30px rgba(0,0,0,0.3)",
          transition: "all .4s cubic-bezier(.175,.885,.32,1.275)",
          fontFamily: "Inter, system-ui",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.01)";
          e.currentTarget.style.borderColor = isHighRisk
            ? "rgba(248,113,113,0.6)"
            : "rgba(139,92,246,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.borderColor = isHighRisk
            ? "rgba(248,113,113,0.3)"
            : "rgba(255,255,255,0.08)";
        }}
      >
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <h3 style={{ color: "#f8fafc", fontWeight: 700 }}>
                {contract.vendor}
              </h3>
             <span
  style={{
    display: "inline-flex",          // 🔑 REQUIRED
    alignItems: "center",
    justifyContent: "center",
    margin: "10px",                   // ⬅ small horizontal margin
    padding: "5px 10px",               // ⬅ visibly smaller
    height: 20,                       // 🔑 hard height control
    borderRadius: 20,                  // rectangle
    background: riskBackground,
    color: riskColor,

    fontWeight: 700,
    fontSize: 10,
    lineHeight: "10px",               // 🔑 stops text forcing height
    textTransform: "uppercase",
    letterSpacing: 0.5,

    border: `1px solid ${riskColor}40`,
    boxShadow: riskGlow,
    animation: isHighRisk ? "pulseWarning 2s infinite" : "none",
  }}
>
                {contract.riskLevel}
              </span>
            </div>

            <p style={{ color: "#94a3b8" }}>
              ⏳ Renews in{" "}
              <strong
                style={{
                  color: "#f8fafc",
                  background: "rgba(255,255,255,.1)",
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                {contract.daysLeft} days
              </strong>
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p
              style={{
                color: "#64748b",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Current Rate
            </p>
            <strong style={{ color: "#f8fafc", fontSize: 24 }}>
              ₹{contract.renewalAmount}
            </strong>
          </div>
        </div>

        {/* LOADING */}
        {loadingRec && (
          <div
            style={{
              marginTop: 24,
              padding: 16,
              display: "flex",
              gap: 12,
              alignItems: "center",
              background: "rgba(139,92,246,.1)",
              borderRadius: 12,
              border: "1px solid rgba(139,92,246,.2)",
              color: "#a78bfa",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                border: "2px solid rgba(168,85,247,.3)",
                borderTopColor: "#a78bfa",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            Running price arbitrage algorithms...
          </div>
        )}

        {/* RECOMMENDATION (EXACT) */}
        {recommendation?.potentialSavings > 0 && (
          <div
            style={{
              marginTop: 24,
              padding: 24,
              borderRadius: 16,
              background:
                "linear-gradient(135deg, rgba(22,163,74,.1), rgba(6,78,59,.3))",
              border: "1px solid rgba(74,222,128,.3)",
              display: "flex",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* green glow orb */}
            <div
              style={{
                position: "absolute",
                top: "-50%",
                left: "-10%",
                width: 200,
                height: 200,
                background:
                  "radial-gradient(circle, rgba(74,222,128,.15), transparent 70%)",
                filter: "blur(20px)",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <p
                style={{
                  color: "#86efac",
                  fontSize: 13,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Market Arbitrage Found
              </p>

              <h4
                style={{
                  color: "#4ade80",
                  fontSize: 28,
                  fontWeight: 800,
                  textShadow: "0 0 20px rgba(74,222,128,.4)",
                }}
              >
                Save ₹
                <CountUp
                  end={recommendation.potentialSavings}
                  duration={1.5}
                  separator=","
                />
              </h4>

              {/* confidence bar */}
              <div style={{ marginTop: 16, maxWidth: 280 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "#6ee7b7",
                    fontWeight: 700,
                    marginBottom: 8,
                    textTransform: "uppercase",
                  }}
                >
                  <span>Confidence Level</span>
                  <span>{recommendation.confidence || "Medium"}</span>
                </div>
                <div
                  style={{
                    height: 2,
                    background: "rgba(0,0,0,.4)",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width:
                        recommendation.confidence === "High"
                          ? "92%"
                          : "65%",
                      background:
                        recommendation.confidence === "High"
                          ? "#10b981"
                          : "#f59e0b",
                      backgroundImage:
                        "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)",
                      backgroundSize: "20px 20px",
                      animation: "stripemove 2s linear infinite",
                    }}
                  />
                </div>
              </div>
            </div>

           <button
  onClick={handleSwitch}
  disabled={switching || status !== "ACTIVE"}
  style={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "65px",
    height: 45,
    padding: "10px 25px",
    borderRadius: 30,

    background: "rgba(11, 8, 50, 0.35)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.18)",

    color: "#e5e7eb",
    fontWeight: 700,
    fontSize: 13,
    lineHeight: "20px",

    cursor: "pointer",
    boxShadow: `
      inset 0 1px 1px rgba(255,255,255,0.15),
      0 10px 25px rgba(0,0,0,0.35)
    `,
    transform: switching ? "scale(.97)" : "scale(1)",
    transition: "all .2s ease",
  }}
>
  {switching ? "Executing…" : "Execute Switch"}
</button>         </div>
        )}

       {/* ACTIONS */}
{status === "ACTIVE" ? (
  <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
    {/* PAID */}
    <button
      onClick={() => handleAction("paid")}
      disabled={actionLoading}
      style={{
        flex: 1,
        height: 42,
        borderRadius: 14,

        background: "rgba(22,163,74,0.18)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(74,222,128,0.35)",

        color: "#dcfce7",
        fontWeight: 700,
        fontSize: 13,

        cursor: "pointer",
        boxShadow: `
          inset 0 1px 1px rgba(255,255,255,0.15),
          0 8px 20px rgba(0,0,0,0.35)
        `,
        transition: "all .2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow =
          "0 12px 30px rgba(22,163,74,0.45)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "inset 0 1px 1px rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.35)";
      }}
    >
      ✓ Paid
    </button>

    {/* CANCEL */}
    <button
      onClick={() => handleAction("cancel")}
      disabled={actionLoading}
      style={{
        flex: 1,
        height: 42,
        borderRadius: 14,

        background: "rgba(220,38,38,0.18)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(248,113,113,0.35)",

        color: "#fee2e2",
        fontWeight: 700,
        fontSize: 13,

        cursor: "pointer",
        boxShadow: `
          inset 0 1px 1px rgba(255,255,255,0.15),
          0 8px 20px rgba(0,0,0,0.35)
        `,
        transition: "all .2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow =
          "0 12px 30px rgba(220,38,38,0.45)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "inset 0 1px 1px rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.35)";
      }}
    >
      ✕ Cancel
    </button>
  </div>
) : (
  <p style={{ marginTop: 16, color: "#94a3b8" }}>
    Status: <strong>{status}</strong>
  </p>
)}
      </div>
    </>
  );
}

export default ContractCard;