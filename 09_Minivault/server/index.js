const express = require("express");
const cors = require("cors");
const path = require("path");

// Initialize DB (creates tables if not present)
require("./db");

const vaultRoutes = require("./routes/vault");
const fileRoutes = require("./routes/files");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/vault", vaultRoutes);
app.use("/api/files", fileRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", app: "MiniVault", version: "1.0.0" });
});

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  const clientBuild = path.join(__dirname, "../client/dist");
  app.use(express.static(clientBuild));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`\n🔐 MiniVault server running on http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/health\n`);
});
