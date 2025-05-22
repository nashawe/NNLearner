// ArchitecturePage.jsx
import React, {
  useState,
  useEffect,
  // useRef, // No longer explicitly needed for GSAP section animations, Framer handles it
  // useLayoutEffect, // No longer explicitly needed
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import ProgressBar from "../components/common/ProgressBar"; // Assuming path is correct
import SettingsPage from "./SettingsPage";
import PayloadPage from "./PayloadPage";
import ReviewPage from "./ReviewPage";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  RotateCcw,
  RefreshCcw,
  Info,
  ArrowRightCircle,
  PlusCircle,
  CheckCircle,
  Layers as LayersIcon,
  Cpu,
  Brain,
  AlertTriangle,
  Lock, // Icon for disabled state
} from "lucide-react";

const theme = {
  bg: "bg-slate-950",
  surface: "bg-slate-900",
  card: "bg-slate-800",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  accent: "sky", // Main accent for UI elements
  accentSecondary: "emerald", // For completed steps, positive feedback
  accentTertiary: "violet", // For Output layer button
  accentWarning: "amber", // For warnings
  inputBg: "bg-slate-700",
  inputBorder: "border-slate-600",
  inputFocusBorder: "focus:border-sky-500",
  disabledBg: "bg-slate-700/50", // For disabled inputs
  disabledBorder: "border-slate-600/50",
  disabledText: "text-slate-500",
};

// Reusable FloatInput (self-contained)
function FloatInput({ label, children, id, value, disabled = false }) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== "";

  const activeColor = `rgb(var(--color-${theme.accent}-rgb, 14 165 233))`; // Default to sky
  const inactiveColor = "rgb(100 116 139)"; // slate-400

  return (
    <div className={`relative flex flex-col ${disabled ? "opacity-70" : ""}`}>
      <motion.label
        htmlFor={id}
        animate={isFocused || hasValue ? "active" : "inactive"}
        variants={{
          inactive: {
            y: "0.0rem",
            scale: 1,
            color: inactiveColor,
            x: "0.75rem",
          }, // Adjusted y to align with Tailwind form defaults
          active: {
            y: "-0.65rem", // Moves up
            scale: 0.8, // Scales down
            color: activeColor,
            backgroundColor:
              theme.bg === "bg-slate-950" ? "rgb(2,6,23)" : "rgb(15,23,42)", // Match sidebar bg
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
            x: "0.5rem",
          },
        }}
        initial={hasValue ? "active" : "inactive"}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 25,
          duration: 0.1,
        }}
        className={`absolute left-0 top-3.5 text-sm pointer-events-none origin-top-left z-10`}
      >
        {label}
      </motion.label>
      {React.cloneElement(children, {
        onFocus: () => !disabled && setIsFocused(true),
        onBlur: () => !disabled && setIsFocused(false),
        id: id,
        disabled: disabled, // Pass disabled to the actual input
        className: `${children.props.className || ""} pt-4 pb-2.5 px-3.5 h-12`, // Ensure consistent height and padding
      })}
    </div>
  );
}

const MAX_HIDDEN_LAYERS = 5;
const MAX_VISIBLE_CIRCLES = 7;
const CIRCLE_SIZE = 18; // Slightly smaller
const CIRCLE_MARGIN = 3;
const MAX_BOX_HEIGHT = 280; // Adjusted
const MIN_BOX_HEIGHT = 70; // Adjusted
const MAX_PARAMETERS = 30000;

const nextLayerType = (layers) => {
  const hasInput = layers.some((l) => l.type === "input");
  const hasOutput = layers.some((l) => l.type === "output");
  if (!hasInput) return "input";
  // Allow multiple hidden layers before output is required
  if (
    layers.filter((l) => l.type === "hidden").length < MAX_HIDDEN_LAYERS &&
    !hasOutput
  )
    return "hidden";
  if (!hasOutput) return "output"; // If max hidden layers reached, force output or if user wants it
  return null; // All required layers deployed (input, at least one hidden (implicitly before output), output)
};

const calculateLayerParameters = (inputSize, outputSize) =>
  inputSize * outputSize + outputSize;

