# ✦ Royal Developer Portfolio

A baroque-editorial portfolio built with **Vite + React**, styled around a rich dark palette of deep crimson, aged gold, and near-black — pulled directly from your profile image.

---

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Set your GitHub username
# Open src/services/github.js and change:
const USERNAME = 'YOUR_GITHUB_USERNAME'

# 3. (Optional) Add token for higher rate limits
# Create .env:
VITE_GITHUB_TOKEN=ghp_your_token_here

# 4. Run
npm run dev

# 5. Build
npm run build
```

---

## 📁 Structure

```
portfolio/
├── public/
│   └── profile.png              ← Your portrait image (replace or keep)
├── src/
│   ├── App.jsx
│   ├── index.css                ← CSS variables (colors, fonts)
│   ├── main.jsx
│   ├── services/
│   │   └── github.js            ← 🔧 Set USERNAME here
│   └── components/
│       ├── Hero/                ← Split layout: text left, image right (50vw)
│       ├── About/               ← Bio + live GitHub stats grid
│       ├── Skills/              ← Grouped skill cards + scrolling belt
│       ├── Projects/            ← GitHub repos grid with language filter
│       ├── ProjectCard/         ← Individual repo card
│       ├── Experience/          ← Vertical timeline
│       ├── Contact/             ← Links pulled from GitHub profile
│       └── Footer/              ← Nav + brand + credits
```

---

## 🎨 Customisation

### Change name / bio / tagline
Edit text in `src/components/Hero/Hero.jsx` and `About/About.jsx`.

### Update skills
Edit `SKILL_GROUPS` and `BELT_SKILLS` in `src/components/Skills/Skills.jsx`.

### Update experience / timeline
Edit `TIMELINE` array in `src/components/Experience/Experience.jsx`.

### Change profile image
Replace `public/profile.png` with any PNG/JPG. The Hero layout keeps it at exactly 50% viewport width.

### Tweak colors
All colors are CSS variables in `src/index.css`:
```css
--gold:    #c9a84c;   /* primary accent */
--crimson: #6b1a1a;   /* deep red tone */
--cream:   #f0e6cc;   /* light text */
--bg:      #0c0806;   /* darkest background */
```

---

## 🌐 Deploy

```bash
npm run build   # outputs /dist — deploy anywhere
```

Works with **Vercel**, **Netlify**, **GitHub Pages**, **Cloudflare Pages**.

---

## 📌 Sections

| Section | Description |
|---|---|
| Hero | Split layout with portrait, name, CTA buttons |
| About | Bio text + stat cards (repos, followers, years, etc.) |
| Skills | Grouped by category + animated scrolling ticker |
| Projects | GitHub repos, auto-fetched, filterable by language |
| Experience | Vertical timeline (edit manually) |
| Contact | Links auto-populated from GitHub profile API |
| Footer | Navigation + credits |
