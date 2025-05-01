// BuildPage.jsx  –  monochrome premium v3 (white bg, checklist flow)

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle } from "lucide-react";

const LAYER_TYPES = { INPUT: "input", HIDDEN: "hidden", OUTPUT: "output" };
const tone = {
  [LAYER_TYPES.INPUT]: "bg-gray-800",
  [LAYER_TYPES.HIDDEN]: "bg-gray-700",
  [LAYER_TYPES.OUTPUT]: "bg-gray-900",
};

const LayerCard = ({ layer, idx, hovered, onHover }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    onMouseEnter={() => onHover(layer)}
    onMouseLeave={() => onHover(null)}
    className={`relative w-80 h-20 rounded-2xl flex items-center justify-center text-white text-xl font-semibold uppercase tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer ${
      tone[layer.type]
    } ${hovered?.id === layer.id ? "scale-110 ring-4 ring-black/20" : ""}`}
  >
    {layer.type === LAYER_TYPES.INPUT
      ? "Input Layer"
      : layer.type === LAYER_TYPES.OUTPUT
      ? "Output Layer"
      : `Hidden ${idx}`}
  </motion.div>
);

export default function BuildPage() {
  const [layers, setLayers] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [draftNeurons, setDraftNeurons] = useState(8);
  const [mode, setMode] = useState("input"); // “input” ➜ “hidden” ➜ “output”

  /* helpers */
  const addLayer = (type, index = layers.length) =>
    setLayers((prev) => {
      const next = [...prev];
      next.splice(index, 0, {
        id: crypto.randomUUID(),
        type,
        neurons: draftNeurons,
      });
      return next;
    });

  const summary = {
    input: layers.find((l) => l.type === LAYER_TYPES.INPUT)?.neurons || 0,
    hidden: layers.find((l) => l.type === LAYER_TYPES.HIDDEN)?.neurons || 0,
    hiddenLayers: layers.filter((l) => l.type === LAYER_TYPES.HIDDEN).length,
    output: layers.find((l) => l.type === LAYER_TYPES.OUTPUT)?.neurons || 0,
  };

  /* step handlers */
  const publishInput = () => {
    addLayer(LAYER_TYPES.INPUT, 0);
    setMode("hidden");
  };
  const publishHidden = () => addLayer(LAYER_TYPES.HIDDEN, 1);
  const finishHidden = () => setMode("output");
  const publishOutput = () => addLayer(LAYER_TYPES.OUTPUT);

  const ready = Boolean(summary.output);

  /* reusable classes */
  const btn =
    "w-full py-4 rounded-2xl bg-black text-white text-xl font-bold tracking-wide shadow-lg transition hover:bg-white hover:text-black hover:ring-4 hover:ring-black focus:outline-none";
  const stepHeader = (active, done) =>
    `flex items-center justify-between px-5 py-4 rounded-2xl border-2 font-extrabold text-lg uppercase cursor-pointer select-none transition ${
      active
        ? "border-black bg-black text-white"
        : done
        ? "border-black/30 text-black"
        : "border-gray-300 text-gray-500"
    }`;

  return (
    <div className="w-full h-screen grid grid-cols-[400px_1fr] bg-white text-black font-sans">
      {/* ===== left panel ===== */}
      <aside className="flex flex-col overflow-y-auto border-r border-black/10 px-8 pt-10 pb-6 space-y-10">
        <header className="text-3xl font-extrabold tracking-wide">
          Build - Architecture
        </header>

        {/* checklist */}
        <div className="space-y-8">
          {/* Input */}
          <div>
            <div className={stepHeader(mode === "input", summary.input)}>
              <span>1. Input Layer</span>
              {summary.input ? "✓" : null}
            </div>
            {mode === "input" && (
              <div className="mt-4 px-3 space-y-6">
                {/* neurons */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold uppercase tracking-wide">
                    Neurons
                  </label>
                  <div className="flex items-center gap-6">
                    <input
                      type="range"
                      min={1}
                      max={256}
                      value={draftNeurons}
                      onChange={(e) => setDraftNeurons(Number(e.target.value))}
                      className="flex-1 accent-black h-4 rounded-lg cursor-pointer bg-black/20"
                    />
                    <input
                      type="number"
                      min={1}
                      max={256}
                      value={draftNeurons}
                      onChange={(e) => setDraftNeurons(Number(e.target.value))}
                      className="w-28 text-center text-black font-bold text-lg rounded-xl py-2 border border-black"
                    />
                  </div>
                </div>
                <button onClick={publishInput} className={btn}>
                  Add Input Layer
                </button>
              </div>
            )}
          </div>

          {/* Hidden */}
          <div>
            <div
              className={stepHeader(mode === "hidden", summary.hiddenLayers)}
            >
              <span>2. Hidden Layers</span>
              {summary.hiddenLayers ? "✓" : null}
            </div>
            {mode === "hidden" && (
              <div className="mt-4 px-3 space-y-6">
                <div className="space-y-4">
                  <label className="block text-lg font-semibold uppercase tracking-wide">
                    Neurons per Hidden Layer
                  </label>
                  <div className="flex items-center gap-6">
                    <input
                      type="range"
                      min={1}
                      max={256}
                      value={draftNeurons}
                      onChange={(e) => setDraftNeurons(Number(e.target.value))}
                      className="flex-1 accent-black h-4 rounded-lg cursor-pointer bg-black/20"
                    />
                    <input
                      type="number"
                      min={1}
                      max={256}
                      value={draftNeurons}
                      onChange={(e) => setDraftNeurons(Number(e.target.value))}
                      className="w-28 text-center text-black font-bold text-lg rounded-xl py-2 border border-black"
                    />
                  </div>
                </div>
                <button
                  onClick={publishHidden}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-black text-black font-medium transition hover:bg-black hover:text-white"
                >
                  <Plus size={18} />
                  Add Hidden Layer
                </button>

                <button
                  onClick={finishHidden}
                  className="w-full flex justify-center items-center gap-2 py-4 mt-4 rounded-2xl bg-black text-white text-lg font-semibold tracking-wide transition hover:scale-[1.02] hover:ring-2 hover:ring-black"
                >
                  <CheckCircle size={20} />
                  Done With Hidden Layers
                </button>
              </div>
            )}
          </div>

          {/* Output */}
          <div>
            <div className={stepHeader(mode === "output", summary.output)}>
              <span>3. Output Layer</span>
              {summary.output ? "✓" : null}
            </div>
            {mode === "output" && (
              <div className="mt-4 px-3 space-y-6">
                <div className="space-y-4">
                  <label className="block text-lg font-semibold uppercase tracking-wide">
                    Neurons
                  </label>
                  <div className="flex items-center gap-6">
                    <input
                      type="range"
                      min={1}
                      max={256}
                      value={draftNeurons}
                      onChange={(e) => setDraftNeurons(Number(e.target.value))}
                      className="flex-1 accent-black h-4 rounded-lg cursor-pointer bg-black/20"
                    />
                    <input
                      type="number"
                      min={1}
                      max={256}
                      value={draftNeurons}
                      onChange={(e) => setDraftNeurons(Number(e.target.value))}
                      className="w-28 text-center text-black font-bold text-lg rounded-xl py-2 border border-black"
                    />
                  </div>
                </div>
                <button onClick={publishOutput} className={btn}>
                  Add Output Layer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* summary */}
        <div className="space-y-4 pt-6 border-t border-black/10">
          <h2 className="text-2xl font-bold">Summary</h2>
          {[
            ["Input Size", summary.input],
            ["Hidden Neurons", summary.hidden],
            ["Layers", summary.hiddenLayers + 2],
            ["Hidden Layers", summary.hiddenLayers],
            ["Output Size", summary.output],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between text-xl tracking-wide py-1"
            >
              <span>{label}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ===== main visualizer ===== */}
      <main className="relative flex justify-center items-center overflow-auto">
        {layers.length === 0 ? (
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-gray-400">
              Your architecture will appear here
            </div>
            <div className="text-lg text-gray-500">
              Start by configuring the input layer on the left.
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 gap-8">
            {layers.map((layer, idx) => (
              <React.Fragment key={layer.id}>
                <LayerCard
                  layer={layer}
                  idx={idx}
                  hovered={hovered}
                  onHover={setHovered}
                />
                {idx !== layers.length - 1 && (
                  <div className="w-px h-12 bg-black/20" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* hover detail */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="absolute top-1/2 right-14 -translate-y-1/2 w-72 p-6 rounded-3xl bg-black/90 text-white backdrop-blur-lg shadow-2xl border border-white/10"
            >
              <div className="text-2xl font-bold capitalize mb-3 tracking-wider">
                {hovered.type} layer
              </div>
              <div className="text-xl font-medium">
                {hovered.neurons} neuron{hovered.neurons === 1 ? "" : "s"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* continue */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={ready ? { scale: 1.07 } : {}}
          disabled={!ready}
          className={`fixed bottom-10 right-10 px-14 py-5 rounded-full text-xl font-extrabold uppercase shadow-2xl transition-all ${
            ready
              ? "bg-black text-white hover:bg-white hover:text-black border-4 border-black"
              : "bg-black/20 text-black/40 cursor-not-allowed border-4 border-black/20"
          }`}
        >
          Continue
        </motion.button>
      </main>
    </div>
  );
}
