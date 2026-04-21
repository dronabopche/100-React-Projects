const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");

const UPLOADS_DIR = path.join(__dirname, "../uploads");
const MAX_VAULT_SIZE = 1 * 1024 * 1024; // 1MB

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const vaultDir = path.join(UPLOADS_DIR, req.params.vaultId.toUpperCase());
    if (!fs.existsSync(vaultDir)) {
      fs.mkdirSync(vaultDir, { recursive: true });
    }
    cb(null, vaultDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_VAULT_SIZE },
  fileFilter: (req, file, cb) => {
    // Allow most common file types
    const allowed = [
      "image/", "text/", "audio/", "video/",
      "application/pdf", "application/json",
      "application/zip", "application/x-zip-compressed",
      "application/msword",
      "application/vnd.openxmlformats-officedocument",
    ];
    const isAllowed = allowed.some((type) => file.mimetype.startsWith(type) || file.mimetype.includes(type));
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error("File type not permitted."));
    }
  },
});

// Middleware: verify vault credentials
function verifyVault(req, res, next) {
  const vaultId = req.params.vaultId?.toUpperCase();
  const password = (req.query.password || req.body.password || "").toUpperCase();

  if (!vaultId || !password) {
    return res.status(400).json({ error: "Vault ID and password are required." });
  }

  const vault = db.prepare("SELECT * FROM vaults WHERE vault_id = ? AND password = ?").get(vaultId, password);
  if (!vault) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  req.vault = vault;
  next();
}

// GET /api/files/:vaultId?password=XXXX - List all files in vault
router.get("/:vaultId", verifyVault, (req, res) => {
  const files = db
    .prepare("SELECT file_id, file_name, file_size, mime_type, uploaded_at FROM files WHERE vault_id = ? ORDER BY uploaded_at DESC")
    .all(req.vault.vault_id);

  return res.json({
    files,
    total_size: req.vault.total_size,
    max_size: MAX_VAULT_SIZE,
    remaining: MAX_VAULT_SIZE - req.vault.total_size,
  });
});

// POST /api/files/:vaultId/upload?password=XXXX - Upload a file
router.post("/:vaultId/upload", verifyVault, (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Check total vault storage
    const newTotal = req.vault.total_size + req.file.size;
    if (newTotal > MAX_VAULT_SIZE) {
      // Remove the uploaded file since it won't fit
      fs.unlinkSync(req.file.path);
      return res.status(413).json({
        error: `File too large. This vault has ${((MAX_VAULT_SIZE - req.vault.total_size) / 1024).toFixed(1)} KB remaining.`,
      });
    }

    const fileId = uuidv4();
    db.prepare("INSERT INTO files (file_id, vault_id, file_name, file_size, mime_type, stored_path) VALUES (?, ?, ?, ?, ?, ?)").run(
      fileId,
      req.vault.vault_id,
      req.file.originalname,
      req.file.size,
      req.file.mimetype,
      req.file.path
    );
    db.prepare("UPDATE vaults SET total_size = ? WHERE vault_id = ?").run(newTotal, req.vault.vault_id);

    return res.status(201).json({
      message: "File uploaded successfully.",
      file: {
        file_id: fileId,
        file_name: req.file.originalname,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
      },
      total_size: newTotal,
      max_size: MAX_VAULT_SIZE,
    });
  });
});

// GET /api/files/:vaultId/download/:fileId?password=XXXX - Download a file
router.get("/:vaultId/download/:fileId", verifyVault, (req, res) => {
  const file = db
    .prepare("SELECT * FROM files WHERE file_id = ? AND vault_id = ?")
    .get(req.params.fileId, req.vault.vault_id);

  if (!file) {
    return res.status(404).json({ error: "File not found." });
  }

  if (!fs.existsSync(file.stored_path)) {
    return res.status(404).json({ error: "File missing from storage." });
  }

  res.setHeader("Content-Disposition", `attachment; filename="${file.file_name}"`);
  res.setHeader("Content-Type", file.mime_type || "application/octet-stream");
  return res.sendFile(file.stored_path);
});

// DELETE /api/files/:vaultId/:fileId - Delete a specific file
router.delete("/:vaultId/:fileId", verifyVault, (req, res) => {
  const file = db
    .prepare("SELECT * FROM files WHERE file_id = ? AND vault_id = ?")
    .get(req.params.fileId, req.vault.vault_id);

  if (!file) {
    return res.status(404).json({ error: "File not found." });
  }

  if (fs.existsSync(file.stored_path)) {
    fs.unlinkSync(file.stored_path);
  }

  db.prepare("DELETE FROM files WHERE file_id = ?").run(file.file_id);
  db.prepare("UPDATE vaults SET total_size = total_size - ? WHERE vault_id = ?").run(
    file.file_size,
    req.vault.vault_id
  );

  return res.json({ message: "File deleted.", freed: file.file_size });
});

module.exports = router;
