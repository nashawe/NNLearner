// src/pages/ReviewPage.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence, // AnimatePresence if you have modals or conditional items
} from "framer-motion";
import {
  ArrowLeftCircle,
  Rocket,
  CheckCircle,
  Cpu,
  Layers as LayersIcon, // Renamed to avoid conflict with React 'layers'
  Brain,
  Settings as SettingsIcon, // Renamed for clarity
  Database,
  AlertTriangle,
  Info, // For preset mode badge
  Lock, // If preset mode, indicate settings were locked
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
// ScrollTrigger isn't strictly needed here unless AnimatedCounter is very complex or other scroll effects are added
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// if (!ScrollTrigger.isRegistered && typeof window !== 'undefined') { // Ensure only client-side
//   gsap.registerPlugin(ScrollTrigger);
// }

// --- Theme ---
const theme = {
  bg: "bg-slate-950",
  surface: "bg-slate-900",
  card: "bg-slate-800",
  cardAlt: "bg-slate-800/60 backdrop-blur-md border border-slate-700/80", // Slightly more opaque border
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  accent: "sky",
  accentSecondary: "emerald",
  accentTertiary: "rose",
  divider: "border-slate-700/80",
};

// --- Reusable Animated Counter (Self-contained for simplicity) ---
const AnimatedCounter = ({ endValue, duration = 0.8 }) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const triggerRef = useRef(null); // Ref for IntersectionObserver target

  useEffect(() => {
    if (typeof endValue !== "number" || isNaN(endValue)) {
      if (ref.current) ref.current.textContent = "-";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target); // Stop observing once in view
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      if (triggerRef.current) {
        observer.unobserve(triggerRef.current);
      }
    };
  }, [triggerRef]);

  useEffect(() => {
    if (
      !isInView ||
      typeof endValue !== "number" ||
      isNaN(endValue) ||
      !ref.current
    )
      return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: endValue,
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = Math.round(obj.val).toLocaleString();
        }
      },
    });
  }, [endValue, duration, isInView]);

  return (
    // triggerRef is on the span that will actually be scrolled into view
    <span ref={triggerRef}>
      <span ref={ref} className="font-mono">
        {typeof endValue !== "number" || isNaN(endValue) ? "-" : "0"}
      </span>
    </span>
  );
};

