// src/pages/SettingsPage.jsx
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Info,
  // Check,
  ChevronDown,
  XCircle,
  SlidersHorizontal,
  Zap,
  Cog,
  Palette,
  Lock,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (!ScrollTrigger.isRegistered && typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const theme = {
  bg: "bg-slate-950",
  surface: "bg-slate-900",
  card: "bg-slate-800",
  cardAlt: "bg-slate-800/70 backdrop-blur-sm",
  inputBg: "bg-slate-700/80",
  inputBorder: "border-slate-600/80",
  inputFocusBorder: "focus:border-sky-400",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  accent: "sky",
  accentRGB: "14, 165, 233", // Added for DarkFloatInputBase label
  accentSecondary: "emerald",
  accentTertiary: "rose",
  divider: "border-slate-700",
  disabledBg: "bg-slate-700/40",
  disabledBorder: "border-slate-600/40",
  disabledText: "text-slate-500 cursor-not-allowed",
};

// --- COPIED/ADAPTED Custom Input Components from PayloadPage.jsx ---
// In a real app, these would be in a common/components directory
const DarkFloatInputBase = ({
  label,
  id,
  value,
  children,
  disabled = false,
  wrapperClassName = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== "";
  // Card background for label cutout: using theme.cardAlt's effective color.
  // This assumes cardAlt's bg-slate-800/70 over bg-slate-950.
  // For perfect cutout, label bg must precisely match parent card's actual rendered bg.
  const labelBgColor = "rgb(24 32 47 / 0.7)"; // Approximation: (slate-800 with 0.7 opacity over slate-950 (2,6,23)) - adjust if card bg is different
  // A solid color from theme.card might be safer: e.g. "rgb(30 41 59)" (slate-800)

  return (
    <div
      className={`relative flex flex-col ${wrapperClassName} ${
        disabled ? "opacity-70" : ""
      }`}
    >
      <motion.label
        htmlFor={id}
        animate={isFocused || hasValue ? "active" : "inactive"}
        variants={{
          inactive: {
            y: "0.9rem",
            scale: 1,
            color: "rgb(100 116 139)",
            x: "0.8rem",
          }, // slate-400
          active: {
            y: "-0.5rem",
            scale: 0.8,
            color: `rgba(${theme.accentRGB}, 1)`,
            x: "0.6rem",
            backgroundColor: labelBgColor,
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
          },
        }}
        initial={hasValue ? "active" : "inactive"}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 25,
          duration: 0.1,
        }}
        className={`absolute left-0 top-0 text-sm pointer-events-none origin-top-left z-10`}
      >
        {label}
      </motion.label>
      {React.cloneElement(children, {
        onFocus: () => !disabled && setIsFocused(true),
        onBlur: () => !disabled && setIsFocused(false),
        id: id,
        disabled: disabled,
        className: `${children.props.className || ""} pt-5 pb-2.5 px-3.5 h-12 ${
          disabled ? theme.disabledText : ""
        }`,
      })}
    </div>
  );
};

