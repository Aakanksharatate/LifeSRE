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
app.use("/contract", contractRoutes);



app.get("/", (req, res) => {
  res.send("🚀 LifeSRE Backend Running");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});