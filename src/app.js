const express = require("express");
const app = express();

// Trust proxy - required for rate limiting on Render
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Finance API is running." });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use(require("./middleware/errorHandler"));

module.exports = app;