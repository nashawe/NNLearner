// BuildPage.jsx – compact left panel layout

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LAYER_TYPES = {
  INPUT: "input",
  HIDDEN: "hidden",
  OUTPUT: "output",
};

const LayerCard = ({ layer, idx, onHover, hovered }) => (
  <motion.div
    onMouseEnter={() => onHover(layer)}
    onMouseLeave={() => onHover(null)}
    layout
    className={`relative w-64 h-12 rounded-lg flex items-center justify-center font-semibold text-white transition ${
      hovered?.id === layer.id
        ? "scale-105 shadow-2xl"
        : "shadow-md hover:scale-105 hover:shadow-xl"
    } ${
      layer.type === LAYER_TYPES.INPUT
        ? "bg-indigo-600"
        : layer.type === LAYER_TYPES.OUTPUT
        ? "bg-emerald-600"
        : "bg-sky-600"
    }`}
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

  return (
    <div className="w-full h-screen bg-white grid grid-cols-[280px_1fr]">
      {/* compact left panel */}
      <div className="border-r border-gray-200 flex flex-col">
        <div className="p-4 space-y-5 text-gray-900">
          {/* neuron control – slider + input inline */}
          <div className="space-y-1">
            <label className="block text-sm font-medium">Neuron Count</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={256}
                value={draftNeurons}
                onChange={(e) => setDraftNeurons(Number(e.target.value))}
                className="flex-1 accent-indigo-500"
              />
              <input
                type="number"
                min={1}
                max={256}
                value={draftNeurons}
                onChange={(e) => setDraftNeurons(Number(e.target.value))}
                className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </div>
          </div>

          {/* buttons – tight gap */}
          <div className="space-y-3">
            {mode === "input" && (
              <button
                onClick={publishInput}
                className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow"
              >
                Add Input Layer
              </button>
            )}
            {mode === "hidden" && (
              <>
                <button
                  onClick={publishHidden}
                  className="w-full py-2 rounded bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow"
                >
                  Add Hidden Layer
                </button>
                <button
                  onClick={finishHidden}
                  className="w-full py-2 rounded bg-lime-600 hover:bg-lime-700 text-white font-semibold shadow"
                >
                  Start Output Layer
                </button>
              </>
            )}
            {mode === "output" && (
              <button
                onClick={publishOutput}
                className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
              >
                Add Output Layer
              </button>
            )}
          </div>
        </div>

        {/* summary compress */}
        <div className="mt-auto p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-800 space-y-1">
          <div className="flex justify-between">
            <span>input_size</span>
            <span className="font-semibold">{summary.input_size}</span>
          </div>
          <div className="flex justify-between">
            <span>hidden_size</span>
            <span className="font-semibold">{summary.hidden_size}</span>
          </div>
          <div className="flex justify-between">
            <span>num_layers</span>
            <span className="font-semibold">{summary.num_layers}</span>
          </div>
          <div className="flex justify-between">
            <span>output_size</span>
            <span className="font-semibold">{summary.output_size}</span>
          </div>
        </div>
      </div>

      {/* main visualizer unchanged */}
      <div className="relative overflow-auto">
        <div className="flex flex-col items-center py-16 gap-4">
          {layers.map((layer, idx) => (
            <React.Fragment key={layer.id}>
              <LayerCard
                layer={layer}
                idx={idx}
                hovered={hovered}
                onHover={setHovered}
              />
              {idx !== layers.length - 1 && (
                <div className="w-px h-6 bg-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* hover detail panel */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-1/2 right-6 -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-56 space-y-1"
            >
              <div className="font-semibold text-gray-700 capitalize text-sm">
                {hovered.type} layer
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{hovered.neurons}</span> neuron(s)
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          disabled={!ready}
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full font-semibold shadow-md transition ${
            ready
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
