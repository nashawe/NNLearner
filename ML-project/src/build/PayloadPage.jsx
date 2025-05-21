// src/pages/PayloadPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  UploadCloud,
  Save,
  FileText,
  Info,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (!ScrollTrigger.isRegistered) {
  gsap.registerPlugin(ScrollTrigger);
}

const theme = {
  bg: "bg-slate-950",
  surface: "bg-slate-900",
  card: "bg-slate-800",
  cardAlt: "bg-slate-800/70 backdrop-blur-md",
  inputBg: "bg-slate-700",
  inputBorder: "border-slate-600",
  inputFocusBorder: "focus:border-sky-400",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  accent: "sky",
  accentSecondary: "emerald",
  divider: "border-slate-700",
};

// --- Custom Dark Themed Floating Input Components (FIXED for no placeholder reliance) ---
const DarkFloatInputBase = ({
  label,
  id,
  value,
  children,
  infoClick,
  wrapperClassName = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== "";

  // Determine card background for label cutout effect - assuming cards use theme.cardAlt
  const cardBgRgb = "15 23 42"; // Default to slate-800 equivalent if cardAlt is complex

  return (
    <div className={`relative flex flex-col ${wrapperClassName}`}>
      <motion.label
        htmlFor={id}
        animate={isFocused || hasValue ? "active" : "inactive"}
        variants={{
          inactive: {
            y: "0.9rem",
            scale: 1,
            color: "rgb(100 116 139)",
            x: "0.8rem",
          },
          active: {
            y: "-0.5rem",
            scale: 0.8,
            color: `rgb(var(--color-${theme.accent}-rgb, 14 165 233))`,
            x: "0.6rem",
            backgroundColor: `rgb(${cardBgRgb})`,
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
          },
        }}
        initial={hasValue ? "active" : "inactive"} // Set initial based on value, no animation
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 25,
          duration: 0.1,
        }}
        className="absolute left-0 top-0 text-sm pointer-events-none origin-top-left z-10"
      >
        {label}
      </motion.label>
      {React.cloneElement(children, {
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
        id: id,
        className: `${children.props.className || ""} pt-5 pb-2.5 px-3.5`,
      })}
    </div>
  );
};

const DarkFloatTextarea = ({
  label,
  id,
  value,
  setValue,
  rows = 8,
  className = "",
}) => {
  return (
    <DarkFloatInputBase
      label={label}
      id={id}
      value={value}
      wrapperClassName={className}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={rows}
        placeholder="" // REMOVED placeholder text
        className={`peer block w-full border rounded-lg ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} 
                            hover:border-${theme.accent}-500/50 focus:${theme.inputFocusBorder} focus:ring-1 focus:ring-${theme.accent}-400 
                            outline-none transition-colors text-sm scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent resize-y min-h-[100px]`}
      />
    </DarkFloatInputBase>
  );
};

const DarkFloatInput = ({
  label,
  id,
  value,
  setValue,
  type = "text",
  className = "",
}) => {
  return (
    <DarkFloatInputBase
      label={label}
      id={id}
      value={value}
      wrapperClassName={className}
    >
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="" // REMOVED placeholder text
        className={`peer block w-full border rounded-lg ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} 
                            hover:border-${theme.accent}-500/50 focus:${theme.inputFocusBorder} focus:ring-1 focus:ring-${theme.accent}-400
                            outline-none transition-colors text-sm`}
      />
    </DarkFloatInputBase>
  );
};