// --- Main ReviewPage Component ---
export default function ReviewPage({
  layers = [], // Default to empty array
  settings = {}, // Default to empty object
  payload = {}, // Default to empty object
  onBack,
  onTrain, // This will be called internally by handleTrainSequence before navigate
  isPresetMode = false, // Accept isPresetMode prop
}) {
  const navigate = useNavigate();
  const trainButtonRef = useRef(null);
  const [isTraining, setIsTraining] = useState(false);

  // Guards for critical undefined props (layers might be empty initially but not undefined)
  if (!settings || Object.keys(settings).length === 0) {
    console.error("ReviewPage: 'settings' prop is undefined or empty.");
    return (
      <div
        className={`w-full h-screen flex flex-col items-center justify-center ${theme.bg} ${theme.textPrimary} p-8 text-center`}
      >
        {" "}
        <AlertTriangle size={48} className="text-rose-500 mb-4" />{" "}
        <h2 className="text-2xl font-bold mb-2">Configuration Error</h2>{" "}
        <p className={`${theme.textSecondary}`}>
          Settings data is missing. Please go back.
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
  if (!layers) {
    // Check for undefined specifically
    console.error("ReviewPage: 'layers' prop is undefined.");
    return (
      <div
        className={`w-full h-screen flex flex-col items-center justify-center ${theme.bg} ${theme.textPrimary} p-8 text-center`}
      >
        {" "}
        <AlertTriangle size={48} className="text-rose-500 mb-4" />{" "}
        <h2 className="text-2xl font-bold mb-2">Architecture Error</h2>{" "}
        <p className={`${theme.textSecondary}`}>
          Model architecture data is missing.
        </p>{" "}
        <button
          onClick={onBack ? () => onBack() : () => navigate(-2)}
          className={`mt-6 px-6 py-2 rounded-lg bg-${theme.accent}-600 text-white`}
        >
          Go Back
        </button>{" "}
      </div>
    );
  }
  if (!payload || Object.keys(payload).length === 0) {
    console.error("ReviewPage: 'payload' prop is undefined or empty.");
    return (
      <div
        className={`w-full h-screen flex flex-col items-center justify-center ${theme.bg} ${theme.textPrimary} p-8 text-center`}
      >
        {" "}
        <AlertTriangle size={48} className="text-rose-500 mb-4" />{" "}
        <h2 className="text-2xl font-bold mb-2">Data Error</h2>{" "}
        <p className={`${theme.textSecondary}`}>
          Training data payload is missing.
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

  const inputLayer = layers.find((l) => l.type === "input") || {
    neurons: "N/A",
  }; // Fallback
  const hiddenLayers = layers.filter((l) => l.type === "hidden") || [];
  const outputLayer = layers.find((l) => l.type === "output") || {
    neurons: "N/A",
  }; // Fallback

  const handleTrainSequence = async () => {
    if (isTraining) return;
    setIsTraining(true);

    const tl = gsap.timeline({
      onComplete: async () => {
        // This onComplete will run after all GSAP animations in tl are done.
        // --- Stage 2: Perform Core Logic (Data Parsing and Validation) ---
        const mode_id = settings.mode_id;
        const output_neurons = parseInt(outputLayer?.neurons || 1); // Default to 1 if undefined

        if (mode_id === 5 && output_neurons <= 1) {
          // Softmax needs >1 output neurons
          alert(
            "Softmax + Cross-Entropy mode requires an output layer size greater than 1."
          );
          setIsTraining(false); // Reset button state
          // Reverse button animation or reset it
          if (trainButtonRef.current)
            gsap.to(trainButtonRef.current, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.3,
              boxShadow: "none",
            });
          return;
        }
        if ([1, 2, 3, 4].includes(mode_id) && output_neurons !== 1) {
          alert(
            `Mode ${mode_id} (Binary/Regression) requires exactly 1 output neuron. You have ${output_neurons}.`
          );
          setIsTraining(false);
          if (trainButtonRef.current)
            gsap.to(trainButtonRef.current, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.3,
              boxShadow: "none",
            });
          return;
        }
        if (!payload?.data?.trim() || !payload?.labels?.trim()) {
          alert(
            "Training data or labels are missing. Please go back and provide them."
          );
          setIsTraining(false);
          if (trainButtonRef.current)
            gsap.to(trainButtonRef.current, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.3,
              boxShadow: "none",
            });
          return;
        }

        const rows = payload.data
          .trim()
          .split(/\r?\n/)
          .map((r) => r.trim())
          .filter(Boolean)
          .map((r) => r.split(",").map((v) => Number(v.trim())));
        if (rows.length === 0 || rows.some((r) => r.length === 0)) {
          alert("Data is empty or has empty rows.");
          setIsTraining(false);
          /* Reset button anim */ return;
        }
        const rowLen = rows[0].length;
        if (rows.some((r) => r.length !== rowLen)) {
          alert("Data rows have inconsistent column counts.");
          setIsTraining(false);
          /* Reset button anim */ return;
        }
        if (rows.some((r) => r.some(isNaN))) {
          alert("Data contains non-numeric values.");
          setIsTraining(false);
          /* Reset button anim */ return;
        }

        let rawLabels = payload.labels
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
          .map(Number);
        if (rawLabels.some(isNaN)) {
          alert("Labels contain non-numeric values.");
          setIsTraining(false);
          /* Reset button anim */ return;
        }
        if (rawLabels.length !== rows.length) {
          alert(
            `Label count (${rawLabels.length}) doesn't match data row count (${rows.length}).`
          );
          setIsTraining(false);
          /* Reset button anim */ return;
        }

        let labelsArr, outputSizeApi;
        if (output_neurons === 1) {
          labelsArr = rawLabels;
          outputSizeApi = 1;
        } else {
          const uniqueLabels = [...new Set(rawLabels)].sort((a, b) => a - b);
          // For classification, labels should usually be 0, 1, ..., N-1 for N classes
          const nClasses = uniqueLabels.length; // A better way to determine numClasses from data
          if (nClasses !== output_neurons) {
            alert(
              `Output layer has ${output_neurons} neurons, but labels suggest ${nClasses} distinct classes. Please ensure consistency or check for label encoding issues (e.g. are they 0-indexed?).`
            );
            setIsTraining(false);
            /* Reset button anim */ return;
          }
          labelsArr = rawLabels.map((k) => {
            const vec = Array(nClasses).fill(0);
            if (k < 0 || k >= nClasses) {
              throw new Error(
                `Label ${k} is out of bounds for ${nClasses} classes.`
              );
            }
            vec[k] = 1;
            return vec;
          });
          outputSizeApi = nClasses;
        }

        const body = {
          input_size: parseInt(inputLayer?.neurons || rowLen), // Use actual input from data if input layer is missing neurons for some reason
          hidden_size: parseInt(hiddenLayers[0]?.neurons || 0),
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
          filename:
            payload.filename ||
            `${
              isPresetMode
                ? initialPresetData?.name?.replace(/\s+/g, "_").toLowerCase() ||
                  "preset"
                : "custom"
            }_model.npz`,
        };

        if (onTrain) onTrain(body); // Call the passed onTrain prop (for any other side-effects or logging)
        navigate("/train", { state: { trainingParams: body } });
        // No need to setIsTraining(false) here if navigating away.
      },
    });

    if (trainButtonRef.current) {
      tl.to(trainButtonRef.current, {
        scale: 0.92,
        duration: 0.15,
        ease: "power2.in",
      })
        .to(
          trainButtonRef.current.querySelector(".rocket-icon"),
          { rotate: -10, x: -4, duration: 0.1, ease: "none" },
          "<"
        )
        .to(
          trainButtonRef.current,
          {
            scale: 1.3,
            duration: 0.35,
            ease: "elastic.out(0.8, 0.4)",
            boxShadow: `0 0 50px 15px rgba(${
              theme.accentRGB || "14,165,233"
            },0.4), 0 0 0px 0px rgba(${theme.accentRGB || "14,165,233"},0.6)`,
          },
          "-=0.05"
        )
        .to(
          trainButtonRef.current.querySelector(".rocket-icon"),
          {
            y: -100,
            x: 30,
            opacity: 0,
            scale: 1.8,
            rotate: 30,
            duration: 0.45,
            ease: "power2.in",
          },
          "<0.1"
        )
        .to(
          trainButtonRef.current,
          { opacity: 0, y: -15, scale: 1.1, duration: 0.25, ease: "power1.in" },
          "-=0.2"
        );
    } else {
      tl.add(() => {
        // if no button ref for some reason, just proceed with logic after a small delay
        tl.vars.onComplete(); // Manually call onComplete if no button animation
      }, "+=0.1");
    }
    // Removed await tl.then(); as onComplete handles the next stage
  };

  const getSettingDisplayValue = (key, defaultValue = "N/A") => {
    /* ... (same) ... */
    if (settings && typeof settings[key] !== "undefined") {
      if (key === "dropout")
        return settings.useDropout ? settings.dropout : "Off"; // Simplified dropout display
      if (key === "weightInit")
        return (
          { 1: "Random", 2: "Xavier", 3: "He" }[settings[key]] || defaultValue
        );
      if (key === "optimizer")
        return (
          { 1: "SGD", 2: "RMSProp", 3: "Adam" }[settings[key]] || defaultValue
        );
      if (key === "mode_id")
        return (
          {
            1: "Sigmoid + MSE",
            2: "Sigmoid + BCE",
            3: "Tanh + MSE",
            4: "ReLU, Sigmoid + BCE",
            5: "ReLU, Softmax + CCE",
          }[settings[key]] || defaultValue
        );
      if (typeof settings[key] === "boolean")
        return settings[key] ? "Enabled" : "Disabled";
      if (typeof settings[key] === "number" && key === "learningRate")
        return settings[key].toExponential(2);
      return settings[key];
    }
    return defaultValue;
  };

  const pageVariants = {
    /* ... (same) ... */ initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "circOut", staggerChildren: 0.08 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "circIn" } },
  };
  const itemVariants = {
    /* ... (same) ... */ initial: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(2px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
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

      <div className="flex-grow w-full max-w-5xl mx-auto px-6 py-8 sm:py-10 flex flex-col items-center">
        {" "}
        {/* Reduced -my-4 */}
        {isPresetMode && (
          <motion.div
            variants={itemVariants} // Apply item variant for entrance
            className={`w-full mb-6 p-3.5 rounded-lg bg-${theme.accent}-800/40 border border-${theme.accent}-700 text-${theme.accent}-200 text-sm flex items-center justify-center gap-2.5 shadow-md`}
          >
            <Lock size={16} /> You are using a preset configuration. Settings
            and data were pre-filled.
          </motion.div>
        )}
        <motion.div
          variants={itemVariants}
          className="w-full grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10"
        >
          <section
            className={`${theme.cardAlt} p-5 sm:p-6 rounded-2xl shadow-xl`}
          >
            <div className="flex items-center gap-3 mb-3 border-b border-slate-700/70 pb-3">
              <LayersIcon size={22} className={`text-${theme.accent}-400`} />
              <h2
                className={`text-lg sm:text-xl font-semibold ${theme.textPrimary}`}
              >
                Model Architecture
              </h2>
            </div>
            <div className="space-y-1.5 text-sm">
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
                  label: "Hidden Layers",
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
                  item.value !== null && (
                    <div
                      key={item.label}
                      className="flex justify-between items-center py-1"
                    >
                      {" "}
                      <span
                        className={`flex items-center gap-1.5 ${theme.textMuted} text-xs sm:text-sm`}
                      >
                        <item.Icon size={14} />
                        {item.label}
                      </span>{" "}
                      <AnimatedCounter endValue={parseInt(item.value) || 0} />{" "}
                    </div>
                  )
              )}
            </div>
          </section>
          <section
            className={`${theme.cardAlt} p-5 sm:p-6 rounded-2xl shadow-xl`}
          >
            <div className="flex items-center gap-3 mb-3 border-b border-slate-700/70 pb-3">
              <SettingsIcon
                size={22}
                className={`text-${theme.accentSecondary}-400`}
              />
              <h2
                className={`text-lg sm:text-xl font-semibold ${theme.textPrimary}`}
              >
                Training Configuration
              </h2>
            </div>
            <div className="space-y-0.5 text-sm">
              {" "}
              {/* Reduced space-y */}
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
                  className="flex justify-between items-center py-1"
                >
                  {" "}
                  <span className={`${theme.textMuted} text-xs sm:text-sm`}>
                    {item.label}
                  </span>{" "}
                  <span
                    className={`font-medium text-xs sm:text-sm ${
                      getSettingDisplayValue(item.key) === "Off" ||
                      getSettingDisplayValue(item.key) === "Disabled"
                        ? theme.textMuted
                        : theme.textPrimary
                    }`}
                  >
                    {getSettingDisplayValue(item.key, "-")}
                  </span>{" "}
                </div>
              ))}
            </div>
          </section>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center w-full mt-auto pt-4"
        >
          {" "}
          {/* Ensure button is pushed down */}
          <motion.button
            ref={trainButtonRef}
            type="button"
            disabled={isTraining}
            className={`relative flex items-center justify-center gap-3 sm:gap-4 rounded-full font-bold text-lg sm:text-xl md:text-2xl border-2 sm:border-4 border-${
              theme.accent
            }-600/70
                        px-8 py-3 sm:px-12 sm:py-5 md:px-14 md:py-6 
                        bg-gradient-to-br from-${theme.accent}-500 via-${
              theme.accent
            }-600 to-${theme.accentSecondary}-500 
                        text-white shadow-2xl hover:shadow-${
                          theme.accent
                        }-500/40 overflow-hidden
                        transform transition-all duration-200 ease-out ${
                          isTraining
                            ? "opacity-60 cursor-not-allowed brightness-75"
                            : `hover:brightness-110`
                        }`}
            whileHover={
              !isTraining
                ? {
                    scale: 1.04,
                    y: -4,
                    boxShadow: `0px 8px 25px rgba(${
                      theme.accentRGB || "14,165,233"
                    },0.35), 0px 0px 30px rgba(${
                      theme.accentSecondaryRGB || "16,185,129"
                    },0.25)`,
                  }
                : {}
            }
            whileTap={!isTraining ? { scale: 0.97 } : {}}
            onClick={handleTrainSequence}
          >
            <motion.div
              className="rocket-icon"
              animate={
                isTraining
                  ? {
                      y: [0, -4, 0, -6, 0],
                      rotate: [0, 1.5, -1.5, 2, 0],
                      transition: {
                        repeat: Infinity,
                        duration: 0.4,
                        ease: "easeInOut",
                      },
                    }
                  : {}
              }
            >
              <Rocket
                size={30}
                className="shrink-0 sm:w-10 sm:h-10 md:w-12 md:h-12"
                strokeWidth={1.5}
              />
            </motion.div>
            <span className="relative z-10 tracking-wide">
              {isTraining ? "Launching Mission..." : "LAUNCH TRAINING"}
            </span>
            {!isTraining && (
              <motion.div
                className={`absolute inset-0 rounded-full bg-${theme.accent}-500 opacity-0 group-hover:opacity-15`}
                whileHover={{
                  opacity: [0, 0.2, 0.05, 0.25, 0],
                  scale: [1, 1.25, 1],
                  transition: {
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              />
            )}
          </motion.button>
          <p className={`mt-4 text-xs ${theme.textMuted}`}>
            Final check: Data and all settings are as intended.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
