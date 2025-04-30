// BuildPage.jsx – monochrome premium v2 (white bg, extra chunky UI)

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LAYER_TYPES = {
  INPUT: "input",
  HIDDEN: "hidden",
  OUTPUT: "output",
};

const layerTone = {
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
    className={`relative w-80 h-20 rounded-2xl flex items-center justify-center font-semibold tracking-wide uppercase text-white text-xl transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1 ${
      layerTone[layer.type]
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
  const [mode, setMode] = useState("input");

  const addLayer = (type, index = layers.length) => {
    setLayers((prev) => {
      const next = [...prev];
      next.splice(index, 0, {
        id: crypto.randomUUID(),
        type,
        neurons: draftNeurons,
      });
      return next;
    });
  };

  const summary = {
    input_size: layers.find((l) => l.type === LAYER_TYPES.INPUT)?.neurons || 0,
    hidden_size:
      layers.find((l) => l.type === LAYER_TYPES.HIDDEN)?.neurons || 0,
    num_layers: layers.filter((l) => l.type === LAYER_TYPES.HIDDEN).length,
    output_size:
      layers.find((l) => l.type === LAYER_TYPES.OUTPUT)?.neurons || 0,
  };

  const publishInput = () => {
    addLayer(LAYER_TYPES.INPUT, 0);
    setMode("hidden");
  };
  const publishHidden = () => addLayer(LAYER_TYPES.HIDDEN, 1);
  const finishHidden = () => setMode("output");
  const publishOutput = () => addLayer(LAYER_TYPES.OUTPUT);

  const ready = Boolean(summary.output_size);

  /* ------------------------ reusable styles ------------------------ */
  const sideButton =
    "w-full py-4 rounded-2xl bg-black text-white text-xl font-bold tracking-wide shadow-lg transition duration-300 hover:bg-white hover:text-black hover:ring-4 hover:ring-black focus:outline-none";

  return (
    <div className="w-full h-screen bg-white grid grid-cols-[360px_1fr] text-black font-sans">
      {/* ------------ LEFT PANEL ------------- */}
      <aside className="flex flex-col h-full bg-black text-white border-r border-black/10">
        {/* header */}
        <div className="p-7 pb-5 flex items-center gap-4 text-3xl font-extrabold uppercase tracking-wider">
          <span className="inline-block w-4 h-4 rounded-full bg-white animate-pulse" />
          Builder
        </div>

        {/* controls */}
        <div className="flex-1 overflow-y-auto px-7 space-y-12 scrollbar-thin scrollbar-thumb-black/30 scrollbar-track-transparent">
          {/* neuron slider */}
          <div className="space-y-6">
            <label className="block text-xl font-semibold uppercase tracking-wide">
              Neurons
            </label>
            <div className="flex items-center gap-6">
              <input
                type="range"
                min={1}
                max={256}
                value={draftNeurons}
                onChange={(e) => setDraftNeurons(Number(e.target.value))}
                className="flex-1 accent-white h-4 rounded-lg appearance-none cursor-pointer bg-white/20"
              />
              <input
                type="number"
                min={1}
                max={256}
                value={draftNeurons}
                onChange={(e) => setDraftNeurons(Number(e.target.value))}
                className="w-28 text-center text-black font-bold text-lg rounded-xl py-2 focus:outline-none"
              />
            </div>
          </div>

          {/* action buttons */}
          <div className="space-y-6">
            {mode === "input" && (
              <button onClick={publishInput} className={sideButton}>
                Add Input Layer
              </button>
            )}
            {mode === "hidden" && (
              <>
                <button onClick={publishHidden} className={sideButton}>
                  Add Hidden Layer
                </button>
                <button onClick={finishHidden} className={sideButton}>
                  Start Output Layer
                </button>
              </>
            )}
            {mode === "output" && (
              <button onClick={publishOutput} className={sideButton}>
                Add Output Layer
              </button>
            )}
          </div>

          {/* summary */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            {[
              ["Input Size", summary.input_size],
              ["Hidden Neurons", summary.hidden_size],
              ["Layers", summary.num_layers + 2],
              ["Hidden Layers", summary.num_layers],
              ["Output Size", summary.output_size],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between text-base tracking-wide"
              >
                <span>{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ------------ MAIN VISUALIZER ------------- */}
      <main className="relative overflow-auto flex justify-center">
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

        {/* hover detail */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="absolute top-1/2 right-14 -translate-y-1/2 w-72 p-6 rounded-3xl bg-black/90 backdrop-blur-lg shadow-2xl border border-white/10 text-white"
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

        {/* continue button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={ready ? { scale: 1.07 } : {}}
          disabled={!ready}
          className={`fixed bottom-10 right-10 px-14 py-5 rounded-full font-extrabold tracking-wide shadow-2xl transition-all duration-300 uppercase text-xl ${
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
