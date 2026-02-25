import { useEffect, useState } from "react";
import { getSummary, getUpcoming } from "../api/dashboard";
import ContractCard from "../components/ContractCard";
import LoadingScreen from "../components/LoadingScreen";

const BASE = import.meta.env.VITE_API_BASE;
const userId = import.meta.env.VITE_USER_ID;

function Dashboard() {
  const [summary, setSummary] = useState({
    totalContracts: 0,
    upcomingRenewals: 0,
    estimatedSpendFormatted: "₹0",
    totalSavings: 0,
  });

  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  async function scanInbox() {
    setScanning(true);
    try {
      await fetch(`${BASE}/gmail/fetch/${userId}`);
    } catch (error) {
      console.error("Fetch failed", error);
    }
    setScanning(false);
  }

  async function loadData() {
    try {
      const summaryData = await getSummary(userId);
      const upcomingData = await getUpcoming(userId);
      setSummary(summaryData);
      setUpcoming(upcomingData);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  }

  useEffect(() => {
    async function initialize() {
      setLoading(true);
      await scanInbox();
      await loadData();
      setLoading(false);

      setTimeout(() => {
        setShowDashboard(true);
      }, 2000); // Matches the Match Cut timeout perfectly
    }
    initialize();
  }, []);

  if (!showDashboard) {
    return <LoadingScreen done={!loading} />;
  }

  return (
    <>
      <style>
        {`
          @keyframes darkGradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          /* Smoother fade up using a custom bezier curve */
          @keyframes fadeInUpSmooth {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes textShine {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
          }
          
          @keyframes scanPulse {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
          
          .glass-shimmer {
            position: relative;
            overflow: hidden;
          }
          .glass-shimmer::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent);
            transform: skewX(-25deg);
            transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 10;
            pointer-events: none;
          }
          .glass-shimmer:hover::after {
            left: 150%;
          }
        `}
      </style>

      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          padding: "40px 24px",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          color: "#f8fafc",
          background: "linear-gradient(-45deg, #020617, #0f172a, #09090b, #170f2e)",
          backgroundSize: "400% 400%",
          animation: "darkGradientBG 20s ease infinite",
          overflowX: "hidden",
        }}
      >
        {/* Floating Orbs for clean depth (No Grid) */}
        <div style={{ position: "absolute", top: "10%", left: "20%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "40px",
            }}
          >
            <div>
              <h1 
                style={{ 
                  fontSize: "42px", 
                  fontWeight: "900", 
                  margin: "0 0 8px 0", 
                  letterSpacing: "-1px",
                  background: "linear-gradient(to right, #60a5fa, #c084fc, #60a5fa)",
                  backgroundSize: "200% auto",
                  color: "transparent",
                  WebkitBackgroundClip: "text",
                  animation: "textShine 4s linear infinite"
                }}
              >
                LifeSRE Dashboard
              </h1>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "16px", letterSpacing: "0.5px" }}>
                Command center for your life infrastructure.
              </p>
            </div>
            
            {scanning && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  backgroundColor: "rgba(15, 23, 42, 0.6)",
                  color: "#60a5fa",
                  padding: "12px 24px",
                  borderRadius: "9999px",
                  fontSize: "14px",
                  fontWeight: "700",
                  border: "1px solid rgba(59, 130, 246, 0.4)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
                }}
              >
                <span 
                  style={{ 
                    width: "12px", height: "12px", 
                    backgroundColor: "#3b82f6", 
                    borderRadius: "50%", 
                    display: "inline-block", 
                    animation: "scanPulse 1.5s infinite" 
                  }}
                />
                Syncing Network...
              </div>
            )}
          </header>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
              marginBottom: "56px",
            }}
          >
            <Card title="Total Contracts" value={summary.totalContracts} delay="0.1s" />
            <Card title="Upcoming Renewals" value={summary.upcomingRenewals} highlight={summary.upcomingRenewals > 0} delay="0.15s" />
            <Card title="Estimated Spend" value={summary.estimatedSpendFormatted} delay="0.2s" />
            <Card title="Total Savings" value={`₹${summary.totalSavings}`} isSuccess delay="0.25s" />
          </div>

          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.5)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "40px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              animation: "fadeInUpSmooth 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
              animationDelay: "0.3s",
              opacity: 0, 
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ width: "4px", height: "24px", backgroundColor: "#8b5cf6", borderRadius: "4px" }} />
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>
                Active Contracts
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {upcoming.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#64748b", backgroundColor: "rgba(2, 6, 23, 0.3)", borderRadius: "16px", border: "1px dashed rgba(71, 85, 105, 0.3)" }}>
                  <p style={{ margin: 0, fontSize: "16px" }}>No active contracts detected on the network.</p>
                </div>
              ) : (
                upcoming.map((contract) => (
                  <ContractCard key={contract.id} contract={contract} refresh={loadData} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- Card Component ---------------- */

function Card({ title, value, highlight, isSuccess, delay }) {
  let valueColor = "#f8fafc"; 
  let glowColor = "rgba(255,255,255,0.05)";
  let borderColor = "rgba(255,255,255,0.1)";

  if (highlight) { valueColor = "#f87171"; glowColor = "rgba(248, 113, 113, 0.1)"; borderColor = "rgba(248, 113, 113, 0.3)"; }
  if (isSuccess) { valueColor = "#4ade80"; glowColor = "rgba(74, 222, 128, 0.1)"; borderColor = "rgba(74, 222, 128, 0.3)"; }

  return (
    <div
      className="glass-shimmer"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(16px)",
        padding: "32px 24px",
        borderRadius: "20px",
        border: `1px solid ${borderColor}`,
        boxShadow: `0 8px 32px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`,
        animation: "fadeInUpSmooth 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        animationDelay: delay,
        opacity: 0, 
        transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
        e.currentTarget.style.boxShadow = `0 20px 40px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = `0 8px 32px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`;
      }}
    >
      <h4 style={{ fontSize: "13px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px 0", fontWeight: "700" }}>
        {title}
      </h4>
      <p style={{ fontSize: "44px", fontWeight: "800", margin: 0, color: valueColor, letterSpacing: "-1px" }}>
        {value}
      </p>
    </div>
  );
}

export default Dashboard;