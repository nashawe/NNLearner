/* ───────── src/pages/SettingsPage.jsx ───────── */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { Listbox } from "@headlessui/react";

export default function SettingsPage({ onBack, onContinue }) {
  const [learningRate, setLearningRate] = useState(0.001);
  const [epochs, setEpochs] = useState(10);
  const [batchSize, setBatchSize] = useState(32);
  const [useDropout, setUseDropout] = useState(false);
  const [dropout, setDropout] = useState(0.5);
  const [weightInit, setWeightInit] = useState("He");
  const [optimizer, setOptimizer] = useState("Adam");

  // animation variants
  const fieldVariants = {
    initial: { y: 0, boxShadow: "0px 2px 4px rgba(0,0,0,0.08)" },
    hover: { y: -4, boxShadow: "0px 8px 15px rgba(0,0,0,0.15)" },
  };
  const btnVariants = {
    hover: { scale: 1.04, boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" },
    tap: { scale: 0.96 },
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 220, damping: 30 }}
      className="w-full h-[calc(100vh-88px)] bg-gray-50 p-8 flex flex-col gap-8 overflow-y-auto"
    >
      {/* header */}
      <div className="flex justify-between items-center mb-4">
        <motion.button
          onClick={onBack}
          variants={btnVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftCircle size={24} /> Architecture
        </motion.button>
        <h1 className="text-2xl font-bold text-gray-800">Training Settings</h1>
      </div>

      {/* form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Learning Rate */}
        <motion.div
          variants={fieldVariants}
          initial="initial"
          whileHover="hover"
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-white p-4 rounded-lg"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Learning Rate
          </label>
          <input
            type="range"
            min={0.00001}
            max={0.1}
            step={0.00001}
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 text-gray-600 text-sm">{learningRate}</div>
        </motion.div>

        {/* Epochs */}
        <motion.div
          variants={fieldVariants}
          initial="initial"
          whileHover="hover"
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-white p-4 rounded-lg"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Epochs
          </label>
          <input
            type="number"
            min={1}
            value={epochs}
            onChange={(e) => setEpochs(parseInt(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </motion.div>

        {/* Batch Size */}
        <motion.div
          variants={fieldVariants}
          initial="initial"
          whileHover="hover"
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-white p-4 rounded-lg"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Batch Size
          </label>

          <Listbox value={batchSize} onChange={setBatchSize}>
            <div className="relative">
              <Listbox.Button className="w-full border rounded px-3 py-2 bg-white text-left">
                {batchSize}
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 w-full rounded bg-white shadow-lg z-10 max-h-60 overflow-auto border">
                {[1, 2, 4, 8, 16, 32, 64, 128].map((option) => (
                  <Listbox.Option
                    key={option}
                    value={option}
                    className={({ active }) =>
                      `px-4 py-2 cursor-pointer ${
                        active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                      }`
                    }
                  >
                    {option}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          <p className="mt-2 text-xs text-gray-500">
            set <strong>1</strong> → each sample hits the net one-by-one
          </p>
        </motion.div>

        {/* Dropout */}
        <motion.div
          variants={fieldVariants}
          initial="initial"
          whileHover="hover"
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-white p-4 rounded-lg"
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={useDropout}
              onChange={(e) => setUseDropout(e.target.checked)}
            />
            Use Dropout
          </label>
          {useDropout && (
            <>
              <input
                type="range"
                min={0}
                max={0.9}
                step={0.05}
                value={dropout}
                onChange={(e) => setDropout(parseFloat(e.target.value))}
                className="w-full mt-3"
              />
              <div className="mt-1 text-gray-600 text-sm">{dropout}</div>
            </>
          )}
        </motion.div>

        {/* Weight Init Method */}
        <motion.div
          variants={fieldVariants}
          initial="initial"
          whileHover="hover"
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-white p-4 rounded-lg"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Weight Init Method
          </label>
          <div className="flex gap-4">
            {["He", "Random", "Xavier"].map((opt) => (
              <motion.label
                key={opt}
                variants={fieldVariants}
                initial="initial"
                whileHover="hover"
                transition={{ type: "spring", stiffness: 200 }}
                className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer"
              >
                <input
                  type="radio"
                  name="weightInit"
                  value={opt}
                  checked={weightInit === opt}
                  onChange={() => setWeightInit(opt)}
                />
                {opt}
              </motion.label>
            ))}
          </div>
        </motion.div>

        {/* Optimizer */}
        <motion.div
          variants={fieldVariants}
          initial="initial"
          whileHover="hover"
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-white p-4 rounded-lg"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Optimizer
          </label>
          <select
            value={optimizer}
            onChange={(e) => setOptimizer(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {["SGD", "Adam", "RMSProp"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* nav buttons */}
      <div className="mt-auto flex justify-end gap-4">
        <motion.button
          onClick={onBack}
          variants={btnVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-white border shadow text-gray-700"
        >
          <ArrowLeftCircle size={20} /> Back
        </motion.button>
        <motion.button
          onClick={onContinue}
          variants={btnVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white shadow"
        >
          Continue <ArrowRightCircle size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
}
