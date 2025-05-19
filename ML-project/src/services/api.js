// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/* helper */
async function req(path, opts = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* exposed API funcs */
export const trainModel = (body) =>
  req("/train", { method: "POST", body: JSON.stringify(body) });

export const predict = (body) =>
  req("/predict", { method: "POST", body: JSON.stringify(body) });

export const listModels = () => req("/models");
