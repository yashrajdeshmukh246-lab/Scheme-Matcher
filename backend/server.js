// server.js
// Simple Express API that powers BOTH the web app and the mobile app.
// No database needed for the demo -- schemes are read from data/schemes.json.

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { matchSchemes } = require("./matchEngine");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const schemesPath = path.join(__dirname, "data", "schemes.json");

function loadSchemes() {
  const raw = fs.readFileSync(schemesPath, "utf-8");
  return JSON.parse(raw);
}

// Health check -- useful when hosting, to confirm the API is alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Scheme Matching API is running" });
});

// List every scheme in the database (used for an "explore all schemes" screen)
app.get("/api/schemes", (req, res) => {
  const schemes = loadSchemes();
  res.json({ count: schemes.length, schemes });
});

// Core matching endpoint used by both the web app and the mobile app
app.post("/api/match", (req, res) => {
  const profile = req.body;

  const requiredFields = ["age", "gender", "category", "annualIncome", "businessType", "state"];
  const missing = requiredFields.filter((f) => profile[f] === undefined || profile[f] === "");
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
  }

  const normalizedProfile = {
    age: Number(profile.age),
    gender: profile.gender,
    category: profile.category,
    annualIncome: Number(profile.annualIncome),
    businessType: profile.businessType,
    state: profile.state,
    hasDisability: !!profile.hasDisability,
    isMinority: !!profile.isMinority
  };

  const schemes = loadSchemes();
  const { eligibleSchemes, notEligibleSchemes } = matchSchemes(schemes, normalizedProfile);

  res.json({
    profile: normalizedProfile,
    totalSchemesChecked: schemes.length,
    eligibleCount: eligibleSchemes.length,
    eligibleSchemes,
    notEligibleSchemes
  });
});

app.listen(PORT, () => {
  console.log(`Scheme Matching API running at http://localhost:${PORT}`);
});
