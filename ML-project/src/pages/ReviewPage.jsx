/* ───────── src/pages/ReviewPage.jsx ───────── */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftCircle, Rocket } from "lucide-react";

/* same lil’ ripple vibe from SettingsPage */
const rippleAnim = {
  initial: { scale: 0, opacity: 0.35 },
  animate: {
    scale: 3,
    opacity: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function ReviewPage({ layers, settings, onBack, onTrain }) {
  const inputLayer = layers.find((l) => l.type === "input");
  const hiddenLayers = layers.filter((l) => l.type === "hidden");
  const outputLayer = layers.find((l) => l.type === "output");

  const [blastOff, setBlastOff] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-[calc(100vh-90px)] bg-gray-50 text-gray-900 flex flex-col"
    >
      {/* breadcrumb */}
      <div className="flex gap-2 items-center px-6 py-3 text-sm font-medium">
        <button
          onClick={onBack}
          className="flex items-center gap-1 hover:text-gray-600"
        >
          <ArrowLeftCircle size={18} /> Payload
        </button>
        <span className="opacity-50">→</span>
        <span className="font-bold">Review</span>
      </div>

      {/* summaries */}
      <div className="grid gap-6 md:grid-cols-2 max-w-5xl w-full mx-auto px-6 mb-auto">
        {/* architecture summary (pulled straight outta ArchitecturePage) :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1} */}
        <section className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Architecture</h2>
          <div className="flex flex-col gap-1 text-sm">
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
        </section>

        {/* settings summary */}
        <section className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Training Settings</h2>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span>Mode: </span>
              <span>{settings.mode}</span>
            </div>
            <div className="flex justify-between">
              <span>Learning rate</span>
              <span>{settings.learningRate}</span>
            </div>
            <div className="flex justify-between">
              <span>Epochs</span>
              <span>{settings.epochs}</span>
            </div>
            <div className="flex justify-between">
              <span>Batch size</span>
              <span>{settings.batchSize}</span>
            </div>
            <div className="flex justify-between">
              <span>Dropout</span>
              <span>{settings.useDropout ? settings.dropout : "off"}</span>
            </div>
            <div className="flex justify-between">
              <span>Weight init</span>
              <span>{settings.weightInit}</span>
            </div>
            <div className="flex justify-between">
              <span>Optimizer</span>
              <span>{settings.optimizer}</span>
            </div>
          </div>
        </section>
      </div>

      {/* chunky TRAIN button */}
      <div className="w-full flex justify-center pb-16">
        <motion.button
          onClick={() => {
            setBlastOff(true);
            setTimeout(onTrain, 1200); // wire up ya actual train callback
          }}
          className="relative overflow-hidden flex items-center gap-3 px-16 py-8 rounded-full text-2xl font-black uppercase tracking-wider shadow-lg text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          animate={
            blastOff
              ? {
                  y: [0, -20, -100, -300, -800],
                  x: [0, 10, -10, 5, 0],
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 0.9, 1, 0.8],
                  opacity: [1, 1, 1, 0.8, 0],
                  transition: {
                    duration: 1.2,
                    ease: "easeIn",
                    times: [0, 0.2, 0.5, 0.8, 1],
                  },
                }
              : {}
          }
        >
          <AnimatePresence>
            {!blastOff && (
              <motion.span
                className="absolute inset-0 opacity-0"
                variants={{ hover: rippleAnim }}
              >
                <motion.span
                  variants={rippleAnim}
                  className="absolute left-1/2 top-1/2 w-1 h-1 bg-white rounded-full"
                />
              </motion.span>
            )}
          </AnimatePresence>
          <Rocket size={28} className="shrink-0" /> Train
        </motion.button>
      </div>
    </motion.div>
  );
}
