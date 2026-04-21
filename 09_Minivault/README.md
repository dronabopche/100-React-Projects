Here is your **fully professional, clean `README.md` with no emojis**, preserving all original content and improving formatting, structure, and clarity:

---

# MiniVault — 1MB Minimal Web-Based File Sharing System

A lightweight, browser-based file storage system with a React frontend, Node.js/Express backend, and SQLite database.

---

## Project Structure

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

## Quick Start

### Prerequisites

* Node.js 18+ installed
* npm or yarn

---

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

---

### 2. Set up the Frontend

Open a new terminal:

```bash
cd minivault/client
npm install
npm run dev
# App opens at http://localhost:5173
```

---

### 3. Open in Browser

Navigate to:

```
http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint                                         | Description              |
| ------ | ------------------------------------------------ | ------------------------ |
| POST   | `/api/vault`                                     | Create new vault         |
| POST   | `/api/vault/auth`                                | Login to existing vault  |
| DELETE | `/api/vault/:vaultId`                            | Permanently delete vault |
| GET    | `/api/files/:vaultId?password=`                  | List all files in vault  |
| POST   | `/api/files/:vaultId/upload?password=`           | Upload a file            |
| GET    | `/api/files/:vaultId/download/:fileId?password=` | Download a file          |
| DELETE | `/api/files/:vaultId/:fileId?password=`          | Delete a specific file   |
| GET    | `/api/health`                                    | Server health check      |

---

## Tech Stack

| Layer         | Technology                       |
| ------------- | -------------------------------- |
| Frontend      | React 18 + Vite                  |
| Routing       | React Router v6                  |
| Backend       | Node.js + Express.js             |
| Database      | SQLite via better-sqlite3        |
| File Upload   | Multer                           |
| ID Generation | uuid                             |
| Fonts         | Google Fonts (Space Mono + Syne) |

---

## How It Works

1. Create a vault
   Choose a 4-character alphanumeric ID and password. Vault is created in SQLite.

2. Upload files
   Drag and drop or click to upload. Files are stored on the server filesystem under:

   ```
   server/uploads/<VAULT_ID>/
   ```

   Metadata is saved in SQLite.

3. Download files
   Click the download button next to any file.

4. Delete files
   Remove individual files or delete the entire vault.

5. 1MB limit enforced
   Both frontend and backend validate the storage quota.

---

## Security Notes

Current (proof-of-concept level):

* Passwords are stored as plain text in SQLite

Recommended for production:

* Hash passwords using bcrypt
* Use HTTPS
* Add rate limiting
* Perform input validation and sanitization

Not intended for sensitive or confidential data in its current form.

---

## Future Scope

* Auto-expiry of vaults after inactivity
* In-browser preview for images and text files
* File encryption at rest
* QR code generation for vault access
* Time-limited shareable links

---

## Production Build

```bash
# Build frontend
cd client && npm run build

# Set environment variables and start server
cd ../server
NODE_ENV=production PORT=5000 node index.js
```

The server will serve the built React app at the root and the API at `/api`.

---

## Password Issues and Collision Analysis

### 1. Total Number of Possible Combinations

If:

* ID token length = L₁
* Password token length = L₂
* Character set size = C (e.g., 10 for digits, 36 for alphanumeric, 62 for base62)

Then:

```
Total = C^(L₁ + L₂)
```

---

### 2. When Do Collisions Start Happening

This follows the birthday paradox.

You do not need to exhaust the entire space to encounter collisions.

Approximate threshold:

```
N ≈ √(Total combinations)
```

---

### 3. Example Scenarios

#### Case A: Weak System (Numeric Tokens)

* ID: 4 digits
* Password: 4 digits
* Charset: 10

```
Total = 10^8 = 100,000,000
Collision threshold ≈ 10,000 users
```

You will start seeing duplicates around 10k users, which is not suitable for production.

---

#### Case B: Moderate System (Alphanumeric)

* Charset: 36 (a–z + 0–9)
* Total length: 8

```
Total ≈ 2.8 × 10^12
Collision threshold ≈ 1.6 × 10^6
```

Collisions begin around 1.6 million users.

---

#### Case C: Strong System (Base62)

* Charset: 62
* Length: 8

```
Total ≈ 2.18 × 10^14
Collision threshold ≈ 1.5 × 10^7
```

Safe up to approximately 15 million users.

---

### 4. Critical Architectural Insight

Do not rely solely on probability.

Even with low collision probability:

* Enforce uniqueness at the database level
* Use guaranteed unique ID generation where possible
* Retry on collision during vault creation
* Do not couple ID and password logic

---

## License

MIT License — free to use and modify.
