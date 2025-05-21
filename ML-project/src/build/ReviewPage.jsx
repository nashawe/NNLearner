// src/pages/ReviewPage.jsx
import { motion, AnimatePresence } from "framer-motion";
// ReviewPage.jsx
import React, { useState, useRef, useEffect } from "react"; // ADD useEffect HERE
import {
  ArrowLeftCircle,
  Rocket,
  CheckCircle,
  Cpu,
  Layers as LayersIcon,
  Brain,
  Settings as SettingsIcon,
  Database,
  AlertTriangle,
} from "lucide-react"; // Added more icons
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (!ScrollTrigger.isRegistered) {
  gsap.registerPlugin(ScrollTrigger);
}

// --- Theme ---
const theme = {
  bg: "bg-slate-950",
  surface: "bg-slate-900",
  card: "bg-slate-800",
  cardAlt: "bg-slate-800/60 backdrop-blur-md border border-slate-700", // Glassmorphic cards
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  accent: "sky",
  accentSecondary: "emerald",
  accentTertiary: "rose",
  divider: "border-slate-700",
};

// --- Reusable Animated Counter (for summary stats) ---
const AnimatedCounter = ({ endValue }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof endValue !== "number" || isNaN(endValue)) return;
    const DURATION = 0.8;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: endValue,
      duration: DURATION,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = Math.round(obj.val).toLocaleString();
        }
      },
      scrollTrigger: {
        trigger: ref.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  }, [endValue]);
  if (typeof endValue !== "number" || isNaN(endValue))
    return <span className="font-mono">-</span>;
  return (
    <span ref={ref} className="font-mono">
      0
    </span>
  );
};

