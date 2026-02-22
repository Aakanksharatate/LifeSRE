import { useEffect, useState } from "react";
import { getSummary, getUpcoming } from "../api/dashboard";

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

  async function scanInbox() {
    setScanning(true);
    await fetch(`${BASE}/gmail/fetch/${userId}`);
    setScanning(false);
  }

  async function loadData() {
    const summaryData = await getSummary(userId);
    const upcomingData = await getUpcoming(userId);

    setSummary(summaryData);
    setUpcoming(upcomingData);
  }

  useEffect(() => {
  let hasScanned = false;

  async function initialize() {
    if (hasScanned) return;
    hasScanned = true;
    setLoading(true);
    await scanInbox();
    await loadData();
    setLoading(false);
  }
  initialize();
}, []);

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Scanning your inbox...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>LifeOps Dashboard</h1>

      {scanning && (
        <p style={{ color: "#007bff" }}>Scanning inbox...</p>
      )}

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Card title="Total Contracts" value={summary.totalContracts} />
        <Card title="Upcoming Renewals" value={summary.upcomingRenewals} />
        <Card title="Estimated Spend" value={summary.estimatedSpendFormatted} />
        <Card title="Total Savings" value={`₹${summary.totalSavings}`} />
      </div>

      <h2 style={{ marginTop: "40px" }}>Upcoming Contracts</h2>

      {upcoming.map((contract) => (
        <ContractCard
          key={contract.id}
          contract={contract}
          refresh={loadData}
        />
      ))}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        width: "220px",
        background: "#fff",
      }}
    >
      <h4>{title}</h4>
      <p style={{ fontSize: "26px", fontWeight: "bold" }}>
        {value}
      </p>
    </div>
  );
}

function ContractCard({ contract }) {
  const riskColor =
    contract.riskLevel === "HIGH"
      ? "#ff4d4f"
      : contract.riskLevel === "MEDIUM"
      ? "#faad14"
      : "#52c41a";

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        marginTop: "10px",
        borderRadius: "10px",
        background: "#fff",
      }}
    >
      <strong>{contract.vendor}</strong>
      <p>Renews in {contract.daysLeft} days</p>
      <p>Amount: ₹{contract.renewalAmount}</p>
      <span
        style={{
          padding: "4px 10px",
          borderRadius: "20px",
          background: riskColor,
          color: "white",
          fontWeight: "bold",
        }}
      >
        {contract.riskLevel}
      </span>
    </div>
  );
}

export default Dashboard;