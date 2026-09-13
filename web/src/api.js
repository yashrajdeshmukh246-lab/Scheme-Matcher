// api.js
// Central place for the backend URL so it's a one-line change
// when you move from localhost to a hosted backend.

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function matchSchemes(profile) {
  const res = await fetch(`${API_URL}/api/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile)
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || "Something went wrong while matching schemes.");
  }

  return res.json();
}
