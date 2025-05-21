// src/pages/SettingsPage.jsx
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Info,
  Check,
  ChevronDown,
  XCircle,
  SlidersHorizontal,
  Zap,
  Cog,
  Palette,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (!ScrollTrigger.isRegistered) {
  gsap.registerPlugin(ScrollTrigger);
}

// --- Theme ---
const theme = {
  bg: "bg-slate-950",
  surface: "bg-slate-900",
  card: "bg-slate-800", // Default card background
  cardAlt: "bg-slate-800/70 backdrop-blur-sm", // Alternative with glassmorphism
  inputBg: "bg-slate-700/80",
  inputBorder: "border-slate-600/80",
  inputFocusBorder: "focus:border-sky-400",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  accent: "sky",
  accentSecondary: "emerald", // For "ON" states and completed things
  accentTertiary: "rose", // Another accent
  divider: "border-slate-700",
};

// --- Reusable AnimatedTextLine (for section titles) ---
const AnimatedTextLine = ({ text, className }) => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current.parentElement,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);
  return (
    <span className="block overflow-hidden">
      <span ref={ref} className={`inline-block ${className}`}>
        {text}
      </span>
    </span>
  );
};

// --- Helper Components (Dark Theme Adapted & Enhanced) ---
const StaggeredChild = ({ children, customDelay = 0, className = "" }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 30, filter: "blur(3px)" },
      show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          delay: customDelay,
          type: "spring",
          stiffness: 220,
          damping: 22,
        },
      },
    }}
  >
    {children}
  </motion.div>
);

const InfoButton = ({ onClick, className = "" }) => (
  <motion.button
    type="button"
    onClick={onClick}
    className={`p-1.5 rounded-full text-slate-500 hover:text-${theme.accent}-400 hover:bg-slate-700/50 transition-colors ${className}`}
    whileHover={{ scale: 1.15, rotate: 10 }}
    whileTap={{ scale: 0.9 }}
    title="More Information"
  >
    <Info size={16} />
  </motion.button>
);

