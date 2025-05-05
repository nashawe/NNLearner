/* ---------- src/services/api.js ---------- */
const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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

export function subTrainStatus(onMsg) {
  const ws = new WebSocket(`${BASE.replace(/^http/, "ws")}/ws/train-status`);
  ws.onmessage = (e) => onMsg(JSON.parse(e.data));
  return () => ws.close(); // caller can unsubscribe
}
