// api.js
// IMPORTANT: When testing on a physical phone via Expo Go, "localhost"
// refers to the phone itself, not your PC. Replace API_URL below with
// your computer's LAN IP address, e.g. "http://192.168.1.5:5000".
// Find it with `ipconfig` (Windows) or `ifconfig` / `ip addr` (Mac/Linux).
// If you're using an Android emulator, "http://10.0.2.2:5000" usually works instead.

export const API_URL = "http://10.187.84.96";

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