// --- Main ReviewPage Component ---
export default function ReviewPage({
  layers,
  settings,
  payload,
  onBack,
  onTrain,
}) {
  const navigate = useNavigate();
  const trainButtonRef = useRef(null);
  const [isTraining, setIsTraining] = useState(false); // To manage train button state/animation

  // Guards from original component - IMPORTANT
  if (!settings) {
    /* ... (original guard for settings) ... */
    console.error("ReviewPage: 'settings' prop is undefined.");
    return (
      <div
        className={`w-full h-screen flex flex-col items-center justify-center ${theme.bg} ${theme.textPrimary} p-8 text-center`}
      >
        {" "}
        <AlertTriangle size={48} className="text-rose-500 mb-4" />{" "}
        <h2 className="text-2xl font-bold mb-2">Configuration Error</h2>{" "}
        <p className={`${theme.textSecondary}`}>
          Settings data is missing. Please go back and ensure settings are saved
          correctly.
        </p>{" "}
        <button
          onClick={onBack || (() => navigate(-1))}
          className={`mt-6 px-6 py-2 rounded-lg bg-${theme.accent}-600 text-white`}
        >
          Go Back
        </button>{" "}
      </div>
    );
  }
  if (!layers || layers.length === 0) {
    /* ... (original guard for layers) ... */
    console.error("ReviewPage: 'layers' prop is undefined or empty.");
    return (
      <div
        className={`w-full h-screen flex flex-col items-center justify-center ${theme.bg} ${theme.textPrimary} p-8 text-center`}
      >
        {" "}
        <AlertTriangle size={48} className="text-rose-500 mb-4" />{" "}
        <h2 className="text-2xl font-bold mb-2">Architecture Error</h2>{" "}
        <p className={`${theme.textSecondary}`}>
          Model architecture data is missing. Please define your model layers.
        </p>{" "}
        <button
          onClick={onBack ? () => onBack() : () => navigate(-2)}
          className={`mt-6 px-6 py-2 rounded-lg bg-${theme.accent}-600 text-white`}
        >
          Go Back
        </button>{" "}
      </div>
    ); // Go back 2 steps if no specific onBack for layers
  }
  if (!payload) {
    /* ... (original guard for payload) ... */
    console.error("ReviewPage: 'payload' prop is undefined.");
    return (
      <div
        className={`w-full h-screen flex flex-col items-center justify-center ${theme.bg} ${theme.textPrimary} p-8 text-center`}
      >
        {" "}
        <AlertTriangle size={48} className="text-rose-500 mb-4" />{" "}
        <h2 className="text-2xl font-bold mb-2">Data Error</h2>{" "}
        <p className={`${theme.textSecondary}`}>
          Training data payload is missing. Please provide data.
        </p>{" "}
        <button
          onClick={onBack || (() => navigate(-1))}
          className={`mt-6 px-6 py-2 rounded-lg bg-${theme.accent}-600 text-white`}
        >
          Go Back
        </button>{" "}
      </div>
    );
  }

  const inputLayer = layers.find((l) => l.type === "input");
  const hiddenLayers = layers.filter((l) => l.type === "hidden") || [];
  const outputLayer = layers.find((l) => l.type === "output");

  const handleTrainSequence = async () => {
    if (isTraining) return;
    setIsTraining(true);

    // --- Stage 1: Button Click Visuals (GSAP Timeline) ---
    const tl = gsap.timeline();
    if (trainButtonRef.current) {
      tl.to(trainButtonRef.current, {
        scale: 0.9,
        duration: 0.2,
        ease: "power2.in",
      })
        .to(
          trainButtonRef.current.querySelector(".rocket-icon"),
          { rotate: -15, x: -5, duration: 0.1, ease: "none" },
          "<"
        )
        .to(
          trainButtonRef.current,
          {
            scale: 1.5,
            duration: 0.4,
            ease: "elastic.out(1, 0.5)",
            boxShadow: `0 0 60px 20px rgba(var(--color-${theme.accent}-rgb, 14 165 233), 0.5), 0 0 0px 0px rgba(var(--color-${theme.accent}-rgb, 14 165 233), 0.7)`, // Expanding glow
          },
          "-=0.05"
        )
        .to(
          trainButtonRef.current.querySelector(".rocket-icon"),
          {
            y: -80,
            x: 20,
            opacity: 0,
            scale: 1.5,
            rotate: 25,
            duration: 0.5,
            ease: "power2.in",
          },
          "<0.1"
        ) // Rocket launches
        .to(
          trainButtonRef.current,
          {
            opacity: 0,
            y: -20, // Button lifts off slightly as it fades
            scale: 1.2, // Keep it large as it fades
            duration: 0.3,
            ease: "power1.in",
          },
          "-=0.2"
        );
    }

    await tl.then(); // Wait for GSAP timeline to complete

    // --- Stage 2: Call Original handleTrain (Core Logic) ---
    // This function contains all your data parsing and navigation.
    // It's crucial this remains exactly as it was functionally.
    const mode_id = settings.mode_id;
    const output_neurons = parseInt(outputLayer?.neurons ?? 1); // Ensure it's a number

    if (mode_id === 5 && output_neurons === 1) {
      alert("Softmax + cross-entropy mode requires output size > 1.");
      setIsTraining(false);
      return;
    }
    if ([1, 2, 3, 4].includes(mode_id) && output_neurons !== 1) {
      alert(
        `Mode ${mode_id} is for binary classification and requires exactly 1 output neuron. You selected ${output_neurons}.`
      );
      setIsTraining(false);
      return;
    }
    if (!payload?.data?.trim() || !payload?.labels?.trim()) {
      alert("Paste CSV data and labels first.");
      setIsTraining(false);
      return;
    }

    const rows = payload.data
      .trim()
      .split(/\r?\n/)
      .map((r) => r.trim())
      .filter(Boolean)
      .map((r) => r.split(",").map((v) => Number(v.trim())));
    if (rows.length === 0 || rows[0].length === 0) {
      alert("Data is empty or incorrectly formatted.");
      setIsTraining(false);
      return;
    }
    const rowLen = rows[0].length;
    if (rows.some((r) => r.length !== rowLen)) {
      alert("Data rows have inconsistent column counts.");
      setIsTraining(false);
      return;
    }
    if (rows.some((r) => r.some(Number.isNaN))) {
      alert("Data contains non-numeric values.");
      setIsTraining(false);
      return;
    }

    let rawLabels = payload.labels
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .map(Number);
    if (rawLabels.some(Number.isNaN)) {
      alert("Labels contain non-numeric values.");
      setIsTraining(false);
      return;
    }
    if (rawLabels.length !== rows.length) {
      alert(`You supplied ${rawLabels.length} labels for ${rows.length} rows.`);
      setIsTraining(false);
      return;
    }

    let labelsArr, outputSizeApi;
    if (output_neurons === 1) {
      labelsArr = rawLabels;
      outputSizeApi = 1;
    } else {
      const nClasses = Math.max(...rawLabels) + 1;
      if (nClasses !== output_neurons) {
        alert(
          `Output layer has ${output_neurons} neurons but labels imply ${nClasses} classes.`
        );
        setIsTraining(false);
        return;
      }
      labelsArr = rawLabels.map((k) => {
        const vec = Array(nClasses).fill(0);
        vec[k] = 1;
        return vec;
      });
      outputSizeApi = nClasses;
    }

    const body = {
      input_size: rowLen,
      hidden_size: parseInt(hiddenLayers[0]?.neurons ?? 0), // Ensure number
      output_size: outputSizeApi,
      num_layers: hiddenLayers.length,
      dropout: settings.useDropout ? settings.dropout : 0,
      optimizer_choice: settings.optimizer,
      mode_id: settings.mode_id,
      batch_size: settings.batchSize,
      learn_rate: settings.learningRate,
      epochs: settings.epochs,
      init_id: settings.weightInit,
      use_scheduler: settings.useLrScheduler,
      data: rows,
      labels: labelsArr,
      save_after_train: payload.saveAfter,
      filename: payload.filename || "latest_model.npz",
    };

    // Actual navigation happens here
    if (onTrain) onTrain(body); // Call the passed onTrain prop (if used for other side effects)
    navigate("/train", { state: { trainingParams: body } });
    // setIsTraining(false); // Might not be necessary if navigating away
  };

  const getSettingDisplayValue = (key, defaultValue = "N/A") => {
    /* ... (original helper) ... */
    if (settings && typeof settings[key] !== "undefined") {
      if (key === "dropout" && !settings.useDropout) return "Off";
      if (key === "dropout" && settings.useDropout) return settings.dropout;
      if (key === "weightInit") {
        const map = { 1: "Random", 2: "Xavier", 3: "He" };
        return map[settings[key]] || defaultValue;
      }
      if (key === "optimizer") {
        const map = { 1: "SGD", 2: "RMSProp", 3: "Adam" };
        return map[settings[key]] || defaultValue;
      }
      if (key === "mode_id") {
        const modeMap = {
          1: "Sigmoid + MSE",
          2: "Sigmoid + BCE",
          3: "Tanh + MSE",
          4: "ReLU, Sigmoid + BCE",
          5: "ReLU, Softmax + CCE",
        };
        return modeMap[settings[key]] || defaultValue;
      }
      if (typeof settings[key] === "boolean")
        return settings[key] ? "Enabled" : "Disabled";
      return settings[key];
    }
    return defaultValue;
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "circOut", staggerChildren: 0.1 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "circIn" } },
  };
  const itemVariants = {
    initial: { opacity: 0, scale: 0.95, filter: "blur(3px)" },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`relative w-full min-h-[calc(100vh-80px)] ${theme.bg} ${theme.textSecondary} flex flex-col scrollbar-thin scrollbar-thumb-slate-700`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 ${theme.bg} bg-opacity-70 backdrop-blur-md z-20 px-6 py-3.5 border-b ${theme.divider} flex items-center justify-between shadow-sm`}
      >
        <motion.button
          onClick={onBack}
          className={`flex items-center gap-1.5 text-sm ${theme.textMuted} hover:${theme.textPrimary} transition-colors`}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeftCircle size={18} /> Back to Data
        </motion.button>
        <h1
          className={`text-lg font-semibold ${theme.textPrimary} absolute left-1/2 -translate-x-1/2`}
        >
          Final Review & Launch
        </h1>
        <div className="w-32"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow w-full max-w-5xl mx-auto px-6 py-8 sm:py-12 -my-4 flex flex-col items-center">
        <motion.div
          variants={itemVariants}
          className="w-full grid md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12"
        >
          {/* Architecture Summary Card */}
          <section className={`${theme.cardAlt} p-6 rounded-2xl shadow-xl`}>
            <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-3">
              <LayersIcon size={24} className={`text-${theme.accent}-400`} />
              <h2 className={`text-xl font-semibold ${theme.textPrimary}`}>
                Model Architecture
              </h2>
            </div>
            <div className="space-y-2 text-sm">
              {[
                {
                  label: "Input Neurons",
                  value: inputLayer?.neurons,
                  Icon: Cpu,
                },
                {
                  label: "Hidden Layer Size",
                  value: hiddenLayers[0]?.neurons,
                  Icon: Brain,
                },
                {
                  label: "Number of Hidden Layers",
                  value: hiddenLayers.length,
                  Icon: LayersIcon,
                },
                {
                  label: "Output Neurons",
                  value: outputLayer?.neurons,
                  Icon: Cpu,
                },
              ].map(
                (item) =>
                  item.value !== undefined &&
                  item.value !== null && ( // Only render if value is present
                    <div
                      key={item.label}
                      className="flex justify-between items-center py-1.5"
                    >
                      <span
                        className={`flex items-center gap-2 ${theme.textMuted}`}
                      >
                        <item.Icon size={14} />
                        {item.label}
                      </span>
                      <AnimatedCounter endValue={item.value} />
                    </div>
                  )
              )}
            </div>
          </section>

          {/* Settings Summary Card */}
          <section
            className={`${theme.cardAlt} px-6 py-4 rounded-2xl shadow-xl`}
          >
            <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-3">
              <SettingsIcon
                size={24}
                className={`text-${theme.accentSecondary}-400`}
              />
              <h2 className={`text-xl font-semibold ${theme.textPrimary}`}>
                Training Configuration
              </h2>
            </div>
            <div className="space-y-1 text-sm">
              {[
                { key: "mode_id", label: "Mode" },
                { key: "learningRate", label: "Learning Rate" },
                { key: "epochs", label: "Epochs" },
                { key: "batchSize", label: "Batch Size" },
                { key: "dropout", label: "Dropout" },
                { key: "weightInit", label: "Weight Init" },
                { key: "optimizer", label: "Optimizer" },
                { key: "useLrScheduler", label: "LR Scheduler" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex justify-between items-center py-1.5"
                >
                  <span className={theme.textMuted}>{item.label}</span>
                  <span
                    className={`font-medium ${
                      getSettingDisplayValue(item.key) === "Off" ||
                      getSettingDisplayValue(item.key) === "Disabled"
                        ? theme.textMuted
                        : theme.textPrimary
                    }`}
                  >
                    {getSettingDisplayValue(item.key, "-")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </motion.div>

        {/* TRAIN BUTTON - The Main Event */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center -mt-4 w-full"
        >
          {" "}
          {/* Pushes button towards bottom */}
          <motion.button
            ref={trainButtonRef}
            type="button"
            disabled={isTraining}
            className={`relative flex items-center justify-center gap-4 sm:gap-6 rounded-full font-bold text-xl sm:text-2xl md:text-3xl border-4 border-sky-600/50
                        px-10 py-2 sm:px-14 sm:py-7 md:px-16 md:py-8
                        bg-gradient-to-br from-${theme.accent}-500 via-${
              theme.accent
            }-600 to-${theme.accentSecondary}-500 
                        text-white shadow-2xl hover:shadow-${
                          theme.accent
                        }-500/50 overflow-hidden
                        transform transition-all duration-300 ease-out ${
                          isTraining ? "opacity-70 cursor-not-allowed" : ""
                        }`}
            whileHover={
              !isTraining
                ? {
                    scale: 1.05,
                    y: -5,
                    boxShadow: `0px 10px 30px rgba(var(--color-${theme.accent}-rgb,14 165 233),0.4), 0px 0px 40px rgba(var(--color-${theme.accentSecondary}-rgb,16 185 129),0.3)`,
                  }
                : {}
            }
            whileTap={!isTraining ? { scale: 0.98 } : {}}
            onClick={handleTrainSequence}
          >
            <motion.div
              className="rocket-icon"
              animate={
                isTraining
                  ? {
                      y: [0, -5, 0, -8, 0],
                      rotate: [0, 2, -2, 3, 0],
                      transition: {
                        repeat: Infinity,
                        duration: 0.5,
                        ease: "easeInOut",
                      },
                    }
                  : {}
              }
            >
              <Rocket
                size={36}
                className="shrink-0 sm:w-12 sm:h-12 md:w-14 md:h-14"
                strokeWidth={1.5}
              />
            </motion.div>
            <span className="relative z-10 tracking-wider">
              {isTraining ? "Initializing..." : "LAUNCH TRAINING"}
            </span>
            {/* Pulsing aura when not training and hovered */}
            {!isTraining && (
              <motion.div
                className={`absolute inset-0 rounded-full bg-${theme.accent}-500 opacity-0 group-hover:opacity-20`}
                whileHover={{
                  opacity: [0, 0.3, 0.1, 0.4, 0],
                  scale: [1, 1.3, 1],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              />
            )}
          </motion.button>
          <p className={`mt-5 text-xs ${theme.textMuted}`}>
            Ensure data and settings are correct before launching.
          </p>
        </motion.div>
      </div>

      {/* No separate footer bar, as navigation is via sticky top bar */}
    </motion.div>
  );
}
