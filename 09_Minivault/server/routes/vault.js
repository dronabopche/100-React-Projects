const express = require("express");
const router = express.Router();
const db = require("../db");
const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.join(__dirname, "../uploads");
const MAX_VAULT_SIZE = 1 * 1024 * 1024; // 1MB in bytes

// POST /api/vault - Create a new vault
router.post("/", (req, res) => {
  const { vault_id, password } = req.body;

  if (!vault_id || !password) {
    return res.status(400).json({ error: "Vault ID and password are required." });
  }
  if (vault_id.length !== 4 || password.length !== 4) {
    return res.status(400).json({ error: "Vault ID and password must each be exactly 4 characters." });
  }
  if (!/^[a-zA-Z0-9]+$/.test(vault_id) || !/^[a-zA-Z0-9]+$/.test(password)) {
    return res.status(400).json({ error: "Vault ID and password must be alphanumeric." });
  }

  const existing = db.prepare("SELECT vault_id FROM vaults WHERE vault_id = ?").get(vault_id.toUpperCase());
  if (existing) {
    return res.status(409).json({ error: "Vault ID already exists. Choose a different ID." });
  }

  db.prepare("INSERT INTO vaults (vault_id, password) VALUES (?, ?)").run(
    vault_id.toUpperCase(),
    password.toUpperCase()
  );

  return res.status(201).json({
    message: "Vault created successfully.",
    vault_id: vault_id.toUpperCase(),
  });
});

// POST /api/vault/auth - Login to an existing vault
router.post("/auth", (req, res) => {
  const { vault_id, password } = req.body;

  if (!vault_id || !password) {
    return res.status(400).json({ error: "Vault ID and password are required." });
  }

  const vault = db
    .prepare("SELECT vault_id, password, total_size, created_at FROM vaults WHERE vault_id = ?")
    .get(vault_id.toUpperCase());

  if (!vault || vault.password !== password.toUpperCase()) {
    return res.status(401).json({ error: "Invalid Vault ID or Password." });
  }

  return res.json({
    message: "Login successful.",
    vault_id: vault.vault_id,
    total_size: vault.total_size,
    max_size: MAX_VAULT_SIZE,
    created_at: vault.created_at,
  });
});

// DELETE /api/vault/:vaultId - Permanently delete a vault
router.delete("/:vaultId", (req, res) => {
  const { vaultId } = req.params;
  const { password } = req.body;

  const vault = db.prepare("SELECT * FROM vaults WHERE vault_id = ?").get(vaultId.toUpperCase());

  if (!vault || vault.password !== (password || "").toUpperCase()) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  // Get all files to delete from disk
  const files = db.prepare("SELECT stored_path FROM files WHERE vault_id = ?").all(vaultId.toUpperCase());

  files.forEach((f) => {
    if (fs.existsSync(f.stored_path)) {
      fs.unlinkSync(f.stored_path);
    }
  });

  db.prepare("DELETE FROM vaults WHERE vault_id = ?").run(vaultId.toUpperCase());

  return res.json({ message: "Vault permanently deleted." });
});

// GET /api/vault/:vaultId/info - Get vault info (requires password in query)
router.get("/:vaultId/info", (req, res) => {
  const { vaultId } = req.params;
  const { password } = req.query;

  const vault = db
    .prepare("SELECT vault_id, total_size, created_at FROM vaults WHERE vault_id = ? AND password = ?")
    .get(vaultId.toUpperCase(), (password || "").toUpperCase());

  if (!vault) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  return res.json({
    vault_id: vault.vault_id,
    total_size: vault.total_size,
    max_size: MAX_VAULT_SIZE,
    created_at: vault.created_at,
  });
});

module.exports = router;
