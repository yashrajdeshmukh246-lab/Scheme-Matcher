import React, { useState } from "react";
import { matchSchemes } from "./api";

const initialForm = {
  name: "",
  age: "",
  gender: "Male",
  category: "General",
  annualIncome: "",
  businessType: "Service",
  state: "Any",
  hasDisability: false,
  isMinority: false
};

const STATES = [
  "Any", "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal", "Other"
];

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await matchSchemes(form);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Scheme Setu</h1>
        <p>Find the government schemes you're actually eligible for &mdash; in one form.</p>
      </header>

      <main className="main">
        <section className="card form-card">
          <h2>Your Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  required
                  min="18"
                  max="100"
                />
              </div>

              <div className="field">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div className="field">
                <label>Annual Income (Rs.)</label>
                <input
                  type="number"
                  name="annualIncome"
                  value={form.annualIncome}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g. 180000"
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Business Type</label>
                <select name="businessType" value={form.businessType} onChange={handleChange}>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Service">Service</option>
                  <option value="Trading">Trading</option>
                  <option value="Agriculture">Agriculture</option>
                </select>
              </div>

              <div className="field">
                <label>State</label>
                <select name="state" value={form.state} onChange={handleChange}>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field-row checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="hasDisability"
                  checked={form.hasDisability}
                  onChange={handleChange}
                />
                Person with disability
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isMinority"
                  checked={form.isMinority}
                  onChange={handleChange}
                />
                Belongs to a notified minority community
              </label>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Matching..." : "Find My Schemes"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
        </section>

        {result && (
          <section className="results">
            <div className="summary-card">
              <h2>
                You are eligible for <span className="highlight">{result.eligibleCount}</span> out of{" "}
                {result.totalSchemesChecked} schemes checked
              </h2>
            </div>

            {result.eligibleSchemes.map((scheme) => (
              <div key={scheme.id} className="card scheme-card eligible">
                <div className="scheme-header">
                  <h3>{scheme.name}</h3>
                  <span className="badge">Eligible</span>
                </div>
                <p className="ministry">{scheme.ministry}</p>
                <p>{scheme.description}</p>
                <p className="benefits"><strong>Benefit:</strong> {scheme.benefits}</p>

                <details>
                  <summary>Why you match ({scheme.reasons.length} criteria)</summary>
                  <ul>
                    {scheme.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </details>

                <a href={scheme.applyLink} target="_blank" rel="noreferrer" className="apply-link">
                  Apply / Learn more &rarr;
                </a>
              </div>
            ))}

            {result.eligibleSchemes.length === 0 && (
              <p className="no-match">
                No schemes matched this profile in our demo database. Try adjusting the details above.
              </p>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Built for SIH26092 &mdash; AI-Driven Scheme Matching for Marginalized Entrepreneurs</p>
        <p className="disclaimer">
          Demo data only. Verify current eligibility and benefits on official scheme portals before applying.
        </p>
      </footer>
    </div>
  );
}
