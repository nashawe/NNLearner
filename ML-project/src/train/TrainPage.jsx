// src/pages/TrainPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { trainModel, fetchTrainingHistory } from "../services/api";
import SeparateHistoryCharts from "../components/SeparateHistoryCharts";
import { ArrowLeft, Home, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function TrainPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const trainingParams = state?.trainingParams;

  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);

  const metricsRef = useRef(null);
  const paramsRef = useRef(null);

  // ────────────────────────────────────────────────────────────────────────────────
  const hasTrained = useRef(false);

  const runTraining = async () => {
    setError(null);
    setHistory(null);
    try {
      const res = await trainModel(trainingParams);
      const hist = await fetchTrainingHistory(res.training_id);
      setHistory(hist);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!trainingParams || hasTrained.current) return;
    hasTrained.current = true;
    runTraining();
  }, [trainingParams]);

  /* helpers */
  const SectionBtn = ({ label, onClick }) => (
    <button
      onClick={onClick}
      className="px-4 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-medium transition"
    >
      {label}
    </button>
  );

  const scrollInto = (ref) => {
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ────────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ───── sticky header ───── */}
      <header className="sticky top-0 z-30 bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold">Training&nbsp;Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <SectionBtn
              label="Metrics"
              onClick={() => scrollInto(metricsRef)}
            />
            <SectionBtn label="Params" onClick={() => scrollInto(paramsRef)} />
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title="Home"
            >
              <Home size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ───── content ───── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 space-y-16">
        {/* Parameters summary */}
        <section
          ref={paramsRef}
          id="params"
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
            <Settings size={20} /> Run Parameters
          </h2>
          {trainingParams ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {Object.entries(trainingParams).map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="font-medium text-gray-600">
                    {k.replace(/_/g, " ")}
                  </span>
                  {Array.isArray(v) ? (
                    <div className="text-gray-900 overflow-hidden line-clamp-2">
                      {v.join(", ")}
                    </div>
                  ) : (
                    <span className="text-gray-900 break-all">{String(v)}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No parameters.</p>
          )}
        </section>

        {/* Metrics / charts */}
        <section ref={metricsRef} id="metrics">
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-xl shadow">
              Backend error: {error}
            </div>
          )}

          {!history && !error && (
            <motion.div
              className="text-center py-6 text-gray-900 text-2xl font-semibold bg-white rounded-3xl shadow-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [1, 0.2, 1],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
              }}
            >
              Training&nbsp;in&nbsp;progress…
            </motion.div>
          )}

          {history && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SectionBtn
                label="Rerun"
                onClick={runTraining}
                className="text-center"
              />

              <SeparateHistoryCharts
                loss={history.loss}
                accuracy={history.accuracy}
                learning_rate={history.learning_rate}
              />
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}