const DarkGlowToggle = ({ enabled, setEnabled, label }) => {
  return (
    <div className="flex flex-col mt-1">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-medium ${theme.textPrimary}`}>
          {label}
        </span>
        {/* InfoButton could be added here if needed */}
      </div>
      <div className="flex items-center gap-3">
        <motion.div
          onClick={() => setEnabled(!enabled)}
          className={
            "relative w-14 h-7 rounded-full cursor-pointer flex items-center p-1 transition-colors duration-300 ease-in-out shadow-inner border border-sky-400"
          } // Off state border
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-5 h-5 bg-white rounded-full shadow-lg"
            animate={{ x: enabled ? "1.5rem" : "0.125rem" }}
            transition={{ type: "spring", stiffness: 700, damping: 35 }}
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

// --- Main PayloadPage Component ---
export default function PayloadPage({
  onBack,
  onContinue,
  onSave,
  initialPayload = {},
}) {
  const [data, setData] = useState(initialPayload.data ?? "");
  const [labels, setLabels] = useState(initialPayload.labels ?? "");
  const [saveAfter, setSaveAfter] = useState(initialPayload.saveAfter ?? false);
  const [filename, setFilename] = useState(initialPayload.filename ?? "");

  const handleFileUpload = (e) => {
    /* ... (functionality remains same) ... */
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const txt = evt.target.result?.trim();
        if (!txt) throw new Error("File is empty or unreadable.");
        const lines = txt.split(/\r?\n/).filter(Boolean);
        if (lines.length === 0) throw new Error("No data lines found in file.");

        const features = lines.map((l) => {
          const cols = l.split(",").map((s) => s.trim());
          if (cols.length < 2 && lines.length > 1)
            throw new Error(
              `Line "${l}" has fewer than 2 columns. Ensure data and label are present.`
            );
          if (cols.length === 1 && lines.length > 1)
            throw new Error(
              `Line "${l}" seems to have only one value. Did you mean to have features and a label?`
            );
          return cols.slice(0, -1).join(",");
        });
        const lbls = lines.map((l) => {
          const cols = l.split(",").map((s) => s.trim());
          return cols.at(-1);
        });
        setData(features.join("\n"));
        setLabels(lbls.join(","));
      } catch (error) {
        console.error("Error processing file:", error);
        alert(
          `Error processing file: ${error.message}. Please ensure the CSV has features in the initial columns and labels in the last column.`
        );
      }
    };
    reader.onerror = () => {
      alert("Error reading file.");
    };
    reader.readAsText(file);
    if (e.target) e.target.value = null;
  };

  useEffect(() => {
    /* ... (functionality remains same) ... */
    if (onSave) {
      onSave({ data, labels, saveAfter, filename });
    }
  }, [data, labels, saveAfter, filename, onSave]);

  const pageVariants = {
    /* ... (remains same) ... */ initial: { opacity: 0, x: "-5%" },
    animate: {
      opacity: 1,
      x: "0%",
      transition: { duration: 0.4, ease: "circOut" },
    },
    exit: {
      opacity: 0,
      x: "5%",
      transition: { duration: 0.3, ease: "circIn" },
    },
  };
  const cardContainerVariants = {
    /* ... (remains same) ... */ hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };
  const cardItemVariants = {
    /* ... (remains same) ... */ hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 250, damping: 25 },
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
      {/* Header (remains same) */}
      <div
        className={`sticky top-0 ${theme.bg} bg-opacity-80 backdrop-blur-md z-20 px-6 py-3.5 border-b ${theme.divider} flex items-center justify-between shadow-sm`}
      >
        <motion.button
          onClick={onBack}
          className={`flex items-center gap-1.5 text-sm ${theme.textMuted} hover:${theme.textPrimary} transition-colors`}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeftCircle size={18} /> Back to Settings
        </motion.button>
        <h1
          className={`text-lg font-semibold ${theme.textPrimary} absolute left-1/2 -translate-x-1/2`}
        >
          Provide Training Data
        </h1>
        <div className="w-36"></div>
      </div>

      <motion.div
        className="flex-grow max-w-6xl w-full mx-auto p-6 sm:p-8"
        variants={cardContainerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Grid for two main content cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* CARD 1: Data & Labels Input (Manual Paste + CSV Upload) */}
          <motion.section
            variants={cardItemVariants}
            className={`p-6 sm:p-8 rounded-2xl ${theme.cardAlt} border ${theme.divider} shadow-2xl flex flex-col space-y-5`} // Unified space-y
          >
            <div className="flex items-center gap-2 mb-1">
              <FileText size={24} className={`text-${theme.accent}-400`} />
              <h2 className={`text-xl font-semibold ${theme.textPrimary}`}>
                Input Features & Labels
              </h2>
            </div>
            <DarkFloatTextarea
              id="data-textarea"
              label="Feature Data (CSV rows, no labels)"
              value={data}
              setValue={setData}
              rows={3}
            />
            <p className={`text-xs ${theme.textMuted} -mt-3 ml-1`}>
              One sample/line, comma-separated values.
            </p>{" "}
            {/* Adjusted margin */}
            <DarkFloatInput
              id="labels-input"
              label="Labels (comma-separated)"
              value={labels}
              setValue={setLabels}
              className="mt-1"
            />
            <p className={`text-xs ${theme.textMuted} -mt-3 ml-1`}>
              Single line, matching data sample count.
            </p>
            <div className="flex items-center gap-4 pt-3">
              {" "}
              {/* OR Divider */}
              <div className={`h-px flex-grow ${theme.divider}`}></div>
              <span className={`${theme.textMuted} text-sm`}>OR</span>
              <div className={`h-px flex-grow ${theme.divider}`}></div>
            </div>
            <motion.label // CSV Upload Button
              htmlFor="csvUpload"
              className={`w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-gradient-to-r from-${theme.accent}-600 to-${theme.accent}-500 ${theme.textPrimary} 
                          font-medium cursor-pointer shadow-lg bg-emerald hover:from-${theme.accent}-500 hover:to-${theme.accent}-400 transition-all duration-200 ease-out transform hover:scale-[1.02]`}
              whileTap={{ scale: 0.98 }}
            >
              <UploadCloud size={20} />
              Upload CSV File
              <input
                id="csvUpload"
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </motion.label>
            <p className={`text-xs ${theme.textMuted} text-center -mt-3`}>
              CSV: features in initial columns, label in the last column.
            </p>
          </motion.section>

          {/* CARD 2: Model Saving Options */}
          <motion.section
            variants={cardItemVariants}
            className={`p-6 sm:p-8 rounded-2xl ${theme.cardAlt} border ${theme.divider} shadow-2xl flex flex-col space-y-5`} // Unified space-y
          >
            <div className="flex items-center gap-2 mb-1">
              <Save size={20} className={`text-${theme.accentSecondary}-400`} />{" "}
              {/* Changed Icon size */}
              <h2 className={`text-xl font-semibold ${theme.textPrimary}`}>
                Model Saving Options
              </h2>
            </div>
            <DarkGlowToggle
              enabled={saveAfter}
              setEnabled={setSaveAfter}
              label="Save Model After Training"
            />
            <AnimatePresence>
              {saveAfter && (
                <motion.div
                  key="filename-input-motion"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: "0.5rem" }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden" // Added for smoother animation
                >
                  <DarkFloatInput
                    id="filename"
                    label="Filename" // Simpler label
                    value={filename}
                    setValue={setFilename}
                    className="mt-2" // Margin for when it appears
                  />
                  <p className={`text-xs ${theme.textMuted} mt-1 ml-1`}>
                    No extension. Saved in project's /models folder.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>
      </motion.div>

      {/* Navigation Buttons (remains same) */}
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
          onClick={() => {
            if (!data.trim() || !labels.trim()) {
              alert(
                "Please provide both feature data and labels, or upload a CSV file."
              );
              return;
            }
            onContinue();
          }}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-${theme.accent}-500 to-${theme.accent}-600 ${theme.textPrimary} hover:from-${theme.accent}-400 hover:to-${theme.accent}-500 shadow-lg hover:shadow-${theme.accent}-500/40 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-${theme.accent}-400 focus:ring-offset-2 focus:ring-offset-slate-900`}
          whileHover={{
            y: -2,
            scale: 1.03,
            transition: { type: "spring", stiffness: 300, damping: 15 },
          }}
          whileTap={{ scale: 0.97 }}
        >
          Continue to Review <ArrowRightCircle size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}
