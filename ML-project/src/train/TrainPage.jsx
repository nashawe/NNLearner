// src/pages/TrainPage.jsx
import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SeparateHistoryCharts from "../components/SeparateHistoryCharts";
import TrainingInsights from "../components/TrainingPage/TrainingInsights"; // Import the modularized component
import {
  ArrowLeft,
  Home,
  Settings,
  RefreshCw,
  Zap,
  AlertTriangle,
  FileJson,
  Activity,
  BarChartBig,
  Edit3,
  XCircle,
  CheckCircle,
  ChevronDown,
  Menu as MenuIcon,
  X as XIcon, // Renamed Menu to MenuIcon, X to XIcon
  ListChecks,
  BarChartHorizontalBig,
  Lightbulb as LightbulbIcon, // Icons for TOC
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trainModel } from "../services/api.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin"; // For TOC smooth scroll

if (!ScrollTrigger.isRegistered) {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// --- Theme ---
const theme = {
  /* ... (theme object as before) ... */ bg: "bg-slate-950",
  surface: "bg-slate-900",
  card: "bg-slate-800/70 backdrop-blur-md border border-slate-700/50",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  accent: "sky",
  accentSecondary: "emerald",
  accentTertiary: "rose",
  divider: "border-slate-700",
  inputBg: "bg-slate-700",
  inputBorder: "border-slate-600",
};

const PulsatingOrb = () => {
  /* ... (PulsatingOrb component as before) ... */
  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
      {" "}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute inset-0 rounded-full border-2 border-${
            theme.accent
          }-${i === 0 ? 500 : i === 1 ? 400 : 300}`}
          animate={{
            scale: [1, 1.15 + i * 0.05, 1],
            opacity: [0.3 + i * 0.1, 0.7, 0.3 + i * 0.1],
          }}
          transition={{
            duration: 1.5 + i * 0.3,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}{" "}
      <div
        className={`absolute inset-3 rounded-full bg-gradient-to-br from-${theme.accent}-700 via-${theme.accent}-600 to-slate-800 flex items-center justify-center shadow-2xl`}
      >
        {" "}
        <Zap
          size={48}
          className={`text-${theme.accent}-300 animate-ping-slow opacity-80`}
          style={{ animationDuration: "1.5s" }}
        />{" "}
      </div>{" "}
    </div>
  );
};

const DarkFlySelect = ({ options, value, onChange, label, id, disabled }) => {
  /* ... (DarkFlySelect component as before, ensure consistency or import from common) ... */
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);
  return (
    <div
      className={`relative w-full group ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {" "}
      {label && (
        <div className="flex items-center justify-between mb-1">
          {" "}
          <span className={`text-xs font-medium ${theme.textMuted}`}>
            {label}
          </span>{" "}
        </div>
      )}{" "}
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`w-full px-3.5 py-3 text-left border rounded-lg ${
          theme.inputBg
        } ${theme.inputBorder} ${theme.textPrimary} hover:border-${
          theme.accent
        }-500/70 focus:border-${theme.accent}-400 focus:ring-1 focus:ring-${
          theme.accent
        }-400 outline-none transition-all duration-200 text-sm flex justify-between items-center ${
          disabled ? "" : "cursor-pointer"
        }`}
      >
        {" "}
        <span
          className={
            value !== null && value !== undefined && selectedOption
              ? theme.textPrimary
              : theme.textMuted
          }
        >
          {" "}
          {selectedOption?.label || "Select..."}{" "}
        </span>{" "}
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />{" "}
      </button>{" "}
      <AnimatePresence>
        {open && !disabled && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`absolute z-50 mt-1 w-full ${theme.surface} border ${theme.inputBorder} rounded-lg shadow-2xl overflow-hidden max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600`}
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
                  theme.textSecondary
                } ${
                  value === opt.value
                    ? `bg-${theme.accent}-500/25 text-${theme.accent}-300 font-medium`
                    : `hover:bg-slate-700/60 hover:${theme.textPrimary}`
                }`}
              >
                {" "}
                {opt.label}{" "}
              </motion.li>
            ))}{" "}
          </motion.ul>
        )}
      </AnimatePresence>{" "}
    </div>
  );
};

const EditParamModal = ({
  isOpen,
  onClose,
  paramKey,
  paramValue,
  onSave,
  trainingParams,
}) => {
  /* ... (EditParamModal component as before) ... */
  if (!isOpen) return null;
  const [internalUseDropout, setInternalUseDropout] = useState(
    trainingParams?.useDropout || false
  );
  const [internalDropoutRate, setInternalDropoutRate] = useState(
    trainingParams?.dropout || 0.5
  );
  const [currentValue, setCurrentValue] = useState(paramValue);
  useEffect(() => {
    if (paramKey === "dropout_settings") {
      setInternalUseDropout(trainingParams?.useDropout || false);
      setInternalDropoutRate(trainingParams?.dropout || 0.5);
    } else {
      setCurrentValue(paramValue);
    }
  }, [paramKey, paramValue, trainingParams]);
  const optimizerMap = { SGD: 1, RMSProp: 2, Adam: 3 };
  const weightInitMap = { Random: 1, Xavier: 2, He: 3 };
  const modeMap = {
    1: "Sigmoid+MSE",
    2: "Sigmoid+BCE",
    3: "Tanh+MSE",
    4: "ReLU,Sigmoid+BCE",
    5: "ReLU,Softmax+CCE",
  };
  const outputIsBinary = trainingParams?.output_size === 1;
  const modeIsBinaryCompatible = (modeId) =>
    [1, 2, 3, 4].includes(parseInt(modeId));
  const commonInputClass = `w-full p-2.5 rounded-md ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} focus:ring-1 focus:ring-${theme.accent}-400 focus:border-${theme.accent}-400 outline-none text-sm`;
  const renderInput = () => {
    switch (paramKey) {
      case "num_layers":
        return (
          <input
            type="number"
            value={parseInt(currentValue)}
            onChange={(e) => setCurrentValue(parseInt(e.target.value))}
            min="0"
            max="5"
            className={commonInputClass}
          />
        );
      case "hidden_size":
        return (
          <input
            type="number"
            value={parseInt(currentValue)}
            onChange={(e) => setCurrentValue(parseInt(e.target.value))}
            min="1"
            max="256"
            className={commonInputClass}
          />
        );
      case "mode_id":
        let modeOptions = Object.entries(modeMap).map(([id, label]) => ({
          value: parseInt(id),
          label: `${id} - ${label}`,
        }));
        if (outputIsBinary)
          modeOptions = modeOptions.filter((opt) =>
            modeIsBinaryCompatible(opt.value)
          );
        return (
          <DarkFlySelect
            options={modeOptions}
            value={parseInt(currentValue)}
            onChange={(v) => setCurrentValue(parseInt(v))}
            label="Mode"
            id="edit-mode"
          />
        );
      case "dropout_settings":
        return (
          <div className="space-y-3">
            {" "}
            <label className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-700/50 cursor-pointer transition-colors">
              {" "}
              <input
                type="checkbox"
                checked={internalUseDropout}
                onChange={(e) => setInternalUseDropout(e.target.checked)}
                className={`form-checkbox h-5 w-5 rounded ${theme.accentSecondary}-500 text-${theme.accentSecondary}-500 border-slate-600 focus:ring-${theme.accentSecondary}-400 focus:ring-offset-slate-800 bg-slate-700`}
              />{" "}
              <span className={theme.textSecondary}>Enable Dropout</span>{" "}
            </label>{" "}
            <input
              type="number"
              value={Number(internalDropoutRate)}
              onChange={(e) =>
                setInternalDropoutRate(parseFloat(e.target.value))
              }
              step="0.01"
              min="0"
              max="0.9"
              className={commonInputClass}
              disabled={!internalUseDropout}
              placeholder="Dropout Rate (0.0-0.9)"
            />{" "}
          </div>
        );
      case "learn_rate":
        return (
          <input
            type="number"
            value={Number(currentValue)}
            onChange={(e) => setCurrentValue(parseFloat(e.target.value))}
            step="0.00001"
            min="0.000001"
            max="0.1"
            className={commonInputClass}
          />
        );
      case "epochs":
        return (
          <input
            type="number"
            value={parseInt(currentValue)}
            onChange={(e) => setCurrentValue(parseInt(e.target.value))}
            min="1"
            max="50000"
            className={commonInputClass}
          />
        );
      case "batch_size":
        return (
          <DarkFlySelect
            options={[1, 8, 16, 32, 64, 128].map((v) => ({
              value: v,
              label: String(v),
            }))}
            value={parseInt(currentValue)}
            onChange={(v) => setCurrentValue(parseInt(v))}
            label="Batch Size"
            id="edit-batch"
          />
        );
      case "optimizer_choice":
        return (
          <DarkFlySelect
            options={Object.entries(optimizerMap).map(([label, value]) => ({
              label,
              value,
            }))}
            value={parseInt(currentValue)}
            onChange={(v) => setCurrentValue(parseInt(v))}
            label="Optimizer"
            id="edit-optimizer"
          />
        );
      case "init_id":
        return (
          <DarkFlySelect
            options={Object.entries(weightInitMap).map(([label, value]) => ({
              label,
              value,
            }))}
            value={parseInt(currentValue)}
            onChange={(v) => setCurrentValue(parseInt(v))}
            label="Weight Init"
            id="edit-init"
          />
        );
      case "use_scheduler":
        return (
          <label className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-700/50 cursor-pointer transition-colors">
            {" "}
            <input
              type="checkbox"
              checked={!!currentValue}
              onChange={(e) => setCurrentValue(e.target.checked)}
              className={`form-checkbox h-5 w-5 rounded ${theme.accent}-500 text-${theme.accent}-500 border-slate-600 focus:ring-${theme.accent}-400 focus:ring-offset-slate-800 bg-slate-700`}
            />{" "}
            <span className={theme.textSecondary}>Enable LR Scheduler</span>{" "}
          </label>
        );
      default:
        return (
          <p className={`${theme.textMuted} text-sm`}>
            Editing for "{paramKey.replace(/_/g, " ")}" not available.
          </p>
        );
    }
  };
  const handleSave = () => {
    if (paramKey === "dropout_settings") {
      onSave("useDropout", internalUseDropout);
      onSave("dropout", internalUseDropout ? Number(internalDropoutRate) : 0);
    } else {
      let v = currentValue;
      if (["learn_rate"].includes(paramKey)) v = parseFloat(currentValue);
      if (
        [
          "epochs",
          "batch_size",
          "mode_id",
          "optimizer_choice",
          "init_id",
          "hidden_size",
          "num_layers",
        ].includes(paramKey)
      )
        v = parseInt(currentValue);
      if (paramKey === "use_scheduler") v = !!currentValue;
      onSave(paramKey, v);
    }
    onClose();
  };
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {" "}
      <motion.div
        className={`relative ${theme.surface} w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl border ${theme.divider}`}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        <motion.button
          onClick={onClose}
          className={`absolute top-3 right-3 p-1.5 rounded-full text-slate-500 hover:text-slate-100 hover:bg-slate-700 transition-colors`}
          whileHover={{ rotate: 90, scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
        >
          {" "}
          <XCircle size={22} />{" "}
        </motion.button>{" "}
        <h3
          className={`text-xl font-semibold mb-5 ${theme.textPrimary} capitalize`}
        >
          Edit{" "}
          {paramKey === "dropout_settings"
            ? "Dropout Settings"
            : paramKey.replace(/_/g, " ")}
        </h3>{" "}
        <div className="space-y-4">{renderInput()}</div>{" "}
        <div className="mt-6 flex justify-end gap-3">
          {" "}
          <motion.button
            onClick={onClose}
            className={`px-5 py-2 rounded-lg text-sm font-medium ${theme.card} border ${theme.inputBorder} ${theme.textSecondary} hover:${theme.textPrimary} hover:border-${theme.accent}-500/70`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            Cancel
          </motion.button>{" "}
          <motion.button
            onClick={handleSave}
            className={`px-5 py-2 rounded-lg text-sm font-semibold bg-${theme.accentSecondary}-600 text-white hover:bg-${theme.accentSecondary}-500`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            Save Change
          </motion.button>{" "}
        </div>{" "}
      </motion.div>{" "}
    </motion.div>
  );
};

// TOC Configuration for TrainPage
const TRAIN_PAGE_SECTIONS = [
  {
    id: "params-section",
    title: "Parameters",
    Icon: FileJson,
    shortTitle: "Params",
  },
  {
    id: "metrics-section",
    title: "Metrics",
    Icon: BarChartHorizontalBig,
    shortTitle: "Metrics",
  },
  {
    id: "insights-section",
    title: "Insights",
    Icon: LightbulbIcon,
    shortTitle: "Insights",
  },
];

export default function TrainPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const mainContainerRef = useRef(null); // For GSAP context if needed, and scroll calculations for TOC

  const [editableTrainingParams, setEditableTrainingParams] = useState(
    state?.trainingParams || null
  );
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasTrainedInitially = useRef(false);
  const [editingParam, setEditingParam] = useState(null);
  const [architectureLayersForAnalysis, setArchitectureLayersForAnalysis] =
    useState(state?.trainingParams?.architectureLayers || []);

  // TOC State
  const [activeTocSectionId, setActiveTocSectionId] = useState(
    TRAIN_PAGE_SECTIONS[0].id
  );
  const [isTocMobileOpen, setIsTocMobileOpen] = useState(false);

  const runTraining = useCallback(
    async (paramsToUse) => {
      /* ... (as before) ... */
      if (!paramsToUse) {
        setError("Cannot run training without parameters.");
        setIsLoading(false);
        return;
      }
      setError(null);
      setHistory(null);
      setIsLoading(true);
      if (
        paramsToUse.num_layers !== undefined &&
        paramsToUse.hidden_size !== undefined
      ) {
        const newArchLayers = [];
        if (paramsToUse.input_size)
          newArchLayers.push({
            type: "input",
            neurons: paramsToUse.input_size,
          });
        for (let i = 0; i < paramsToUse.num_layers; i++) {
          newArchLayers.push({
            type: "hidden",
            neurons: paramsToUse.hidden_size,
          });
        }
        if (paramsToUse.output_size)
          newArchLayers.push({
            type: "output",
            neurons: paramsToUse.output_size,
          });
        setArchitectureLayersForAnalysis(newArchLayers);
      } else if (state?.trainingParams?.architectureLayers) {
        setArchitectureLayersForAnalysis(
          state.trainingParams.architectureLayers
        );
      }
      try {
        const res = await trainModel(paramsToUse);
        setHistory({
          loss: res.loss,
          accuracy: res.accuracy,
          learning_rate: res.learning_rate,
        });
      } catch (err) {
        setError(err.message || "An unknown error occurred during training.");
      } finally {
        setIsLoading(false);
      }
    },
    [state?.trainingParams?.architectureLayers]
  );

  useEffect(() => {
    /* ... (as before, sets initial architectureLayersForAnalysis) ... */
    if (!editableTrainingParams) {
      setError("Training parameters are missing.");
      setIsLoading(false);
      return;
    }
    if (!hasTrainedInitially.current) {
      hasTrainedInitially.current = true;
      const initialArch =
        editableTrainingParams.architectureLayers ||
        state?.trainingParams?.architectureLayers ||
        [];
      setArchitectureLayersForAnalysis(initialArch);
      runTraining(editableTrainingParams);
    }
  }, [
    editableTrainingParams,
    runTraining,
    state?.trainingParams?.architectureLayers,
  ]);

  const handleParamSave = (key, newValue) => {
    /* ... (as before) ... */
    setEditableTrainingParams((prev) => {
      if (!prev) return null;
      const updatedParams = { ...prev, [key]: newValue };
      if (key === "useDropout" && !newValue) {
        updatedParams.dropout = 0;
      } else if (key === "dropout_settings") {
        updatedParams.useDropout = newValue.useDropout;
        updatedParams.dropout = newValue.useDropout
          ? Number(newValue.dropoutRate)
          : 0;
      }
      return updatedParams;
    });
  };
  const editableKeys = [
    "num_layers",
    "hidden_size",
    "mode_id",
    "batch_size",
    "dropout_settings",
    "optimizer_choice",
    "learn_rate",
    "use_scheduler",
    "init_id",
    "epochs",
  ];

  const SectionBtn = ({ label, onClick, icon: Icon }) => (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium ${theme.card} border ${theme.divider} text-slate-300 hover:text-slate-50 hover:border-${theme.accent}-500/70 hover:bg-${theme.accent}-500/10 transition-all duration-200`}
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {" "}
      {Icon && <Icon size={14} />} {label}{" "}
    </motion.button>
  );

  const paramsRef = useRef(null); // Now for the section, not individual items
  const metricsRef = useRef(null);
  const insightsRef = useRef(null); // Ref for the new insights section

  // GSAP for general section entrances and TOC active state
  useLayoutEffect(() => {
    const sectionElements = [
      paramsRef.current,
      metricsRef.current,
      insightsRef.current,
    ].filter(Boolean);
    const ctx = gsap.context(() => {
      sectionElements.forEach((sectionEl) => {
        if (!sectionEl) return;
        // Basic entrance for sections (can be more complex)
        gsap.fromTo(
          sectionEl,
          { opacity: 0, y: 50, filter: "blur(5px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
        // TOC Active State
        ScrollTrigger.create({
          trigger: sectionEl,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveTocSectionId(sectionEl.id),
          onEnterBack: () => setActiveTocSectionId(sectionEl.id),
        });
      });
    }, mainContainerRef); // Scope to main container
    return () => ctx.revert();
  }, [isLoading]); // Rerun if isLoading changes, might affect section visibility/existence

  const handleTocClick = (id) => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: `#${id}`, offsetY: 100 },
      ease: "power2.inOut",
    }); // offsetY for sticky header
    setIsTocMobileOpen(false);
  };

  const getDisplayValueForKey = (key, value) => {
    /* ... (as before) ... */
    if (key === "dropout_settings") {
      return editableTrainingParams?.useDropout
        ? `Enabled (${editableTrainingParams?.dropout || 0})`
        : "Disabled";
    }
    if (Array.isArray(value)) return `Array (${value.length} items)`;
    if (typeof value === "boolean") return value ? "Enabled" : "Disabled";
    if (key === "optimizer_choice")
      return { 1: "SGD", 2: "RMSProp", 3: "Adam" }[value] || String(value);
    if (key === "init_id")
      return { 1: "Random", 2: "Xavier", 3: "He" }[value] || String(value);
    if (key === "mode_id")
      return (
        {
          1: "Sigmoid+MSE",
          2: "Sigmoid+BCE",
          3: "Tanh+MSE",
          4: "ReLU,Sig+BCE",
          5: "ReLU,Softmax+CCE",
        }[value] || String(value)
      );
    if (
      key === "dropout" &&
      editableTrainingParams &&
      !editableTrainingParams.useDropout
    )
      return "Off";
    return String(value);
  };

  if (!editableTrainingParams) {
    /* ... (Guard as before) ... */
    return (
      <div
        className={`w-full h-screen flex flex-col items-center justify-center ${theme.bg} ${theme.textPrimary} p-8 text-center`}
      >
        {" "}
        <AlertTriangle size={48} className="text-rose-500 mb-4" />{" "}
        <h2 className="text-2xl font-bold mb-2">Error</h2>{" "}
        <p className={`${theme.textSecondary}`}>
          Training parameters were not provided.
        </p>{" "}
        <motion.button
          onClick={() => navigate("/")}
          className={`mt-6 px-6 py-2 rounded-lg bg-${theme.accent}-600 text-white hover:bg-${theme.accent}-500`}
        >
          Go Home
        </motion.button>{" "}
      </div>
    );
  }

  return (
    <div
      ref={mainContainerRef}
      className={`min-h-screen flex flex-col ${theme.bg} ${theme.textSecondary} selection:bg-${theme.accent}-500 selection:text-white scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent`}
    >
      <motion.header
        className={`sticky top-0 z-40 ${theme.surface} bg-opacity-70 backdrop-blur-md shadow-xl border-b ${theme.divider}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "circOut", delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {" "}
            <motion.button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-full hover:bg-slate-700 transition-colors text-slate-400 hover:text-${theme.accent}-300`}
              title="Back"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {" "}
              <ArrowLeft size={20} />{" "}
            </motion.button>{" "}
            <h1
              className={`text-md sm:text-lg font-semibold ${theme.textPrimary} flex items-center gap-2`}
            >
              {" "}
              <Activity size={20} className={`text-${theme.accent}-400`} />{" "}
              Training Dashboard{" "}
            </h1>{" "}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {" "}
            <motion.button
              onClick={() => navigate("/")}
              className={`p-2 rounded-full hover:bg-slate-700 transition-colors text-slate-400 hover:text-${theme.accent}-300`}
              title="Home"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {" "}
              <Home size={20} />{" "}
            </motion.button>{" "}
          </div>
        </div>
      </motion.header>

      {/* Desktop TOC */}
      <aside className="hidden lg:block fixed top-1/2 -translate-y-1/2 left-6 z-30">
        {" "}
        {/* Ensure z-index is below header but above content */}
        <nav
          className={`p-3 rounded-lg ${theme.surface} bg-opacity-80 backdrop-blur-md shadow-2xl border ${theme.divider} max-w-[220px]`}
        >
          <h3
            className={`text-xs font-semibold mb-2 ${theme.textMuted} uppercase tracking-wider px-2`}
          >
            Dashboard Sections
          </h3>
          <ul>
            {TRAIN_PAGE_SECTIONS.map((section) => (
              <li key={section.id} className="my-0.5">
                <motion.button
                  onClick={() => handleTocClick(section.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-all duration-200 flex items-center gap-1.5 
                                ${
                                  activeTocSectionId === section.id
                                    ? `${theme.textPrimary} bg-${theme.accent}-600 shadow-md`
                                    : `${theme.textMuted} hover:${theme.textSecondary} hover:bg-slate-700/50`
                                }`}
                  whileHover={{ x: activeTocSectionId !== section.id ? 3 : 0 }}
                >
                  <section.Icon
                    className={`w-4 h-4 shrink-0 ${
                      activeTocSectionId === section.id
                        ? theme.textPrimary
                        : `text-${theme.accent}-400`
                    }`}
                  />
                  <span className="truncate">{section.shortTitle}</span>
                </motion.button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile TOC Toggle */}
      <div className="lg:hidden fixed top-[88px] right-4 z-50">
        {" "}
        {/* Position below sticky header */}
        <motion.button
          onClick={() => setIsTocMobileOpen(!isTocMobileOpen)}
          className={`p-2.5 rounded-full ${theme.surface} text-${theme.accent}-400 shadow-lg`}
          whileTap={{ scale: 0.9 }}
        >
          {isTocMobileOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </motion.button>
      </div>
      <AnimatePresence>
        {isTocMobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`lg:hidden fixed inset-y-0 right-0 w-64 ${theme.surface} shadow-2xl z-40 p-6 pt-20 border-l ${theme.divider} overflow-y-auto`}
          >
            <h3 className={`text-md font-semibold mb-4 ${theme.textPrimary}`}>
              Sections
            </h3>
            <ul>
              {TRAIN_PAGE_SECTIONS.map((section) => (
                <li key={section.id} className="mb-2">
                  <button
                    onClick={() => handleTocClick(section.id)}
                    className={`w-full text-left py-2 text-sm flex items-center gap-2 ${
                      activeTocSectionId === section.id
                        ? `text-${theme.accent}-400 font-semibold`
                        : theme.textSecondary
                    }`}
                  >
                    <section.Icon className="w-4 h-4" /> {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Added lg:ml-64 for desktop TOC spacing */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-16 lg:ml-64 xl:ml-72">
        {" "}
        {/* Adjust ml for TOC width */}
        {/* Parameters Section */}
        <section
          ref={paramsRef}
          id="params-section"
          className={`${theme.card} p-6 sm:p-8 rounded-2xl shadow-2xl`}
        >
          <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6 border-b ${theme.divider} pb-4">
            <div className="flex items-center gap-3">
              {" "}
              <Settings
                size={24}
                className={`text-${theme.accentSecondary}-400`}
              />{" "}
              <h2
                className={`text-xl sm:text-2xl font-semibold ${theme.textPrimary}`}
              >
                Run Configuration
              </h2>{" "}
            </div>
            <motion.button
              onClick={() => runTraining(editableTrainingParams)}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-${theme.accent}-600 to-${theme.accent}-500 text-white hover:from-${theme.accent}-500 hover:to-${theme.accent}-400 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all`}
              whileHover={{
                y: isLoading ? 0 : -2,
                scale: isLoading ? 1 : 1.05,
              }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
            >
              {" "}
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />{" "}
              {isLoading ? "Training..." : "Rerun Training"}{" "}
            </motion.button>
          </div>
          {editableTrainingParams /* ... Parameter list mapping ... */ ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5 text-sm">
              {Object.entries(editableTrainingParams)
                .filter(([key]) => key !== "architectureLayers")
                .map(([key, value]) => {
                  const isActuallyEditable =
                    editableKeys.includes(key) ||
                    (key === "useDropout" &&
                      editableKeys.includes("dropout_settings"));
                  const paramKeyForEdit =
                    key === "dropout" || key === "useDropout"
                      ? "dropout_settings"
                      : key;
                  const valueForEdit =
                    key === "dropout" || key === "useDropout"
                      ? {
                          useDropout: editableTrainingParams.useDropout,
                          dropoutRate: editableTrainingParams.dropout,
                        }
                      : value;
                  const displayValue = getDisplayValueForKey(key, value);
                  return (
                    <div
                      key={key}
                      className="param-item group flex flex-col border-l-2 border-slate-700 hover:border-sky-500 transition-colors duration-150 pl-3 py-1 relative"
                    >
                      {" "}
                      <span
                        className={`text-xs font-medium ${theme.textMuted} uppercase tracking-wider group-hover:text-sky-400 transition-colors`}
                      >
                        {key.replace(/_/g, " ")}
                      </span>{" "}
                      <span
                        className={`text-base ${theme.textPrimary} font-mono break-all pr-10`}
                        title={String(value)}
                      >
                        {displayValue.length > 20
                          ? displayValue.substring(0, 17) + "..."
                          : displayValue}
                      </span>{" "}
                      {isActuallyEditable && !isLoading && (
                        <motion.button
                          onClick={() =>
                            setEditingParam({
                              key: paramKeyForEdit,
                              value: valueForEdit,
                            })
                          }
                          className="absolute top-1/2 right-1 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-sky-300 opacity-50 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                          title={`Edit ${key.replace(/_/g, " ")}`}
                          whileHover={{
                            scale: 1.25,
                            backgroundColor: "rgba(14,165,233,0.1)",
                          }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {" "}
                          <Edit3 size={16} />{" "}
                        </motion.button>
                      )}{" "}
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className={theme.textMuted}>No training parameters available.</p>
          )}
        </section>
        {/* Metrics Section */}
        <motion.section ref={metricsRef} id="metrics-section">
          {" "}
          {/* Changed id */}
          <AnimatePresence mode="wait">
            {isLoading && !error && (
              /* ... Loading JSX ... */ <motion.div
                key="loading"
                className="text-center py-12 sm:py-16 flex flex-col items-center justify-center space-y-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.4, ease: "backOut" },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.3, ease: "backIn" },
                }}
              >
                {" "}
                <PulsatingOrb />{" "}
                <p
                  className={`text-xl sm:text-2xl font-semibold ${theme.textPrimary} tracking-wide`}
                >
                  Training in Progress...
                </p>{" "}
                <div
                  className={`w-full max-w-md h-2 ${theme.surfaceContrast} rounded-full overflow-hidden`}
                >
                  {" "}
                  <motion.div
                    className={`h-full bg-gradient-to-r from-${theme.accent}-500 to-${theme.accentSecondary}-500 rounded-full`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: 15,
                      ease: "linear",
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  />{" "}
                </div>{" "}
              </motion.div>
            )}
            {error && !isLoading && (
              /* ... Error JSX ... */ <motion.div
                key="error"
                className={`p-6 sm:p-8 rounded-2xl ${theme.card} border-2 border-${theme.accentTertiary}-500/70 shadow-xl text-center`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {" "}
                <AlertTriangle
                  size={32}
                  className={`mx-auto mb-4 text-${theme.accentTertiary}-400`}
                />{" "}
                <h3
                  className={`text-xl font-semibold mb-2 text-${theme.accentTertiary}-300`}
                >
                  Training Failed
                </h3>{" "}
                <p className={`${theme.textSecondary} text-sm`}>{error}</p>{" "}
                <motion.button
                  onClick={() => runTraining(editableTrainingParams)}
                  className={`mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-${theme.accentTertiary}-600 text-white hover:bg-${theme.accentTertiary}-500 transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {" "}
                  <RefreshCw size={16} /> Try Again{" "}
                </motion.button>{" "}
              </motion.div>
            )}
            {history && !isLoading && !error && (
              <motion.div
                key="charts"
                className={`${theme.card} p-1 sm:p-2 rounded-xl shadow-xl`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
              >
                <div className="flex items-center justify-center gap-3 my-4 sm:my-6">
                  {" "}
                  <BarChartBig
                    size={28}
                    className={`text-${theme.accent}-400`}
                  />{" "}
                  <h2
                    className={`text-2xl sm:text-3xl font-semibold ${theme.textPrimary}`}
                  >
                    Training Metrics
                  </h2>{" "}
                </div>
                <SeparateHistoryCharts
                  loss={history.loss}
                  accuracy={history.accuracy}
                  learning_rate={history.learning_rate}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
        {/* Insights Section - Rendered via TrainingInsights component */}
        {history && !isLoading && !error && (
          <section ref={insightsRef} id="insights-section">
            <TrainingInsights
              // Use a key that changes when history changes to force re-mount and re-animate TrainingInsights
              key={
                history ? JSON.stringify(history.loss.slice(-1)) : "no-history"
              }
              history={history}
              settings={editableTrainingParams}
              layersFromArchitecture={architectureLayersForAnalysis}
            />
          </section>
        )}
      </main>

      <AnimatePresence>
        {editingParam /* ... EditParamModal ... */ && (
          <EditParamModal
            isOpen={!!editingParam}
            onClose={() => setEditingParam(null)}
            paramKey={editingParam.key}
            paramValue={
              editingParam.key === "dropout_settings"
                ? {
                    useDropout: editableTrainingParams.useDropout,
                    dropoutRate: editableTrainingParams.dropout,
                  }
                : editingParam.value
            }
            onSave={handleParamSave}
            trainingParams={editableTrainingParams}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
