import React, { useState } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import {
  ArrowRight,
  RotateCcw,
  RefreshCcw,
  Info,
  ArrowRightCircle,
} from "lucide-react";

/* ───────── constants ───────── */
const MAX_HIDDEN = 20;
const MAX_VISIBLE_CIRCLES = 12;
const MIN_BOX_HEIGHT = 80;
const MAX_BOX_HEIGHT = 360;
const CIRCLE_SIZE = 26;

/* ───────── helpers ───────── */
const nextLayerType = (layers) => {
  const hasInput = layers.some((l) => l.type === "input");
  const hiddenCnt = layers.filter((l) => l.type === "hidden").length;
  const hasOutput = layers.some((l) => l.type === "output");
  if (!hasInput) return "input";
  if (!hasOutput && hiddenCnt < MAX_HIDDEN) return "hidden";
  if (!hasOutput && hiddenCnt >= 1) return "output";
  return null;
};

const canAdd = (layers) => {
  const nt = nextLayerType(layers);
  return nt === "input" || nt === "hidden";
};

export default function BuildPage() {
  const [layers, setLayers] = useState([]); // {id,type,neurons}
  const [neuronCount, setNeuronCount] = useState(16);

  /* ───────── deployment ───────── */
  const deployLayer = (type) => {
    if (
      type === "hidden" &&
      layers.some((l) => l.type === "hidden" && l.neurons !== neuronCount)
    )
      return;
    setLayers((prev) => [
      ...prev,
      { id: uuidv4(), type, neurons: neuronCount },
    ]);
  };

  const handleDeploy = () => {
    const nt = nextLayerType(layers);
    if (nt) deployLayer(nt);
  };

  /* ───────── undo & reset ───────── */
  const undo = () => setLayers((prev) => prev.slice(0, -1));
  const reset = () => setLayers([]);

  /* ───────── derived ───────── */
  const inputLayer = layers.find((l) => l.type === "input");
  const hiddenLayers = layers.filter((l) => l.type === "hidden");
  const outputLayer = layers.find((l) => l.type === "output");
  const step = !inputLayer ? 1 : outputLayer ? 3 : 2;
  const isOutputStage = step === 2 && hiddenLayers.length >= 1 && !outputLayer;

  /* ───────── UI ───────── */
  return (
    <div className="w-full h-screen flex font-sans bg-white text-black select-none">
      {/* ───── side panel ───── */}
      <div className="w-64 p-6 border-r border-gray-300 flex flex-col gap-6 shrink-0">
        <h2 className="text-xl font-bold">Build Network</h2>

        {/* progress indicator */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === n
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {n}
              </div>
              <span
                className={`text-sm ${
                  step === n ? "font-semibold" : "text-gray-500"
                }`}
              >
                {n === 1 && "Input"}
                {n === 2 && "Hidden"}
                {n === 3 && "Output"}
              </span>
            </div>
          ))}
        </div>

        {/* neuron slider */}
        <div className="flex flex-col gap-3 mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide">
            Neuron Count
          </label>
          <input
            type="range"
            min={2}
            max={128}
            value={neuronCount}
            onChange={(e) => setNeuronCount(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm font-medium">
            {neuronCount} neurons
          </div>

          {/* deploy button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            disabled={!canAdd(layers)}
            onClick={handleDeploy}
            className="bg-gray-900 text-white rounded-full py-2 font-semibold shadow disabled:opacity-40"
          >
            Deploy {nextLayerType(layers)?.toUpperCase()} Layer
          </motion.button>

          {/* output presets */}
          {isOutputStage && (
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-300">
              <div className="text-center text-xs font-semibold text-gray-500">
                or
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide -mt-1">
                Quick Presets
              </span>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 10, 26].map((n) => (
                  <motion.button
                    key={n}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      setNeuronCount(n);
                      deployLayer("output");
                    }}
                    className="rounded-full border border-gray-600 px-3 py-1 text-xs font-medium"
                  >
                    {n}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ───── visualizer ───── */}
      <div className="relative flex-1 flex overflow-x-auto overflow-y-hidden bg-gradient-to-br from-gray-50 to-gray-100 py-10 pl-6 pr-20">
        <div className="flex items-center gap-16">
          {layers.map((layer, idx) => {
            const circlesVisible = Math.min(layer.neurons, MAX_VISIBLE_CIRCLES);
            const dynamicHeight = Math.min(
              Math.max(MIN_BOX_HEIGHT, circlesVisible * (CIRCLE_SIZE + 4) + 32),
              MAX_BOX_HEIGHT
            );
            return (
              <React.Fragment key={layer.id}>
                {/* card wrapper */}
                <motion.div
                  whileHover={{
                    scale: 1.06,
                    boxShadow: "0 0 18px rgba(0,0,0,0.35)",
                  }}
                  className="group relative flex flex-col items-center gap-2 rounded-3xl overflow-hidden bg-white"
                >
                  {/* tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {layer.neurons} neurons
                  </div>

                  {/* rounded card */}
                  <div className="bg-white border border-gray-400 rounded-3xl p-2 flex flex-col items-center">
                    <span className="capitalize text-[10px] font-semibold mb-1 pointer-events-none">
                      {layer.type}
                    </span>
                    <div
                      className="bg-gray-100 border border-gray-600 rounded-3xl flex flex-col items-center overflow-hidden px-3 py-2"
                      style={{ width: 70, height: dynamicHeight }}
                    >
                      {Array.from({ length: circlesVisible }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-white border border-gray-800 rounded-full mb-2 last:mb-0"
                          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
                        />
                      ))}
                      {layer.neurons > MAX_VISIBLE_CIRCLES && (
                        <span className="text-xs font-bold">…</span>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* arrow */}
                {idx !== layers.length - 1 && (
                  <ArrowRight
                    size={34}
                    strokeWidth={1.5}
                    className="flex-shrink-0"
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ───── summary box ───── */}
      <div className="fixed top-4 right-4 bg-white rounded-xl shadow p-4 w-56 text-sm">
        <div className="flex items-center gap-1 font-semibold mb-2">
          <Info size={14} />
          Summary
        </div>
        <div className="flex justify-between">
          <span>Input</span>
          <span>{inputLayer ? inputLayer.neurons : "-"}</span>
        </div>
        <div className="flex justify-between">
          <span>Hidden size</span>
          <span>{hiddenLayers[0] ? hiddenLayers[0].neurons : "-"}</span>
        </div>
        <div className="flex justify-between">
          <span>Hidden layers</span>
          <span>{hiddenLayers.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Output</span>
          <span>{outputLayer ? outputLayer.neurons : "-"}</span>
        </div>
      </div>

      {/* ───── undo / reset ───── */}
      <div className="fixed bottom-6 left-6 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.12 }}
          onClick={undo}
          disabled={layers.length === 0}
          className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow disabled:opacity-40"
        >
          <RotateCcw size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.12 }}
          onClick={reset}
          disabled={layers.length === 0}
          className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow disabled:opacity-40"
        >
          <RefreshCcw size={20} />
        </motion.button>
      </div>

      {/* ───── continue button ───── */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        disabled={!outputLayer}
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-full font-semibold shadow disabled:opacity-40"
        onClick={() => {
          /* placeholder */
        }}
      >
        Continue <ArrowRightCircle size={20} />
      </motion.button>
    </div>
  );
}