const calculateTotalParameters = (currentLayers) => {
  if (!currentLayers || currentLayers.length < 1) return 0;
  // If only an input layer exists, params are just its neurons (though not trainable params)
  if (currentLayers.length === 1 && currentLayers[0]?.type === "input")
    return parseInt(currentLayers[0].neurons) || 0;
  if (currentLayers.length < 2) return 0; // Not enough layers to calculate trainable params

  let totalParams = 0;
  for (let i = 0; i < currentLayers.length - 1; i++) {
    const inputNeurons = parseInt(currentLayers[i].neurons);
    const outputNeurons = parseInt(currentLayers[i + 1].neurons);
    if (
      !isNaN(inputNeurons) &&
      !isNaN(outputNeurons) &&
      inputNeurons > 0 &&
      outputNeurons > 0
    ) {
      totalParams += calculateLayerParameters(inputNeurons, outputNeurons);
    }
  }
  return totalParams;
};

export default function ArchitecturePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialIsPresetMode = location.state?.isPresetMode || false;
  const initialPresetData = location.state?.presetData || null;

  const [isPresetMode, setIsPresetMode] = useState(initialIsPresetMode);
  const [layers, setLayers] = useState(() => initialPresetData?.layers || []);
  const [currentStep, setCurrentStep] = useState(1);
  const [neuronCount, setNeuronCount] = useState("");

  const optimizerMap = { SGD: 1, RMSProp: 2, Adam: 3 };
  const weightInitMap = { Random: 1, Xavier: 2, He: 3 };

  const [trainSettings, setTrainSettings] = useState(
    () =>
      initialPresetData?.settings || {
        mode_id: 1,
        learningRate: 0.001,
        epochs: 100,
        batchSize: 32,
        useDropout: false,
        dropout: 0.5,
        weightInit: weightInitMap.Xavier,
        optimizer: optimizerMap.Adam,
        useLrScheduler: false,
      }
  );

  const [payload, setPayload] = useState(
    () =>
      initialPresetData?.payload || {
        data: "",
        labels: "",
        saveAfter: false,
        filename: "",
      }
  );

  const [infoBadge, setInfoBadge] = useState({
    text: "",
    visible: false,
    type: "info",
  });

  useEffect(() => {
    if (!location.state && currentStep === 1) {
      console.warn(
        "No build mode or preset selected, redirecting to mode selection."
      );
      navigate("/build/mode-selection", { replace: true });
    }
    if (initialPresetData && currentStep === 1 && layers.length > 0) {
      showBadge(
        `Loaded preset: ${initialPresetData.name}. Configuration is locked.`,
        "info",
        4500
      );
    }
  }, [location.state, navigate, initialPresetData, currentStep, layers]);

  const showBadge = (text, type = "info", duration = 2500) => {
    setInfoBadge({ text, visible: true, type });
    setTimeout(
      () => setInfoBadge((prev) => ({ ...prev, visible: false })),
      duration
    );
  };

  const totalParams = calculateTotalParameters(layers);

  const deployLayer = (type) => {
    if (isPresetMode) {
      showBadge("Preset loaded. Layer modification is disabled.", "warning");
      return;
    }
    const numNeurons = parseInt(neuronCount);
    const isFirstHidden =
      type === "hidden" && !layers.find((l) => l.type === "hidden");

    if (type === "input" || type === "output" || isFirstHidden) {
      if (
        neuronCount === "" ||
        isNaN(numNeurons) ||
        numNeurons < 1 ||
        numNeurons > 256
      ) {
        showBadge(
          "Input/Output/First Hidden Layer neurons: 1-256 required.",
          "warning"
        );
        return;
      }
    }

    if (
      type === "output" &&
      inputLayer &&
      hiddenLayers.length === 0 &&
      !isPresetMode
    ) {
      // check !isPresetMode
      showBadge(
        "Custom Build: Add at least one hidden layer before the output layer.",
        "warning",
        3500
      );
      return;
    }

    const neuronsForNewLayer =
      type === "hidden" &&
      !isFirstHidden &&
      layers.find((l) => l.type === "hidden")
        ? parseInt(layers.find((l) => l.type === "hidden").neurons) // Copy size of first hidden for subsequent hidden
        : numNeurons;

    const potentialNewLayer = {
      id: uuidv4(),
      type,
      neurons: neuronsForNewLayer,
    };
    const potentialLayers = [...layers, potentialNewLayer];
    const potentialParams = calculateTotalParameters(potentialLayers);

    if (potentialParams > MAX_PARAMETERS) {
      showBadge(
        `Est. Params: ${potentialParams.toLocaleString()} (Max: ${MAX_PARAMETERS.toLocaleString()}). Reduce layer sizes or count.`,
        "warning",
        4500
      );
      return;
    }

    if (type === "hidden" && hiddenLayers.length >= MAX_HIDDEN_LAYERS) {
      showBadge(
        `Max ${MAX_HIDDEN_LAYERS} hidden layers allowed for custom builds.`,
        "warning"
      );
      return;
    }

    // Actual layer deployment
    let newLayerMessage = "";
    if (type === "hidden") {
      if (isFirstHidden) {
        setLayers((prev) => [
          ...prev,
          { id: uuidv4(), type: "hidden", neurons: numNeurons },
        ]);
        newLayerMessage = `Hidden Layer: ${numNeurons} neurons`;
      } else {
        const firstHiddenNeurons = parseInt(
          layers.find((l) => l.type === "hidden").neurons
        );
        setLayers((prev) => [
          ...prev,
          { id: uuidv4(), type: "hidden", neurons: firstHiddenNeurons },
        ]);
        newLayerMessage = `Hidden Layer: ${firstHiddenNeurons} neurons (copied from first hidden)`;
      }
    } else {
      setLayers((prev) => [
        ...prev,
        { id: uuidv4(), type, neurons: numNeurons },
      ]);
      newLayerMessage = `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } Layer: ${numNeurons} neurons`;
    }
    showBadge(newLayerMessage);
    if (type === "input" || type === "output" || isFirstHidden)
      setNeuronCount("");
  };

  const currentLayerStep = (() => {
    const nt = nextLayerType(layers);
    if (nt === "input") return 1;
    if (nt === "hidden") return 2;
    if (nt === "output") return 3;
    return 4; // All layers deployed or max hidden reached
  })();

  const undo = () => {
    if (isPresetMode) {
      showBadge("Preset loaded. Layer modification is disabled.", "warning");
      return;
    }
    if (layers.length > 0) {
      const removedLayer = layers[layers.length - 1];
      setLayers((prev) => prev.slice(0, -1));
      showBadge(
        `Removed ${removedLayer.type} layer: ${removedLayer.neurons} neurons`
      );
    }
  };
  const reset = () => {
    if (isPresetMode) {
      showBadge(
        "Preset loaded. To start a custom build, please go back and select 'Custom Build'.",
        "info",
        4500
      );
      return;
    }
    setLayers([]);
    setNeuronCount("");
    showBadge("Architecture Reset");
  };

  const inputLayer = layers.find((l) => l.type === "input");
  const hiddenLayers = layers.filter((l) => l.type === "hidden");
  const outputLayer = layers.find((l) => l.type === "output");

  const layerCardVariants = {
    /* ... (same) ... */ initial: { opacity: 0, x: -40, scale: 0.85 },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 280, damping: 22, delay: 0.1 },
    },
    exit: {
      opacity: 0,
      x: 40,
      scale: 0.85,
      transition: { duration: 0.25, ease: "anticipate" },
    },
  };
  const visualizerContainerVariants = {
    /* ... (same) ... */ hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const handleSettingsSave = useCallback(
    (settingsFromChild) => {
      if (!isPresetMode) setTrainSettings(settingsFromChild);
    },
    [isPresetMode]
  );

  const handlePayloadSave = useCallback(
    (payloadFromChild) => {
      if (!isPresetMode) setPayload(payloadFromChild);
    },
    [isPresetMode]
  );

  const canProceedToSettings =
    outputLayer || (isPresetMode && layers.length > 0);

  return (
    <div
      className={`${theme.bg} ${theme.textPrimary} flex flex-col h-screen overflow-hidden`}
    >
      <ProgressBar currentStep={currentStep} totalSteps={4} />

      <AnimatePresence>
        {infoBadge.visible && (
          <motion.div /* InfoBadge (same as before) */
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className={`fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2
                        ${
                          infoBadge.type === "warning"
                            ? `bg-${theme.accentWarning}-500/20 border border-${theme.accentWarning}-500 text-${theme.accentWarning}-200`
                            : `${theme.card} border border-${theme.accent}-500/50 text-${theme.textPrimary}`
                        }`}
          >
            {infoBadge.type === "warning" && (
              <AlertTriangle
                size={16}
                className={`text-${theme.accentWarning}-400`}
              />
            )}
            {infoBadge.text}
          </motion.div>
        )}
      </AnimatePresence>

      {currentStep === 1 && (
        <div className="w-full relative flex flex-1 overflow-hidden">
          {/* Sidebar for Layer Configuration */}
          <motion.div
            key="architecture-sidebar" // Key for AnimatePresence if this panel animates in/out
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className={`w-72 md:w-80 border-r ${theme.inputBorder} flex flex-col ${theme.surface} shadow-2xl z-10`}
          >
            <div className="flex-grow overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600">
              {/* Step Indicators */}
              <div className="flex flex-col gap-3">
                {[
                  { step: 1, label: "Input Layer", icon: Cpu },
                  { step: 2, label: "Hidden Layer(s)", icon: Brain },
                  { step: 3, label: "Output Layer", icon: Cpu },
                ].map(({ step, label, icon: Icon }) => {
                  const isCurrent = step === currentLayerStep;
                  const isCompleted =
                    (step === 1 && inputLayer) ||
                    (step === 2 &&
                      inputLayer &&
                      (hiddenLayers.length > 0 ||
                        (outputLayer && hiddenLayers.length === 0) ||
                        isPresetMode)) || // Simpler condition for preset
                    (step === 3 && outputLayer);
                  return (
                    <motion.div
                      key={step}
                      className={`flex items-center gap-3 px-2.5 py-2 rounded-md transition-all duration-200 ${
                        isCurrent
                          ? `${theme.accent}-500/20 border border-${theme.accent}-500`
                          : isCompleted
                          ? `${theme.accentSecondary}-500/15 border border-${theme.accentSecondary}-500/30`
                          : `${theme.card} border border-slate-700`
                      }`}
                      initial={{ opacity: 0.7, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: step * 0.05 }}
                    >
                      {" "}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isCurrent
                            ? `bg-${theme.accent}-500 text-white`
                            : isCompleted
                            ? `bg-${theme.accentSecondary}-500 text-white`
                            : `bg-slate-700 text-slate-300`
                        }`}
                      >
                        {" "}
                        {isCompleted && !isCurrent ? (
                          <CheckCircle size={14} />
                        ) : (
                          step
                        )}{" "}
                      </div>{" "}
                      <span
                        className={`text-sm font-medium ${
                          isCurrent
                            ? theme.textPrimary
                            : isCompleted
                            ? `${theme.accentSecondary}-300`
                            : theme.textMuted
                        }`}
                      >
                        {" "}
                        {label}{" "}
                      </span>{" "}
                      {isCurrent && (
                        <Icon
                          size={18}
                          className={`ml-auto text-${theme.accent}-400 animate-pulse`}
                        />
                      )}{" "}
                    </motion.div>
                  );
                })}
              </div>

              {/* Neuron Count Input (Disabled in preset mode or if not applicable for current layer type) */}
              {(nextLayerType(layers) === "input" ||
                nextLayerType(layers) === "output" ||
                (nextLayerType(layers) === "hidden" &&
                  hiddenLayers.length === 0)) && (
                <FloatInput
                  label="Neurons (1-256)"
                  id="neuron-count"
                  value={neuronCount}
                  disabled={isPresetMode}
                >
                  <input
                    type="number"
                    step={1}
                    min={1}
                    max={256}
                    value={neuronCount}
                    disabled={isPresetMode}
                    onChange={(e) => {
                      if (isPresetMode) return;
                      const val = e.target.value;
                      if (val === "") {
                        setNeuronCount("");
                      } else {
                        const numVal = parseInt(val);
                        if (!isNaN(numVal)) {
                          if (numVal >= 1 && numVal <= 256)
                            setNeuronCount(numVal.toString());
                          else if (numVal > 256) setNeuronCount("256");
                          else if (numVal < 1) setNeuronCount("1");
                        }
                      }
                    }}
                    className={`border px-3 py-2 rounded-lg w-full ${
                      theme.inputBg
                    } ${theme.inputBorder} ${theme.textPrimary} ${
                      theme.inputFocusBorder
                    } focus:ring-1 focus:ring-${
                      theme.accent
                    }-500 outline-none transition-colors text-sm ${
                      isPresetMode
                        ? `${theme.disabledBg} ${theme.disabledBorder} ${theme.disabledText} cursor-not-allowed`
                        : ""
                    }`}
                  />
                </FloatInput>
              )}

              {/* Deploy Layer Buttons */}
              <div className="flex flex-col gap-2">
                {[
                  {
                    type: "input",
                    label: "Input Layer",
                    condition: !inputLayer,
                    accent: theme.accent,
                    IconEl: PlusCircle,
                  },
                  {
                    type: "hidden",
                    label: "Hidden Layer",
                    condition:
                      !outputLayer &&
                      hiddenLayers.length < MAX_HIDDEN_LAYERS &&
                      inputLayer,
                    accent: theme.accentSecondary,
                    IconEl: PlusCircle,
                  },
                  {
                    type: "output",
                    label: "Output Layer",
                    condition:
                      !outputLayer &&
                      inputLayer &&
                      (hiddenLayers.length >= 0 || isPresetMode),
                    accent: theme.accentTertiary,
                    IconEl: PlusCircle,
                  }, // Allow output after input if preset
                ].map(
                  (btn) =>
                    btn.condition && (
                      <motion.button
                        key={btn.type}
                        disabled={isPresetMode}
                        whileHover={
                          !isPresetMode
                            ? {
                                y: -3,
                                boxShadow: `0 8px 20px rgba(var(--color-${btn.accent}-rgb, 14 165 233), 0.2)`,
                              }
                            : {}
                        }
                        whileTap={!isPresetMode ? { scale: 0.98 } : {}}
                        onClick={() => deployLayer(btn.type)}
                        className={`text-white rounded-lg py-2.5 font-semibold shadow-md hover:brightness-110 transition-all duration-100 flex items-center justify-center gap-2 text-sm
                                    bg-gradient-to-r from-${
                                      btn.accent
                                    }-600 to-${btn.accent}-500
                                    ${
                                      isPresetMode
                                        ? "opacity-50 cursor-not-allowed !bg-slate-600 !from-slate-600 !to-slate-500"
                                        : ""
                                    }`}
                      >
                        {isPresetMode ? (
                          <Lock size={14} />
                        ) : (
                          <btn.IconEl size={16} />
                        )}
                        <span>Deploy {btn.label}</span>
                      </motion.button>
                    )
                )}
              </div>
              {/* Architecture Summary & Control Buttons */}
              <div
                className={`bg-gradient-to-br from-${theme.card} to-slate-800/70 rounded-xl shadow-lg px-4 py-2.5 w-full text-sm border border-slate-700/70`}
              >
                {" "}
                <div
                  className={`flex items-center gap-2 font-semibold mb-3 text-${theme.accent}-300`}
                >
                  <Info size={16} /> Architecture Summary
                </div>{" "}
                {[
                  { label: "Input Neurons", value: inputLayer?.neurons },
                  { label: "Hidden Size", value: hiddenLayers[0]?.neurons },
                  { label: "Hidden Layers", value: hiddenLayers.length },
                  { label: "Output Neurons", value: outputLayer?.neurons },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between py-1 border-b border-slate-700/50 last:border-b-0 text-xs"
                  >
                    {" "}
                    <span className={theme.textMuted}>{item.label}</span>{" "}
                    <span className={theme.textPrimary}>
                      {item.value ?? "-"}
                    </span>{" "}
                  </div>
                ))}{" "}
                <div
                  className={`flex justify-between py-1.5 mt-2 pt-2 border-t border-slate-600/70 items-center`}
                >
                  {" "}
                  <span className={`${theme.textMuted} font-medium text-xs`}>
                    Est. Params
                  </span>{" "}
                  <span
                    className={`font-semibold text-xs px-2 py-0.5 rounded-full ${
                      totalParams > MAX_PARAMETERS
                        ? `bg-red-500/20 text-red-300 border border-red-500`
                        : totalParams > MAX_PARAMETERS * 0.8
                        ? `bg-${theme.accentWarning}-500/20 text-${theme.accentWarning}-300 border border-${theme.accentWarning}-500`
                        : `bg-emerald-500/10 text-emerald-300 border border-emerald-500/30`
                    }`}
                  >
                    {" "}
                    {totalParams.toLocaleString()} /{" "}
                    {MAX_PARAMETERS.toLocaleString()}{" "}
                  </span>{" "}
                </div>{" "}
              </div>
            </div>
            <div className="p-3 border-t border-slate-700/50 mt-auto">
              {" "}
              {/* Undo/Reset Controls */}
              <div className="flex gap-3">
                {[
                  {
                    action: undo,
                    label: "Undo Layer",
                    icon: RotateCcw,
                    disabled: !layers.length || isPresetMode,
                  },
                  {
                    action: reset,
                    label: "Reset All",
                    icon: RefreshCcw,
                    disabled: !layers.length || isPresetMode,
                  },
                ].map((btn) => (
                  <motion.button
                    key={btn.label}
                    whileHover={
                      !btn.disabled
                        ? {
                            scale: 1.08,
                            transition: {
                              type: "spring",
                              stiffness: 500,
                              damping: 12,
                            },
                          }
                        : {}
                    }
                    whileTap={!btn.disabled ? { scale: 0.92 } : {}}
                    onClick={btn.action}
                    disabled={btn.disabled}
                    title={btn.label}
                    className={`flex-1 h-9 rounded-lg ${
                      theme.card
                    } border border-slate-600 text-${
                      btn.disabled ? "slate-600" : theme.textMuted
                    } hover:text-${
                      btn.disabled ? "slate-600" : theme.accent
                    }-300 hover:border-${
                      btn.disabled ? "slate-600" : theme.accent
                    }-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md transition-colors duration-150`}
                  >
                    {" "}
                    <btn.icon size={16} />{" "}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
          {/* Layer Visualizer Area */}
          <div
            className={`relative flex-1 flex overflow-x-auto ${theme.surface} p-8 md:p-12 items-center justify-start scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600`}
          >
            <motion.div
              className="flex items-center gap-8 sm:gap-10 md:gap-12"
              variants={visualizerContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {layers.map((layer, idx) => {
                  const circlesVisible = Math.min(
                    parseInt(layer.neurons) || 0,
                    MAX_VISIBLE_CIRCLES
                  );
                  const dynamicHeight = Math.min(
                    Math.max(
                      MIN_BOX_HEIGHT,
                      circlesVisible * (CIRCLE_SIZE + CIRCLE_MARGIN * 2) + 32
                    ),
                    MAX_BOX_HEIGHT
                  );
                  const LayerTypeIcon =
                    layer.type === "input" || layer.type === "output"
                      ? Cpu
                      : Brain;
                  return (
                    <React.Fragment key={layer.id}>
                      {" "}
                      <motion.div
                        variants={layerCardVariants}
                        layout
                        whileHover={
                          !isPresetMode
                            ? {
                                scale: 1.05,
                                y: -4,
                                boxShadow: `0 8px 25px rgba(0,0,0,0.4)`,
                              }
                            : {}
                        }
                        className={`group relative flex flex-col items-center gap-2 rounded-2xl ${
                          theme.card
                        } border border-slate-600 shadow-xl p-4 min-w-[80px] md:min-w-[90px] ${
                          isPresetMode ? "cursor-default" : "cursor-pointer"
                        }`}
                      >
                        {" "}
                        <div
                          className={`absolute -top-9 left-1/2 -translate-x-1/2 ${theme.card} text-xs font-medium px-3 py-1.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 border border-slate-500 whitespace-nowrap`}
                        >
                          {layer.neurons} Neurons
                        </div>{" "}
                        <div
                          className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 ${theme.textMuted} capitalize`}
                        >
                          <LayerTypeIcon
                            size={14}
                            className={`text-${
                              layer.type === "input"
                                ? theme.accent
                                : layer.type === "output"
                                ? theme.accentSecondary
                                : theme.accentTertiary
                            }-400`}
                          />
                          {layer.type}
                        </div>{" "}
                        <div
                          className={`bg-slate-700/50 border border-slate-500/60 rounded-xl flex flex-col items-center overflow-hidden px-2.5 py-2 space-y-1.5`}
                          style={{ height: dynamicHeight }}
                        >
                          {" "}
                          {Array.from({ length: circlesVisible }).map(
                            (_, i) => (
                              <motion.div
                                key={i}
                                className={`bg-slate-400 border border-slate-300/70 rounded-full ${
                                  !isPresetMode
                                    ? `group-hover:bg-${theme.accent}-400 group-hover:border-${theme.accent}-300`
                                    : ""
                                } transition-colors duration-150`}
                                style={{
                                  width: CIRCLE_SIZE,
                                  height: CIRCLE_SIZE,
                                  margin: `${CIRCLE_MARGIN}px 0`,
                                }}
                                initial={{ opacity: 0.4, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: i * 0.03,
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 15,
                                }}
                              />
                            )
                          )}{" "}
                          {layer.neurons > MAX_VISIBLE_CIRCLES && (
                            <span
                              className={`text-sm font-bold ${theme.textMuted} mt-1`}
                            >
                              ⋮
                            </span>
                          )}{" "}
                        </div>{" "}
                      </motion.div>{" "}
                      {idx < layers.length - 1 && (
                        <motion.div
                          initial={{ opacity: 0, scaleX: 0.5 }}
                          animate={{ opacity: 0.7, scaleX: 1 }}
                          transition={{ delay: 0.15 }}
                        >
                          {" "}
                          <ArrowRight
                            size={32}
                            strokeWidth={1.2}
                            className={`text-${theme.accent}-700/80`}
                          />{" "}
                        </motion.div>
                      )}{" "}
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
          {/* Navigation to Next Step Button */}
          {canProceedToSettings && ( // Use the new canProceedToSettings flag
            <motion.button
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: `0 10px 25px rgba(var(--color-accent-rgb, 14 165 233), 0.35)`,
              }}
              whileTap={{ scale: 0.95 }}
              className={`fixed bottom-8 right-8 z-20 px-7 py-3.5 rounded-xl text-sm font-semibold 
                          bg-gradient-to-br from-${theme.accent}-500 to-${theme.accent}-600 ${theme.textPrimary} 
                          hover:from-${theme.accent}-400 hover:to-${theme.accent}-500
                          shadow-2xl transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-1`}
              onClick={() => {
                if (
                  !inputLayer ||
                  !outputLayer ||
                  (hiddenLayers.length === 0 && !isPresetMode)
                ) {
                  // Stricter check for custom build
                  showBadge(
                    "Please complete the basic architecture (Input, at least one Hidden, Output).",
                    "warning",
                    3500
                  );
                  return;
                }
                setCurrentStep(2);
              }}
            >
              Configure Training Settings <ArrowRightCircle size={18} />
            </motion.button>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <SettingsPage
          onBack={() => setCurrentStep(1)}
          onSave={handleSettingsSave}
          onContinue={() => setCurrentStep(3)}
          initialSettings={trainSettings}
          isPresetMode={isPresetMode}
        />
      )}
      {currentStep === 3 && (
        <PayloadPage
          onBack={() => setCurrentStep(2)}
          onSave={handlePayloadSave}
          onContinue={() => setCurrentStep(4)}
          initialPayload={payload}
          isPresetMode={isPresetMode}
        />
      )}
      {currentStep === 4 && (
        <ReviewPage
          layers={layers}
          settings={trainSettings}
          payload={payload}
          onBack={() => setCurrentStep(3)}
          onTrain={() =>
            navigate("/train", {
              state: {
                trainingParams: {
                  layers,
                  ...trainSettings,
                  ...payload,
                  filename:
                    payload.filename ||
                    `${initialPresetData?.name || "custom"}_model.npz`,
                },
              },
            })
          }
          isPresetMode={isPresetMode}
        />
      )}
    </div>
  );
}
