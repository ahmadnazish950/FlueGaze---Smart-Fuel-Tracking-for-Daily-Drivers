# ⛽ FuelGaze

> Track every litre, every kilometre. Know exactly when to refuel — before you're stranded.

FuelGaze is a lightweight personal fuel tracking app for daily drivers. Log your trips using real odometer readings, calculate accurate fuel consumption, and get smart refill predictions based on your actual driving pattern.

---

## ✨ Features

- **Odometer-based tracking** — Use start & end readings for accurate km calculation
- **Fuel consumption calculator** — Know exactly how much fuel you used per trip
- **Smart refill prediction** — See how many days of fuel you have left
- **Daily fuel advisor** — Get told how much to fill and when, based on your pace
- **Trip history** — All data saved locally on your device
- **Animated preloader** — Cinematic fuel gauge on startup
- **Fully responsive** — Works on mobile, tablet, and desktop

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool |
| React Router v7 | Routing |
| Tailwind CSS v4 | Utility styling |
| localStorage | Data persistence |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/fuelgaze.git

# Go into the project
cd fuelgaze

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
fuelgaze/
├── public/
├── src/
│   ├── Components/
│   │   ├── FuelStats.jsx     # Main fuel entry & calculator
│   │   └── Preloader.jsx     # Animated loading screen
│   ├── App.jsx               # Root component + navbar
│   └── main.jsx
├── index.html
└── package.json
```

---

## 🎨 Design

- **Theme:** Dark industrial — inspired by Uber & Rapido's UI language
- **Colors:** `#FF5722` orange-red · `#FF8C00` amber · `#0A0A0A` background
- **Font:** SF Pro / DM Sans · DM Mono for numbers
- **Logo:** Fuel drop with gaze/eye detail — "see your fuel clearly"

---

## 📦 Deployment

Deployed on **Vercel** — connect your GitHub repo and it auto-deploys on every push.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 📄 License

MIT — free to use and modify.

---

Made with ❤️ for daily drivers who never want to run dry.
