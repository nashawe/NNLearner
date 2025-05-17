/* ───────── src/pages/ReviewPage.jsx ───────── */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftCircle, Rocket } from "lucide-react";
import { trainModel, fetchTrainingHistory } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ReviewPage({
  layers,
  settings,
  payload,
  onBack,
  onTrain,
}) {
  const [trainingParams, setTrainingParams] = useState(null);
  const inputLayer = layers.find((l) => l.type === "input");
  const hiddenLayers = layers.filter((l) => l.type === "hidden");
  const outputLayer = layers.find((l) => l.type === "output");

  const navigate = useNavigate();

  async function handleTrain() {
    const mode_id = settings.mode_id;
    const output_size = outputLayer?.neurons ?? 1;

    if (mode_id === 5 && output_size === 1) {
      alert("Softmax + cross-entropy mode requires output size > 1.");
      return;
    }

    if ([1, 2, 3, 4].includes(mode_id) && output_size !== 1) {
      alert(
        `Mode ${mode_id} is for binary classification and requires exactly 1 output neuron. You selected ${output_size}.`
      );
      return;
    }

    console.log("Training...");
    /* ─────────── 0. quick guards ─────────── */
    if (!payload?.data?.trim() || !payload?.labels?.trim()) {
      alert("Paste CSV data and labels first.");
      return;
    }

    /* ─────────── 1. parse CSV rows ─────────── */
    const rows = payload.data
      .trim()
      .split(/\r?\n/)
      .map((r) => r.trim())
      .filter(Boolean)
      .map((r) => r.split(",").map((v) => Number(v.trim())));

    const rowLen = rows[0].length;
    const badRow = rows.findIndex((r) => r.length !== rowLen);
    if (badRow !== -1) {
      alert(
        `Row ${badRow + 1} has ${
          rows[badRow].length
        } columns; expected ${rowLen}.`
      );
      return;
    }
    if (rows.some((r) => r.some(Number.isNaN))) {
      alert("Data contains non-numeric values.");
      return;
    }

    /* ─────────── 2. parse labels ─────────── */
    let rawLabels = payload.labels
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .map(Number);

    if (rawLabels.some(Number.isNaN)) {
      alert("Labels contain non-numeric values.");
      return;
    }
    if (rawLabels.length !== rows.length) {
      alert(`You supplied ${rawLabels.length} labels for ${rows.length} rows.`);
      return;
    }

    /* ─────────── 3. shape labels vs output_size ─────────── */
    const uiOutSize = outputLayer?.neurons ?? 1; // chosen in architecture page
    let labelsArr, outputSize;

    if (uiOutSize === 1) {
      // scalar output
      labelsArr = rawLabels; // make column-vector
      outputSize = 1;
    } else {
      const nClasses = Math.max(...rawLabels) + 1;
      if (nClasses !== uiOutSize) {
        alert(
          `Output layer has ${uiOutSize} neurons but labels need ${nClasses}. Fix either one.`
        );
        return;
      }
      labelsArr = rawLabels.map((k) => {
        const vec = Array(nClasses).fill(0);
        vec[k] = 1;
        return vec;
      });
      outputSize = nClasses;
    }
    console.log("Data successfully prepped for classification.");

    /* ─────────── 4. build request body to send to API for training ─────────── */
    const body = {
      /* architecture */
      input_size: rowLen,
      hidden_size: hiddenLayers[0]?.neurons ?? 0,
      output_size: outputSize,
      num_layers: hiddenLayers.length,

      /* training settings */
      dropout: settings.useDropout ? settings.dropout : 0,
      optimizer_choice: settings.optimizer,
      mode_id: settings.mode_id,
      batch_size: settings.batchSize,
      learn_rate: settings.learningRate,
      epochs: settings.epochs,
      init_id: settings.weightInit,
      use_scheduler: settings.useLrScheduler,

      /* payload */
      data: rows,
      labels: labelsArr,
      save_after_train: payload.saveAfter,
      filename: payload.filename || "latest_model.npz",
    };
    navigate("/train", { state: { trainingParams: body } });
  }

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
              <span>{settings.mode_id}</span>
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
          type="button"
          className="relative flex items-center gap-8 bg-indigo-600 font-serif text-[100px] text-white px-20 py-10 rounded-full shadow-lg overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTrain}
        >
          <Rocket size={92} className="shrink-0" /> Train
        </motion.button>
      </div>
    </motion.div>
  );
}
