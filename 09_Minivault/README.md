# 🔐 MiniVault — 1MB Minimal Web-Based File Sharing System

A lightweight, browser-based file storage system with React frontend + Node.js/Express backend + SQLite database.

---

## 📁 Project Structure

```
minivault/
├── server/                  ← Node.js + Express backend
│   ├── index.js             ← Main server entry point
│   ├── db.js                ← SQLite database setup
│   ├── package.json
│   └── routes/
│       ├── vault.js         ← Vault CRUD routes
│       └── files.js         ← File upload/download/delete routes
│
└── client/                  ← React (Vite) frontend
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx           ← App shell + Nav + Router
        ├── index.css         ← All global styles
        ├── pages/
        │   ├── Home.jsx      ← Landing page
        │   ├── CreateVault.jsx
        │   ├── LoginVault.jsx
        │   └── Dashboard.jsx ← Main file manager UI
        └── components/
            ├── StorageBar.jsx
            └── FileCard.jsx
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### 1. Set up the Backend

```bash
cd minivault/server
npm install
npm start
# Server starts at http://localhost:5000
```

For development with auto-reload:
```bash
npm run dev
```

### 2. Set up the Frontend

Open a **new terminal**:

```bash
cd minivault/client
npm install
npm run dev
# App opens at http://localhost:5173
```

### 3. Open in Browser

Navigate to **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/vault` | Create new vault |
| POST | `/api/vault/auth` | Login to existing vault |
| DELETE | `/api/vault/:vaultId` | Permanently delete vault |
| GET | `/api/files/:vaultId?password=` | List all files in vault |
| POST | `/api/files/:vaultId/upload?password=` | Upload a file |
| GET | `/api/files/:vaultId/download/:fileId?password=` | Download a file |
| DELETE | `/api/files/:vaultId/:fileId?password=` | Delete a specific file |
| GET | `/api/health` | Server health check |

---

## 🧱 Tech Stack (All Free)

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Backend | Node.js + Express.js |
| Database | SQLite via better-sqlite3 |
| File Upload | Multer |
| ID Generation | uuid |
| Fonts | Google Fonts (Space Mono + Syne) |

---

## ⚙️ How It Works

1. **Create a vault** — Choose a 4-character alphanumeric ID and password. Vault is created in SQLite.
2. **Upload files** — Drag & drop or click to upload. Files are stored on the server's filesystem under `server/uploads/<VAULT_ID>/`. Metadata is saved in SQLite.
3. **Download files** — Click the download button next to any file.
4. **Delete files** — Remove individual files or nuke the entire vault.
5. **1MB limit enforced** — Both frontend and backend validate storage quota.

---

## 🛡️ Security Notes

- Passwords are stored as plain text in SQLite (sufficient for a proof-of-concept).
- For production: hash passwords with `bcrypt`, use HTTPS, add rate limiting.
- Not intended for sensitive/confidential data in this foundational form.

---

## 🔮 Future Scope (from synopsis)

- [ ] Auto-expiry of vaults after inactivity
- [ ] In-browser preview for images and text files
- [ ] File encryption at rest
- [ ] QR code generation for vault access
- [ ] Time-limited shareable links

---

## 📝 Production Build

```bash
# Build frontend
cd client && npm run build

# Set env variables and start server
cd ../server
NODE_ENV=production PORT=5000 node index.js
```

The server will serve the built React app at the root and the API at `/api`.