const DarkFloatInput = ({
  label,
  id,
  value,
  setValue,
  type = "text",
  className = "",
  disabled = false,
  inputClassName = "",
  ...props
}) => {
  return (
    <DarkFloatInputBase
      label={label}
      id={id}
      value={value}
      wrapperClassName={className}
      disabled={disabled}
    >
      <input
        type={type}
        value={value}
        onChange={(e) => !disabled && setValue(e.target.value)}
        placeholder="" // Keep placeholder empty for float label effect
        disabled={disabled}
        {...props} // Pass down other props like min, max, step
        className={`peer block w-full border rounded-lg 
                    ${
                      disabled
                        ? `${theme.disabledBg} ${theme.disabledBorder} ${theme.disabledText}`
                        : `${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} hover:border-${theme.accent}-500/50 focus:${theme.inputFocusBorder} focus:ring-1 focus:ring-${theme.accent}-400`
                    }
                    outline-none transition-colors text-sm ${inputClassName}`}
      />
    </DarkFloatInputBase>
  );
};
// --- END OF COPIED INPUT COMPONENTS ---

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
    {" "}
    {children}{" "}
  </motion.div>
);
const InfoButton = ({ onClick, className = "", disabled = false }) => (
  <motion.button
    type="button"
    onClick={!disabled ? onClick : undefined}
    className={`p-1.5 rounded-full ${
      disabled
        ? "text-slate-600 cursor-not-allowed"
        : `text-slate-500 hover:text-${theme.accent}-400 hover:bg-slate-700/50`
    } transition-colors ${className}`}
    whileHover={!disabled ? { scale: 1.15, rotate: 10 } : {}}
    whileTap={!disabled ? { scale: 0.9 } : {}}
    title={disabled ? "Info unavailable in preset mode" : "More Information"}
    disabled={disabled}
  >
    {" "}
    <Info size={16} />{" "}
  </motion.button>
);
const DarkFlySelect = ({
  options,
  value,
  onChange,
  label,
  id,
  disabled = false,
  infoClick,
}) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);
  return (
    <div
      className={`relative w-full group ${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {" "}
      <div className="flex items-center justify-between mb-1">
        {" "}
        <span
          className={`text-xs font-medium ${
            disabled ? theme.disabledText : theme.textMuted
          }`}
        >
          {label}
        </span>{" "}
        {infoClick && <InfoButton onClick={infoClick} disabled={disabled} />}{" "}
      </div>{" "}
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`w-full px-3.5 py-3 text-left border rounded-lg ${
          disabled
            ? `${theme.disabledBg} ${theme.disabledBorder} ${theme.disabledText}`
            : `${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} hover:border-${theme.accent}-500/70 focus:${theme.inputFocusBorder} focus:ring-1 focus:ring-${theme.accent}-500`
        } outline-none transition-all duration-200 text-sm flex justify-between items-center ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {" "}
        <span
          className={
            value !== null && value !== undefined && !disabled
              ? theme.textPrimary
              : theme.disabledText
          }
        >
          {" "}
          {selectedOption?.label || "Select..."}{" "}
        </span>{" "}
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } ${disabled ? "opacity-50" : ""}`}
        />{" "}
      </button>{" "}
      <AnimatePresence>
        {" "}
        {open && !disabled && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`absolute z-30 mt-1 w-full ${theme.surface} border ${theme.inputBorder} rounded-lg shadow-2xl overflow-hidden max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600`}
          >
            {" "}
            {options.map((opt) => (
              <motion.li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`px-3.5 py-2.5 text-sm cursor-pointer ${
                  value === opt.value
                    ? `bg-${theme.accent}-500/25 text-${theme.accent}-300 font-medium`
                    : `${theme.textSecondary} hover:bg-slate-700/60 hover:${theme.textPrimary}`
                }`}
              >
                {" "}
                {opt.label}{" "}
              </motion.li>
            ))}{" "}
          </motion.ul>
        )}{" "}
      </AnimatePresence>{" "}
    </div>
  );
};
const DarkGlowToggle = ({
  enabled,
  setEnabled,
  label,
  infoClick,
  disabled = false,
}) => {
  return (
    <div className={`flex flex-col ${disabled ? "opacity-70" : ""}`}>
      {" "}
      <div className="flex items-center justify-between mb-1.5">
        {" "}
        <span
          className={`text-xs font-medium ${
            disabled ? theme.disabledText : theme.textMuted
          }`}
        >
          {label}
        </span>{" "}
        {infoClick && <InfoButton onClick={infoClick} disabled={disabled} />}{" "}
      </div>{" "}
      <div className="flex items-center gap-3">
        {" "}
        <motion.div
          onClick={() => !disabled && setEnabled(!enabled)}
          className={`relative w-12 h-6 rounded-full flex items-center p-1 transition-colors duration-300 ease-in-out ${
            disabled
              ? theme.disabledBg
              : enabled
              ? `bg-gradient-to-r from-${theme.accentSecondary}-500 to-${theme.accentSecondary}-600 shadow-md shadow-${theme.accentSecondary}-500/30`
              : `${theme.inputBg} hover:bg-slate-600 border border-slate-600`
          } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          {" "}
          <motion.div
            className="w-4 h-4 bg-white rounded-full shadow-lg"
            animate={{ x: enabled ? "1.25rem" : "0.125rem" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />{" "}
        </motion.div>{" "}
        <span
          className={`text-xs font-medium ${
            enabled && !disabled
              ? `text-${theme.accentSecondary}-300`
              : theme.textMuted
          } ${disabled ? theme.disabledText : ""}`}
        >
          {" "}
          {enabled ? "Enabled" : "Disabled"}{" "}
        </span>{" "}
      </div>{" "}
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
  disabled = false,
}) => (
  <div className={`w-full ${disabled ? "opacity-70" : ""}`}>
    {" "}
    <div className="flex items-center justify-between mb-1">
      {" "}
      <label
        htmlFor={id}
        className={`text-xs font-medium ${
          disabled ? theme.disabledText : theme.textMuted
        }`}
      >
        {label}
      </label>{" "}
      {infoClick && <InfoButton onClick={infoClick} disabled={disabled} />}{" "}
    </div>{" "}
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(e) => !disabled && setValue(parseFloat(e.target.value))}
      id={id}
      className={`w-full h-2.5 rounded-lg appearance-none outline-none ${
        disabled
          ? `${theme.disabledBg} cursor-not-allowed`
          : `${theme.inputBg} cursor-pointer`
      } [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:${
        disabled
          ? "bg-slate-500"
          : `bg-${theme.accent}-500 hover:bg-${theme.accent}-400`
      } [&::-webkit-slider-thumb]:shadow-md transition-all duration-150 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:${
        disabled
          ? "bg-slate-500"
          : `bg-${theme.accent}-500 hover:bg-${theme.accent}-400`
      } [&::-moz-range-thumb]:border-none`}
    />{" "}
    <div
      className={`text-right text-xs mt-1 ${
        disabled ? theme.disabledText : theme.textMuted
      }`}
    >
      {" "}
      Value:{" "}
      <span
        className={`font-semibold ${
          disabled ? "" : `text-${theme.accent}-300`
        }`}
      >
        {value}
        {unit}
      </span>{" "}
    </div>{" "}
  </div>
);
const settingDescriptions = {
  /* ... */
};
const modeDescriptions = {
  /* ... */
};