const DarkFloatInput = ({
  label,
  children,
  id,
  value,
  wrapperClassName = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== "";

  return (
    <div className={`relative flex flex-col ${wrapperClassName}`}>
      <motion.label
        htmlFor={id}
        animate={isFocused || hasValue ? "active" : "inactive"}
        variants={{
          inactive: { y: 0, scale: 1, color: "rgb(100 116 139)" }, // slate-400
          active: {
            y: -20,
            scale: 0.85,
            color: `rgb(var(--color-${theme.accent}-rgb, 14 165 233))`,
          },
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          duration: 0.1,
        }}
        className="absolute left-3 top-3 text-sm pointer-events-none origin-left z-10 bg-transparent px-0.5" // Ensure bg matches input for clean overlap
      >
        {label}
      </motion.label>
      {React.cloneElement(children, {
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
        id: id,
        className: `${children.props.className} pt-4`, // Add padding-top to input
      })}
    </div>
  );
};

const DarkFlySelect = ({
  options,
  value,
  onChange,
  label,
  id,
  disabled,
  infoClick,
}) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label || label || "Select...";

  return (
    <div
      className={`relative w-full group ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-medium ${theme.textMuted}`}>
          {label}
        </span>
        {infoClick && <InfoButton onClick={infoClick} />}
      </div>
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`w-full px-3.5 py-3 text-left border rounded-lg ${
          theme.inputBg
        } ${theme.inputBorder} ${theme.textPrimary} 
                    hover:border-${theme.accent}-500/70 focus:${
          theme.inputFocusBorder
        } focus:ring-1 focus:ring-${theme.accent}-500 
                    outline-none transition-all duration-200 text-sm flex justify-between items-center ${
                      disabled ? "" : "cursor-pointer"
                    }`}
      >
        <span
          className={
            value !== null && value !== undefined
              ? theme.textPrimary
              : theme.textMuted
          }
        >
          {selectedOption?.label || "Select..."}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && !disabled && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 5, scale: 1 }} // y:5 for slight overlap reveal
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`absolute z-30 mt-1 w-full ${theme.surface} border ${theme.inputBorder} rounded-lg shadow-2xl 
                        overflow-hidden max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600`}
          >
            {options.map((opt) => (
              <motion.li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`px-3.5 py-2.5 text-sm cursor-pointer ${
                  theme.textSecondary
                }
                  ${
                    value === opt.value
                      ? `bg-${theme.accent}-500/25 text-${theme.accent}-300 font-medium`
                      : `hover:bg-slate-700/60 hover:${theme.textPrimary}`
                  }`}
                whileHover={{
                  backgroundColor:
                    "rgba(var(--color-slate-rgb, 51 65 85), 0.7)",
                }} // slate-700 with opacity
              >
                {opt.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const DarkGlowToggle = ({ enabled, setEnabled, label, infoClick }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-medium ${theme.textMuted}`}>
          {label}
        </span>
        {infoClick && <InfoButton onClick={infoClick} />}
      </div>
      <div className="flex items-center gap-3">
        <motion.div
          onClick={() => setEnabled(!enabled)}
          className={`relative w-12 h-6 rounded-full cursor-pointer flex items-center p-1 transition-colors duration-300 ease-in-out
                            ${
                              enabled
                                ? `bg-gradient-to-r from-${theme.accentSecondary}-500 to-${theme.accentSecondary}-600 shadow-md shadow-${theme.accentSecondary}-500/30`
                                : `${theme.surfaceContrast} hover:bg-slate-600`
                            }`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-4 h-4 bg-white rounded-full shadow-lg"
            animate={{ x: enabled ? "1.25rem" : "0.125rem" }} // 1.25rem = 20px (w-12 - w-4 - p-1*2)
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.div>
        <span
          className={`text-xs font-medium ${
            enabled ? `text-${theme.accentSecondary}-300` : theme.textMuted
          }`}
        >
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </div>
    </div>
  );
};

const DarkBasicSlider = ({
  value,
  setValue,
  min,
  max,
  step,
  id,
  label,
  unit = "",
  infoClick,
}) => (
  <div className="w-full">
    <div className="flex items-center justify-between mb-1">
      <label htmlFor={id} className={`text-xs font-medium ${theme.textMuted}`}>
        {label}
      </label>
      {infoClick && <InfoButton onClick={infoClick} />}
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => setValue(parseFloat(e.target.value))}
      id={id}
      className={`w-full h-2.5 rounded-lg appearance-none cursor-pointer ${theme.surfaceContrast} outline-none
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-${theme.accent}-500 
                        [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-${theme.accent}-400 transition-all duration-150
                        [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
                        [&::-moz-range-thumb]:bg-${theme.accent}-500 [&::-moz-range-thumb]:border-none
                        [&::-moz-range-thumb]:hover:bg-${theme.accent}-400`}
    />
    <div className={`text-right text-xs mt-1 ${theme.textMuted}`}>
      Value:{" "}
      <span className={`font-semibold text-${theme.accent}-300`}>
        {value}
        {unit}
      </span>
    </div>
  </div>
);

// Description objects (ensure keys match settingInfoId used in handleInfoClick)
const settingDescriptions = {
  mode: "Determines the activation functions used in the final layer and the loss function for training. Critical for matching the network to the type of problem (e.g., binary vs. multi-class classification).",
  batchSize:
    "Number of training samples processed before the model's weights are updated. Smaller batches offer more frequent updates but can be noisy; larger batches are faster but might generalize less well.",
  epochs:
    "One complete pass through the entire training dataset. More epochs give the model more chances to learn, but too many can lead to overfitting.",
  optimizer:
    "Algorithm used to change the attributes of the neural network such as weights and learning rate to reduce the losses. Adam is often a good default.",
  weightInitializer:
    "Method used to set the initial random weights of the network. Proper initialization can significantly speed up convergence and improve model performance (e.g., Xavier for Tanh/Sigmoid, He for ReLU).",
  dropout:
    "A regularization technique where randomly selected neurons are ignored during training for a single pass. It helps prevent overfitting by making the network more robust.",
  learningRate:
    "Controls how much to change the model in response to the estimated error each time the model weights are updated. Too small: slow convergence. Too large: unstable training.",
  lrScheduler:
    "Dynamically adjusts the learning rate during training. Common strategies include reducing the LR as training progresses (e.g., Cosine Decay) to help fine-tune the model.",
};
const modeDescriptions = {
  /* ... your existing modeDescriptions ... */
};

// --- Main SettingsPage Component ---
export default function SettingsPage({
  onBack,
  onContinue,
  onSave,
  initialSettings = {},
}) {
  const optimizerMap = { SGD: 1, RMSProp: 2, Adam: 3 };
  const weightInitMap = { Random: 1, Xavier: 2, He: 3 };

  const [mode_id, setMode_id] = useState(initialSettings.mode_id ?? 1);
  const [learningRate, setLearningRate] = useState(
    initialSettings.learningRate ?? 0.001
  );
  const [epochs, setEpochs] = useState(initialSettings.epochs ?? 100);
  const [batchSize, setBatchSize] = useState(initialSettings.batchSize ?? 32);
  const [useDropout, setUseDropout] = useState(
    initialSettings.useDropout ?? false
  );
  const [dropout, setDropout] = useState(initialSettings.dropout ?? 0.5);
  const [weightInit, setWeightInit] = useState(
    initialSettings.weightInit ?? weightInitMap.Xavier
  );
  const [optimizer, setOptimizer] = useState(
    initialSettings.optimizer ?? optimizerMap.Adam
  );
  const [useLrScheduler, setUseLrScheduler] = useState(
    initialSettings.useLrScheduler ?? false
  );

  const [infoModalContent, setInfoModalContent] = useState(null);

  useEffect(() => {
    if (onSave) {
      onSave({
        mode_id,
        learningRate,
        epochs,
        batchSize,
        useDropout,
        dropout: useDropout ? dropout : 0,
        weightInit,
        optimizer,
        useLrScheduler,
      });
    }
  }, [
    mode_id,
    learningRate,
    epochs,
    batchSize,
    useDropout,
    dropout,
    weightInit,
    optimizer,
    useLrScheduler,
    onSave,
  ]);

  const handleInfoClick = (settingKey) => {
    let title, items;
    if (settingKey === "mode_info") {
      // Special key for general mode info button
      const currentModeOption = modeOptions.find(
        (opt) => opt.value === mode_id
      );
      title = currentModeOption
        ? `Mode ${currentModeOption.label} Details`
        : "Mode Details";
      items = modeDescriptions[mode_id] || [
        "No specific details for this mode yet.",
      ];
    } else if (settingDescriptions[settingKey]) {
      title =
        settingKey
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()) + " Explained";
      items = Array.isArray(settingDescriptions[settingKey])
        ? settingDescriptions[settingKey]
        : [settingDescriptions[settingKey]];
    } else {
      title = "Information";
      items = ["Details for this setting are not yet available."];
    }
    setInfoModalContent({ title, items });
  };

  const modeOptions = [
    { value: 1, label: "1 - Sigmoid + MSE" },
    { value: 2, label: "2 - Sigmoid + BCE" },
    { value: 3, label: "3 - Tanh + MSE" },
    { value: 4, label: "4 - ReLU, Sigmoid + BCE" },
    { value: 5, label: "5 - ReLU, Softmax + Cross-Entropy" },
  ];
  const batchSizeOptions = [1, 16, 32, 64].map((v) => ({
    value: v,
    label: String(v),
  }));
  const optimizerOptions = Object.entries(optimizerMap).map(
    ([label, value]) => ({ label, value })
  );
  const weightInitOptions = Object.entries(weightInitMap).map(
    ([label, value]) => ({ label, value })
  );

  // Section Animation Variants
  const pageVariants = {
    initial: { opacity: 0, filter: "blur(5px)" },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: "circOut" },
    },
    exit: {
      opacity: 0,
      filter: "blur(5px)",
      transition: { duration: 0.3, ease: "circIn" },
    },
  };
  const sectionContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <motion.div
      className={`relative w-full min-h-[calc(100vh-80px)] ${theme.bg} ${theme.textSecondary} flex flex-col scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div
        className={`sticky top-0 ${theme.bg} bg-opacity-80 backdrop-blur-md z-20 px-6 py-3.5 border-b ${theme.divider} flex items-center justify-between shadow-sm`}
      >
        <motion.button
          onClick={onBack}
          className={`flex items-center gap-1.5 text-sm ${theme.textMuted} hover:${theme.textPrimary} transition-colors`}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeftCircle size={18} /> Back to Architecture
        </motion.button>
        <h1
          className={`text-lg font-semibold ${theme.textPrimary} absolute left-1/2 -translate-x-1/2`}
        >
          Configure Training Settings
        </h1>
        <div className="w-40"></div> {/* Spacer to balance title */}
      </div>

      <motion.div
        className="flex-grow max-w-7xl w-full mx-auto grid lg:grid-cols-3 gap-6 p-6 sm:p-8 items-start" // items-start for varying card heights
        variants={sectionContainerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Column 1: Mode & General Training */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {" "}
          {/* Explicit column span */}
          <StaggeredChild
            className={`p-6 rounded-xl ${theme.cardAlt} border z-40 ${theme.divider} shadow-xl h-full`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-lg font-semibold ${theme.textPrimary} flex items-center gap-2`}
              >
                <Palette size={20} className={`text-${theme.accent}-400`} />
                Mode
              </h2>
              <InfoButton onClick={() => handleInfoClick("mode_info")} />
            </div>
            <DarkFlySelect
              id="mode_id_select"
              label="Activation & Loss"
              options={modeOptions}
              value={mode_id}
              onChange={setMode_id}
            />
          </StaggeredChild>
          <StaggeredChild
            className={`p-6 rounded-xl ${theme.cardAlt} border ${theme.divider} shadow-xl space-y-6 h-full`}
          >
            <div className="flex items-center justify-between">
              <h2
                className={`text-lg font-semibold ${theme.textPrimary} flex items-center gap-2`}
              >
                <Cog size={20} className={`text-${theme.accent}-400`} />
                General Training
              </h2>
              {/* No general info button here, specific ones below */}
            </div>
            <DarkFlySelect
              id="batch_size_select"
              label="Batch Size"
              options={batchSizeOptions}
              value={batchSize}
              onChange={setBatchSize}
              infoClick={() => handleInfoClick("batchSize")}
              className="z-40"
            />
            <DarkFloatInput
              label={`Epochs`}
              id="epochs_input"
              value={epochs}
              wrapperClassName="mt-1"
            >
              <input
                type="number"
                min={1}
                max={50000}
                value={epochs}
                onChange={(e) =>
                  setEpochs(Math.max(1, parseInt(e.target.value)))
                }
                className={`w-full border rounded-lg px-3 py-3 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} hover:border-${theme.accent}-500/70 focus:${theme.inputFocusBorder} focus:ring-1 focus:ring-${theme.accent}-500 outline-none transition-colors text-sm`}
              />
            </DarkFloatInput>
          </StaggeredChild>
        </div>

        {/* Column 2: Algorithms & Dropout */}
        <StaggeredChild
          className={`p-6 rounded-xl ${theme.cardAlt} border ${theme.divider} shadow-xl h-full flex flex-col space-y-6 lg:col-span-1`}
        >
          <h2
            className={`text-lg font-semibold ${theme.textPrimary} flex items-center gap-2`}
          >
            <SlidersHorizontal
              size={20}
              className={`text-${theme.accent}-400`}
            />
            Algorithms & Regularization
          </h2>
          <DarkFlySelect
            id="optimizer_select"
            label="Optimizer Algorithm"
            options={optimizerOptions}
            value={optimizer}
            onChange={setOptimizer}
            infoClick={() => handleInfoClick("optimizer")}
          />
          <DarkFlySelect
            id="weight_init_select"
            label="Weight Initializer"
            options={weightInitOptions}
            value={weightInit}
            onChange={setWeightInit}
            infoClick={() => handleInfoClick("weightInitializer")}
          />
          <DarkGlowToggle
            enabled={useDropout}
            setEnabled={setUseDropout}
            label="Dropout Regularization"
            infoClick={() => handleInfoClick("dropout")}
          />
          <AnimatePresence>
            {useDropout && (
              <motion.div
                key="dropout_slider_container"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: "0.75rem" }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <DarkBasicSlider
                  id="dropout_slider"
                  label="Dropout Rate"
                  unit=""
                  value={dropout}
                  setValue={setDropout}
                  min={0.05}
                  max={0.8}
                  step={0.01}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </StaggeredChild>

        {/* Column 3: Learning Rate */}
        <StaggeredChild
          className={`p-6 rounded-xl ${theme.cardAlt} border ${theme.divider} shadow-xl h-full flex flex-col space-y-6 lg:col-span-1`}
        >
          <h2
            className={`text-lg font-semibold ${theme.textPrimary} flex items-center gap-2`}
          >
            <Zap size={20} className={`text-${theme.accent}-400`} />
            Learning Rate
          </h2>
          <DarkFloatInput
            label={`Rate Value`}
            id="lr_input"
            value={learningRate.toExponential(1)}
            wrapperClassName="mt-1"
          >
            <input
              type="number"
              step="0.00001"
              min="0.000001"
              max="0.1"
              value={learningRate}
              onChange={(e) =>
                setLearningRate(Math.max(0.000001, parseFloat(e.target.value)))
              }
              className={`w-full border rounded-lg px-3 py-3 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} hover:border-${theme.accent}-500/70 focus:${theme.inputFocusBorder} focus:ring-1 focus:ring-${theme.accent}-500 outline-none transition-colors text-sm`}
            />
          </DarkFloatInput>
          <InfoButton
            onClick={() => handleInfoClick("learningRate")}
            className="self-start -mt-4"
          />

          <DarkGlowToggle
            enabled={useLrScheduler}
            setEnabled={setUseLrScheduler}
            label="Use LR Scheduler (Cosine Decay)"
            infoClick={() => handleInfoClick("lrScheduler")}
          />
        </StaggeredChild>
      </motion.div>

      {/* Info Modal (Styled for dark theme) */}
      <AnimatePresence>
        {infoModalContent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" // Darker backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setInfoModalContent(null)}
          >
            <motion.div
              className={`relative ${theme.surface} w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-2xl shadow-2xl border ${theme.divider} scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setInfoModalContent(null)}
                className={`absolute top-4 right-4 p-1.5 rounded-full text-slate-500 hover:text-slate-100 hover:bg-slate-700 transition-colors`}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.85 }}
              >
                <XCircle size={22} />
              </motion.button>
              <h3
                className={`text-xl sm:text-2xl font-semibold mb-5 ${theme.textPrimary} border-b ${theme.divider} pb-3`}
              >
                {infoModalContent.title}
              </h3>
              <ul
                className={`list-disc list-outside space-y-2 text-sm sm:text-base ${theme.textSecondary} leading-relaxed pl-5`}
              >
                {infoModalContent.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div
        className={`sticky bottom-0 w-full px-6 py-3.5 ${theme.bg} border-t ${theme.divider} flex justify-end gap-4 z-20 mt-auto shadow-top-lg`}
      >
        {" "}
        {/* Added shadow-top-lg (custom utility) */}
        <motion.button
          onClick={onBack}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium ${theme.card} border ${theme.inputBorder} ${theme.textSecondary} hover:${theme.textPrimary} hover:border-${theme.accent}-500/70 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-${theme.accent}-500/70 focus:ring-offset-2 focus:ring-offset-slate-900`}
          whileHover={{
            y: -2,
            scale: 1.03,
            transition: { type: "spring", stiffness: 300, damping: 15 },
          }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeftCircle size={18} /> Back
        </motion.button>
        <motion.button
          onClick={onContinue}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-${theme.accent}-500 to-${theme.accent}-600 ${theme.textPrimary} hover:from-${theme.accent}-400 hover:to-${theme.accent}-500 shadow-lg hover:shadow-${theme.accent}-500/40 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-${theme.accent}-400 focus:ring-offset-2 focus:ring-offset-slate-900`}
          whileHover={{
            y: -2,
            scale: 1.03,
            transition: { type: "spring", stiffness: 300, damping: 15 },
          }}
          whileTap={{ scale: 0.97 }}
        >
          Continue to Data <ArrowRightCircle size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}
