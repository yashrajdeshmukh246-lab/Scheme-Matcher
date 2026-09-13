# Scheme Setu — AI-Driven Scheme Matching for Marginalized Entrepreneurs
### SIH26092 | Ministry of Social Justice and Empowerment (MoSJE)

A profile-based matching engine that tells an entrepreneur exactly which
government welfare/business schemes they are eligible for, instead of
making them search dozens of scattered portals.

One backend, two clients:

```
scheme-matcher/
├── backend/          Node.js + Express API (shared by both apps)
│   ├── data/
│   │   └── schemes.json     15 sample government schemes with eligibility rules
│   ├── matchEngine.js       The core, explainable rule-matching logic
│   ├── server.js            API routes
│   └── package.json
│
├── web/              React (Vite) web app
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
│
└── mobile/           React Native (Expo) mobile app
    ├── src/
    │   └── api.js
    ├── App.js
    ├── app.json
    └── package.json
```

Both the web app and the mobile app call the exact same backend endpoint
(`POST /api/match`), so the eligibility logic only exists in one place.

---

## How the matching works (no ML training required)

`backend/matchEngine.js` checks a user's profile (age, gender, caste
category, annual income, business type, state, disability status,
minority status) against each scheme's eligibility rules stored in
`schemes.json`, and returns:

- which schemes they're eligible for, ranked by how many criteria matched
- the exact reasons they matched (for transparency)
- which schemes they're NOT eligible for and why (useful to explain in a viva)

This is intentionally a transparent, explainable rules engine rather than
a black-box model — every result can be justified on the spot, which is
exactly what you want in front of judges or a professor. You can extend
it later with an LLM layer (e.g. to explain results conversationally in
Hindi/regional languages) once the core logic is working.

---

## 1. Running it on your PC (do this first)

You need **Node.js** installed (v18 or later). Check with:
```
node -v
```
If not installed, get it from https://nodejs.org

### Step 1 — Start the backend
```bash
cd backend
npm install
npm start
```
You should see: `Scheme Matching API running at http://localhost:5000`

Leave this terminal running.

### Step 2 — Start the web app (in a NEW terminal)
```bash
cd web
npm install
npm run dev
```
Open the URL it prints (usually `http://localhost:3000`) in your browser.
Fill the form and click "Find My Schemes" — it will call your local backend.

### Step 3 — Run the mobile app (in a NEW terminal)
```bash
cd mobile
npm install
npm start
```
This opens Expo's developer tools. Install the **Expo Go** app on your
phone (Android/iOS, free on Play Store / App Store), then scan the QR
code shown in the terminal/browser.

**Important:** your phone and PC must be on the **same Wi-Fi network**.
Also, in `mobile/src/api.js`, replace:
```js
export const API_URL = "http://localhost:5000";
```
with your PC's local IP address, e.g.:
```js
export const API_URL = "http://192.168.1.5:5000";
```
Find your PC's IP with:
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` or `ip addr`

If you don't want to install Expo Go, you can instead run `npm run web`
inside the `mobile` folder to preview the mobile UI in a browser tab.

---

## 2. Hosting it (for your college presentation / a public link)

You don't have to host anything to present — running it locally on your
laptop with the steps above is enough for a live demo. But if you want a
shareable public link:

### Host the backend (pick one, both have free tiers)
- **Render** (render.com): New → Web Service → connect your GitHub repo →
  root directory `backend` → build command `npm install` → start command
  `npm start`.
- **Railway** (railway.app): New Project → Deploy from GitHub → select the
  `backend` folder as root.

Once hosted, you'll get a URL like `https://your-app.onrender.com`.

### Host the web app
- **Vercel** (vercel.com) or **Netlify** (netlify.com): import the repo,
  set root directory to `web`, build command `npm run build`, output
  directory `dist`.
- Before deploying, create a `.env` file inside `web/` (copy from
  `.env.example`) and set:
  ```
  VITE_API_URL=https://your-app.onrender.com
  ```

### "Host" the mobile app
For a college demo you almost never need to publish to the Play
Store/App Store. Two easy options:
1. **Keep using Expo Go** — just make sure your backend URL in
   `mobile/src/api.js` points to your hosted backend URL instead of your
   local IP, then anyone with Expo Go can scan your QR code.
2. **Expo EAS Build** (optional, only if you want an installable `.apk`):
   ```bash
   npm install -g eas-cli
   eas login
   eas build -p android --profile preview
   ```
   This produces a downloadable `.apk` link you can share and install
   directly on any Android phone — no Play Store needed.

---

## 3. What to say in your presentation

- **Problem**: eligible people miss out on schemes because information is
  scattered and eligibility rules are confusing.
- **Solution**: a single form → instant, explainable eligibility results
  across dozens of schemes.
- **Why it's technically sound**: one backend logic layer, two front-end
  clients (web + mobile) — a realistic, scalable architecture, not just a
  prototype hack.
- **Why it's honest/explainable**: show the "Why you match" dropdown on a
  result — every decision is traceable to a rule, not a black box.
- **Roadmap** (mention as future work): plug in a real, larger scheme
  database (e.g. via the [MyScheme](https://www.myscheme.gov.in/) API/
  data if available), add a regional-language chatbot layer using an LLM
  for follow-up questions, add document-upload based auto-fill (e.g. from
  an Aadhaar/income certificate).

---

## Disclaimer

The scheme data in `backend/data/schemes.json` is illustrative for demo
purposes (based on publicly known scheme names and approximate criteria)
and should be verified against official government sources before any
real-world claims are made about eligibility.
