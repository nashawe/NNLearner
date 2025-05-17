/* ---------- src/services/api.js ---------- */
const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const API_URL = "http://127.0.0.1:8000";

/* lil helper */
async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* -------- exposed funcs -------- */
export const trainModel = (body) =>
  req("/train", { method: "POST", body: JSON.stringify(body) });

export const predict = (body) =>
  req("/predict", { method: "POST", body: JSON.stringify(body) });

export const listModels = () => req("/models");

export async function fetchTrainingHistory(trainingId) {
  const res = await fetch(`${API_URL}/training-history/${trainingId}`);
  if (!res.ok) throw new Error("failed to fetch history");
  return res.json();
}
