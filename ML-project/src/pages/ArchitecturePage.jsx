import React, { useState } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import ProgressBar from "../components/ProgressBar";
import SettingsPage from "./SettingsPage";
import PayloadPage from "./PayloadPage";
import ReviewPage from "./ReviewPage";
import {
  ArrowRight,
  ArrowLeftCircle,
  RotateCcw,
  RefreshCcw,
  Info,
  ArrowRightCircle,
} from "lucide-react";

/* constants */
const MAX_HIDDEN = 10;
const MAX_VISIBLE_CIRCLES = 10;
const MIN_BOX_HEIGHT = 20;
const MAX_BOX_HEIGHT = 360;
const CIRCLE_SIZE = 20;

/* helpers */
const nextLayerType = (layers) => {
  const hasInput = layers.some((l) => l.type === "input");
  const hasOutput = layers.some((l) => l.type === "output");
  const hiddenCnt = layers.filter((l) => l.type === "hidden").length;

  if (!hasInput) return "input";
  if (!hasOutput && hiddenCnt === 0) return "hidden"; // force ≥1 hidden
  if (!hasOutput && hiddenCnt >= 1) return "output";
  return null;
};

export default function ArchitecturePage() {
  const [layers, setLayers] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // 1-Arch, 2-Settings, 3-Payload, 4-Review
  const [neuronCount, setNeuronCount] = useState(2);
  const [trainSettings, setTrainSettings] = useState({});
  const [payload, setPayload] = useState({});

  /* deploy layers */
  const deployLayer = (type) => {
    setLayers((prev) => [
      ...prev,
      { id: uuidv4(), type, neurons: neuronCount },
    ]);
  };
  const handleDeploy = () => {
    const nt = nextLayerType(layers);
    if (nt) deployLayer(nt);
  };
  const undo = () => setLayers((prev) => prev.slice(0, -1));
  const reset = () => setLayers([]);

  /* derived */
  const inputLayer = layers.find((l) => l.type === "input");
  const hiddenLayers = layers.filter((l) => l.type === "hidden");
  const outputLayer = layers.find((l) => l.type === "output");

  /* ─────────────────────────── render ─────────────────────────── */
  return (
    <>
      <ProgressBar currentStep={currentStep} />

      {/* STEP 1 – architecture builder */}
      {currentStep === 1 && (
        <div className="w-full relative flex h-[calc(100vh-88px)]">
          {/* ---------- side panel ---------- */}
          <div className="w-64 p-6 border-r border-gray-300 flex flex-col gap-6 shrink-0">
            {/* progress dots */}
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-500">
                    {n}
                  </div>
                  <span className="text-sm text-gray-500">
                    {n === 1 && "Input Layer"}
                    {n === 2 && "Hidden Layer"}
                    {n === 3 && "Output Layer"}
                  </span>
                </div>
              ))}
            </div>

            {/* neuron count */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-wide">
                Neuron Count
              </label>
              <input
                type="number"
                step={1}
                min={1}
                max={128}
                value={neuronCount}
                onChange={(e) => setNeuronCount(+e.target.value || 1)}
                className="w-full px-2 py-1 border border-neutral-300 rounded focus:outline-none"
              />
            </div>

            {/* deploy buttons */}
            <div className="flex flex-col gap-2">
              {!inputLayer && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => deployLayer("input")}
                  className="bg-gray-900 text-white rounded-full py-2 font-semibold shadow"
                >
                  Deploy INPUT Layer
                </motion.button>
              )}
              {!outputLayer && hiddenLayers.length < MAX_HIDDEN && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => deployLayer("hidden")}
                  className="bg-gray-900 text-white rounded-full py-2 font-semibold shadow"
                >
                  Deploy HIDDEN Layer
                </motion.button>
              )}
              {!outputLayer && hiddenLayers.length >= 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => deployLayer("output")}
                  className="bg-gray-900 text-white rounded-full py-2 font-semibold shadow"
                >
                  Deploy OUTPUT Layer
                </motion.button>
              )}
            </div>

            {/* summary */}
            <div className="mt-6 bg-white rounded-xl shadow p-4 w-full text-sm">
              <div className="flex items-center gap-1 font-semibold mb-2">
                <Info size={14} /> Summary
              </div>
              <div className="flex justify-between">
                <span>Input</span>{" "}
                <span>{inputLayer ? inputLayer.neurons : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Hidden size</span>{" "}
                <span>{hiddenLayers[0]?.neurons ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Hidden layers</span> <span>{hiddenLayers.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Output</span>{" "}
                <span>{outputLayer ? outputLayer.neurons : "-"}</span>
              </div>
            </div>

            <div className="flex-grow" />

            {/* undo / reset */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.12 }}
                onClick={undo}
                disabled={!layers.length}
                className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow disabled:opacity-40"
              >
                <RotateCcw size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.12 }}
                onClick={reset}
                disabled={!layers.length}
                className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow disabled:opacity-40"
              >
                <RefreshCcw size={20} />
              </motion.button>
            </div>
          </div>

          {/* ---------- visualiser ---------- */}
          <div className="relative flex-1 flex overflow-x-auto overflow-y-hidden bg-gradient-to-br from-gray-50 to-gray-100 pl-6 pr-20">
            <div className="flex items-center gap-10">
              {layers.map((layer, idx) => {
                const circlesVisible = Math.min(
                  layer.neurons,
                  MAX_VISIBLE_CIRCLES
                );
                const dynamicHeight = Math.min(
                  Math.max(
                    MIN_BOX_HEIGHT,
                    circlesVisible * (CIRCLE_SIZE + 4) + 32
                  ),
                  MAX_BOX_HEIGHT
                );
                return (
                  <React.Fragment key={layer.id}>
                    <motion.div
                      whileHover={{
                        scale: 1.06,
                        boxShadow: "0 0 18px rgba(0,0,0,0.35)",
                      }}
                      className="group relative flex flex-col items-center gap-2 rounded-3xl overflow-hidden bg-white"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {layer.neurons} neurons
                      </div>
                      <div className="bg-white border border-gray-400 rounded-3xl p-2 flex flex-col items-center">
                        <span className="capitalize text-[10px] font-semibold mb-1 pointer-events-none">
                          {layer.type}
                        </span>
                        <div
                          className="bg-gray-100 border border-gray-600 rounded-3xl flex flex-col items-center overflow-hidden px-3 py-2"
                          style={{ width: 70, height: dynamicHeight }}
                        >
                          {Array.from({ length: circlesVisible }).map(
                            (_, i) => (
                              <div
                                key={i}
                                className="bg-white border border-gray-800 rounded-full mb-2 last:mb-0"
                                style={{
                                  width: CIRCLE_SIZE,
                                  height: CIRCLE_SIZE,
                                }}
                              />
                            )
                          )}
                          {layer.neurons > MAX_VISIBLE_CIRCLES && (
                            <span className="text-xs font-bold">…</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    {idx !== layers.length - 1 && (
                      <ArrowRight size={34} strokeWidth={1.5} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* continue */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93 }}
            disabled={!outputLayer}
            className="bottom-6 fixed right-6 overflow-hidden px-5 py-2 rounded-full text-sm font-semibold bg-gray-900 text-white"
            onClick={() => setCurrentStep(2)}
          >
            Continue <ArrowRightCircle size={20} className="inline ml-1" />
          </motion.button>
        </div>
      )}

      {/* STEP 2 ─ settings */}
      {currentStep === 2 && (
        <SettingsPage
          onBack={() => setCurrentStep(1)}
          onContinue={() => setCurrentStep(3)}
          onSave={setTrainSettings}
        />
      )}

      {/* STEP 3 ─ payload */}
      {currentStep === 3 && (
        <PayloadPage
          onBack={() => setCurrentStep(2)}
          onContinue={() => setCurrentStep(4)}
          onSave={setPayload}
        />
      )}
      {/* STEP 4 ─ review / train */}
      {currentStep === 4 && (
        <ReviewPage
          layers={layers}
          settings={trainSettings}
          payload={payload} // ← fixes “undefined.trim”
          onBack={() => setCurrentStep(3)}
          onTrain={() => {
            /* call trainModel here */
          }}
        />
      )}
    </>
  );
}
