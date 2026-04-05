const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Finance API is running." });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

module.exports = app;