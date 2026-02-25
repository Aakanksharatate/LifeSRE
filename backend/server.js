// server.js
require("./services/scheduler");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const gmailRoutes = require("./routes/gmailRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const contractRoutes = require("./routes/contractRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const historyRoutes = require("./routes/historyRoutes");
const subscriptionActions = require("./routes/subscriptionActions");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/gmail", gmailRoutes);
app.use("/upload", uploadRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/contracts", contractRoutes);
app.use("/recommendation", recommendationRoutes);
app.use("/history", historyRoutes);
app.use("/subscriptionActions", subscriptionActions);

app.get("/", (req, res) => {
  res.send("🚀 LifeSRE Backend Running");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});