export default function SettingsPage({
  onBack,
  onContinue,
  onSave,
  initialSettings = {},
  isPresetMode = false,
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
    setMode_id(initialSettings.mode_id ?? 1);
    setLearningRate(initialSettings.learningRate ?? 0.001);
    setEpochs(initialSettings.epochs ?? 100);
    setBatchSize(initialSettings.batchSize ?? 32);
    setUseDropout(initialSettings.useDropout ?? false);
    setDropout(initialSettings.dropout ?? 0.5);
    setWeightInit(initialSettings.weightInit ?? weightInitMap.Xavier);
    setOptimizer(initialSettings.optimizer ?? optimizerMap.Adam);
    setUseLrScheduler(initialSettings.useLrScheduler ?? false);
  }, [initialSettings]);

  useEffect(() => {
    if (onSave && !isPresetMode) {
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
    isPresetMode,
  ]);

  const handleInfoClick = (settingKey) => {
    /* ... (same as before) ... */
    let title, items;
    const currentModeOption = modeOptions.find((opt) => opt.value === mode_id); // Ensure modeOptions is defined or passed
    if (settingKey === "mode_info") {
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
    { value: 5, label: "5 - ReLU, Softmax + CCE" },
  ];
  const batchSizeOptions = [
    { value: 1, label: "1" },
    { value: 16, label: "16" },
    { value: 32, label: "32" },
    { value: 64, label: "64" },
  ];
  const optimizerOptions = Object.entries(optimizerMap).map(
    ([label, value]) => ({ label, value })
  );
  const weightInitOptions = Object.entries(weightInitMap).map(
    ([label, value]) => ({ label, value })
  );

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
          {" "}
          <ArrowLeftCircle size={18} /> Back to Architecture{" "}
        </motion.button>
        <h1
          className={`text-lg font-semibold ${theme.textPrimary} absolute left-1/2 -translate-x-1/2`}
        >
          Configure Training Settings
        </h1>
        <div className="w-40"></div>
      </div>

      <motion.div
        className="flex-grow max-w-7xl w-full mx-auto grid lg:grid-cols-3 gap-6 p-6 sm:p-8 items-start"
        variants={sectionContainerVariants}
        initial="hidden"
        animate="show"
      >
        {isPresetMode && (
          <motion.div
            className={`lg:col-span-3 mb-0 p-3.5 rounded-lg bg-${theme.accent}-800/30 border border-${theme.accent}-700 text-${theme.accent}-300 text-sm flex items-center gap-2 shadow-md`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {" "}
            <Lock size={16} /> You are in preset mode. Settings are locked.{" "}
          </motion.div>
        )}

        <div className="flex flex-col gap-6 lg:col-span-1">
          <StaggeredChild
            className={`p-6 rounded-xl ${theme.cardAlt} border ${theme.divider} shadow-xl h-full`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-lg font-semibold ${theme.textPrimary} flex items-center gap-2`}
              >
                <Palette size={20} className={`text-${theme.accent}-400`} />
                Mode
              </h2>{" "}
              <InfoButton
                onClick={() => handleInfoClick("mode_info")}
                disabled={isPresetMode}
              />
            </div>
            <DarkFlySelect
              id="mode_id_select"
              label="Activation & Loss"
              options={modeOptions}
              value={mode_id}
              onChange={setMode_id}
              disabled={isPresetMode}
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
            </div>
            <DarkFlySelect
              id="batch_size_select"
              label="Batch Size"
              options={batchSizeOptions}
              value={batchSize}
              onChange={setBatchSize}
              infoClick={() => handleInfoClick("batchSize")}
              className="z-10"
              disabled={isPresetMode}
            />
            <DarkFloatInput
              label="Epochs"
              id="epochs_input"
              value={String(epochs)}
              setValue={(val) =>
                !isPresetMode && setEpochs(Math.max(1, parseInt(val)) || 1)
              }
              type="number"
              disabled={isPresetMode}
              min="1"
              max="50000"
              wrapperClassName="mt-1"
            />
          </StaggeredChild>
        </div>

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
            disabled={isPresetMode}
          />
          <DarkFlySelect
            id="weight_init_select"
            label="Weight Initializer"
            options={weightInitOptions}
            value={weightInit}
            onChange={setWeightInit}
            infoClick={() => handleInfoClick("weightInitializer")}
            disabled={isPresetMode}
          />
          <DarkGlowToggle
            enabled={useDropout}
            setEnabled={(val) => !isPresetMode && setUseDropout(val)}
            label="Dropout Regularization"
            infoClick={() => handleInfoClick("dropout")}
            disabled={isPresetMode}
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
                {" "}
                <DarkBasicSlider
                  id="dropout_slider"
                  label="Dropout Rate"
                  unit=""
                  value={dropout}
                  setValue={(val) => !isPresetMode && setDropout(val)}
                  min={0.05}
                  max={0.8}
                  step={0.01}
                  disabled={isPresetMode || !useDropout}
                />{" "}
              </motion.div>
            )}
          </AnimatePresence>
        </StaggeredChild>

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
            label="Rate Value"
            id="lr_input"
            value={String(learningRate)}
            setValue={(val) =>
              !isPresetMode &&
              setLearningRate(Math.max(0.000001, parseFloat(val)) || 0.000001)
            }
            type="number"
            disabled={isPresetMode}
            step="0.00001"
            min="0.000001"
            max="0.1"
            wrapperClassName="mt-1"
            inputClassName="tabular-nums"
          />
          <InfoButton
            onClick={() => handleInfoClick("learningRate")}
            className="self-start -mt-4"
            disabled={isPresetMode}
          />
          <DarkGlowToggle
            enabled={useLrScheduler}
            setEnabled={(val) => !isPresetMode && setUseLrScheduler(val)}
            label="Use LR Scheduler (Cosine Decay)"
            infoClick={() => handleInfoClick("lrScheduler")}
            disabled={isPresetMode}
          />
        </StaggeredChild>
      </motion.div>

      <AnimatePresence>
        {infoModalContent && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
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
                className={`absolute top-3 right-3 p-1.5 rounded-full text-slate-500 hover:text-slate-100 hover:bg-slate-700 transition-colors z-10`}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.85 }}
              >
                <XCircle size={22} />
              </motion.button>
              <h3
                className={`text-xl sm:text-2xl font-semibold mb-5 ${theme.textPrimary} border-b ${theme.divider} pb-3 pr-8`}
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

      <div
        className={`sticky bottom-0 w-full px-6 py-3.5 ${theme.bg} border-t ${theme.divider} flex justify-end gap-4 z-20 mt-auto shadow-top-lg`}
      >
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
