import { useEffect, useState } from "react";
import { getSummary, getUpcoming } from "../api/dashboard";
import ContractCard from "../components/ContractCard";
import LoadingScreen from "../components/LoadingScreen";

const BASE = import.meta.env.VITE_API_BASE;
const userId = import.meta.env.VITE_USER_ID;

/* === PALETTE (LOCKED) === */
const BG_GRADIENT =
  "radial-gradient(circle at top, #0f172a 0%, #020617 55%, #09090b 100%)";
const GLASS_BG = "rgba(15, 23, 42, 0.65)";
const BORDER = "rgba(59, 130, 246, 0.25)";
const NEON_BLUE = "#60a5fa";
const NEON_VIOLET = "#c084fc";
const TEXT_PRIMARY = "#f8fafc";
const TEXT_MUTED = "#94a3b8";

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
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  async function scanInbox() {
    setScanning(true);
    await fetch(`${BASE}/gmail/fetch/${userId}`);
    setScanning(false);
  }

  async function loadData() {
    setSummary(await getSummary(userId));
    setUpcoming(await getUpcoming(userId));
  }

  async function loadSubscriptionHistory() {
    setShowHistory(true);
    const res = await fetch(`${BASE}/history/subscriptions/${userId}`);
    setHistoryData(await res.json());
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await scanInbox();
      await loadData();
      setLoading(false);
      setTimeout(() => setShowDashboard(true), 800);
    })();
  }, []);

  if (!showDashboard) return <LoadingScreen done={!loading} />;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: BG_GRADIENT,
        color: TEXT_PRIMARY,
        fontFamily: "Inter, system-ui",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "900",
            background: `linear-gradient(to right, ${NEON_BLUE}, ${NEON_VIOLET})`,
            WebkitBackgroundClip: "text",
            color: "transparent",
            letterSpacing: "-1px",
          }}
        >
          LifeSRE Dashboard
        </h1>

        <button
          onClick={loadSubscriptionHistory}
          style={{
            padding: "10px 18px",
            borderRadius: "14px",
            background: "rgba(59,130,246,0.12)",
            color: NEON_BLUE,
            border: `1px solid ${BORDER}`,
            boxShadow: `0 0 18px rgba(96,165,250,0.35)`,
            cursor: "pointer",
          }}
        >
          View History
        </button>
      </div>

      {scanning && (
        <p style={{ color: NEON_BLUE, marginBottom: "16px" }}>
          🔄 Scanning inbox…
        </p>
      )}

      {/* DASHBOARD */}
      {!showHistory && (
        <>
          {/* SUMMARY CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <NeonCard title="Total Contracts" value={summary.totalContracts} />
            <NeonCard title="Upcoming Renewals" value={summary.upcomingRenewals} />
            <NeonCard title="Estimated Spend" value={summary.estimatedSpendFormatted} />
            <NeonCard title="Total Savings" value={`₹${summary.totalSavings}`} />
          </div>

          <h2
            style={{
              marginTop: "48px",
              fontSize: "22px",
              color: TEXT_PRIMARY,
            }}
          >
            Active Contracts
          </h2>

          <div
            style={{
              marginTop: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {upcoming.map((c) => (
              <ContractCard key={c._id} contract={c} refresh={loadData} />
            ))}
          </div>
        </>
      )}

      {/* HISTORY */}
      {showHistory && (
        <div style={{ marginTop: "28px" }}>
          <button
            onClick={() => setShowHistory(false)}
            style={{
              marginBottom: "20px",
              background: "none",
              color: NEON_BLUE,
              border: "none",
              cursor: "pointer",
            }}
          >
            ← Back to Dashboard
          </button>

          <h2 style={{ fontSize: "22px", marginBottom: "14px" }}>
            Subscription History
          </h2>

          {historyData.map((item) => (
            <div
              key={item._id}
              style={{
                padding: "16px",
                marginTop: "12px",
                background: GLASS_BG,
                borderRadius: "16px",
                border: `1px solid ${BORDER}`,
                boxShadow: "0 0 22px rgba(96,165,250,0.18)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{item.serviceName}</strong>
                <p style={{ fontSize: "12px", color: TEXT_MUTED }}>
                  {new Date(item.paidOn).toDateString()}
                </p>
              </div>
              <strong style={{ color: NEON_VIOLET }}>
                ₹{item.amount}
              </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* === NEON GLASS CARD === */
function NeonCard({ title, value }) {
  return (
    <div
      style={{
        padding: "22px",
        background: GLASS_BG,
        borderRadius: "18px",
        border: `1px solid ${BORDER}`,
        boxShadow:
          "0 0 25px rgba(96,165,250,0.22), inset 0 1px 0 rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
      }}
    >
      <p style={{ color: TEXT_MUTED, fontSize: "13px" }}>{title}</p>
      <p
        style={{
          fontSize: "30px",
          fontWeight: "900",
          marginTop: "6px",
          background: `linear-gradient(to right, ${NEON_BLUE}, ${NEON_VIOLET})`,
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: "0 0 18px rgba(96,165,250,0.45)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default Dashboard;