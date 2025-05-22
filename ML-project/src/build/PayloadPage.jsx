// src/pages/PayloadPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  UploadCloud,
  Save,
  FileText,
  Lock,
} from "lucide-react";

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
  accentRGB: "14, 165, 233", // For DarkFloatInputBase label active color
  accentSecondary: "emerald",
  divider: "border-slate-700",
  disabledBg: "bg-slate-700/40",
  disabledBorder: "border-slate-600/40",
  disabledText: "text-slate-500 cursor-not-allowed",
};

// --- Custom Dark Themed Floating Input Components (Self-contained or common) ---
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
  // Assuming cards are on theme.cardAlt which is slate-800/70 over slate-950.
  // For a consistent cutout, the label's backgroundColor should match the card's solid part or effective color.
  // A simpler, more robust approach is a solid color from the card background if blur isn't critical for the label itself.
  const labelBgColor = "rgb(30, 41, 59)"; // slate-800 solid equivalent, good for cards with theme.cardAlt (bg-slate-800/70)
  // Change if your card background is different and the "cutout" effect matters.

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

const DarkFloatTextarea = ({
  label,
  id,
  value,
  setValue,
  rows = 3,
  className = "",
  disabled = false,
}) => {
  // Defaulted rows to 3 for compactness
  return (
    <DarkFloatInputBase
      label={label}
      id={id}
      value={value}
      wrapperClassName={className}
      disabled={disabled}
    >
      <textarea
        value={value}
        onChange={(e) => !disabled && setValue(e.target.value)}
        rows={rows}
        placeholder=""
        disabled={disabled}
        className={`peer block w-full border rounded-lg min-h-[80px] 
                    ${
                      disabled
                        ? `${theme.disabledBg} ${theme.disabledBorder} ${theme.disabledText}`
                        : `${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} hover:border-${theme.accent}-500/50 focus:${theme.inputFocusBorder} focus:ring-1 focus:ring-${theme.accent}-400`
                    }
                    outline-none transition-colors text-sm scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent resize-y`}
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
  disabled = false,
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
        placeholder=""
        disabled={disabled}
        className={`peer block w-full border rounded-lg 
                    ${
                      disabled
                        ? `${theme.disabledBg} ${theme.disabledBorder} ${theme.disabledText}`
                        : `${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} hover:border-${theme.accent}-500/50 focus:${theme.inputFocusBorder} focus:ring-1 focus:ring-${theme.accent}-400`
                    }
                    outline-none transition-colors text-sm`}
      />
    </DarkFloatInputBase>
  );
};

const DarkGlowToggle = ({ enabled, setEnabled, label, disabled = false }) => {
  return (
    <div
      className={`flex flex-col mt-1 ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {" "}
      {/* Reduced opacity for disabled parent */}
      <div className="flex items-center justify-between mb-1">
        <span
          className={`text-sm font-medium ${
            disabled ? theme.disabledText : theme.textPrimary
          }`}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <motion.div
          onClick={() => !disabled && setEnabled(!enabled)}
          className={`relative w-14 h-7 rounded-full flex items-center p-1 transition-colors duration-300 ease-in-out shadow-inner
                      ${
                        disabled
                          ? theme.disabledBg + " border " + theme.disabledBorder
                          : enabled
                          ? `bg-gradient-to-r from-${theme.accentSecondary}-500 to-${theme.accentSecondary}-600 border border-${theme.accentSecondary}-400`
                          : `${theme.inputBg} border border-slate-600 hover:bg-slate-600`
                      }
                      ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <motion.div
            className="w-5 h-5 bg-white rounded-full shadow-lg"
            animate={{ x: enabled ? "1.5rem" : "0.125rem" }}
            transition={{ type: "spring", stiffness: 700, damping: 35 }}
          />
        </motion.div>
        <span
          className={`text-xs font-medium ${
            enabled && !disabled
              ? `text-${theme.accentSecondary}-300`
              : theme.textMuted
          } ${disabled ? "!text-slate-600" : ""}`}
        >
          {" "}
          {/* Overwrite muted if disabled */}
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </div>
    </div>
  );
};

export default function PayloadPage({
  onBack,
  onContinue,
  onSave,
  initialPayload = {},
  isPresetMode = false,
}) {
  const [data, setData] = useState(initialPayload.data ?? "");
  const [labels, setLabels] = useState(initialPayload.labels ?? "");
  const [saveAfter, setSaveAfter] = useState(initialPayload.saveAfter ?? false);
  const [filename, setFilename] = useState(initialPayload.filename ?? "");

  useEffect(() => {
    setData(initialPayload.data ?? "");
    setLabels(initialPayload.labels ?? "");
    setSaveAfter(initialPayload.saveAfter ?? false);
    setFilename(initialPayload.filename ?? "");
  }, [initialPayload]);

  const handleFileUpload = (e) => {
    if (isPresetMode) {
      alert("File upload is disabled in preset mode.");
      return;
    }
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
            throw new Error(`Line "${l}" has fewer than 2 columns.`);
          if (cols.length === 1 && lines.length > 1)
            throw new Error(`Line "${l}" seems to have only one value.`);
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
          `Error processing file: ${error.message}. Please ensure CSV has features, then label in last column. No headers.`
        );
      }
    };
    reader.onerror = () => alert("Error reading file.");
    reader.readAsText(file);
    if (e.target) e.target.value = null;
  };

  useEffect(() => {
    if (onSave && !isPresetMode) {
      onSave({ data, labels, saveAfter, filename });
    }
  }, [data, labels, saveAfter, filename, onSave, isPresetMode]);

  const pageVariants = {
    initial: { opacity: 0, x: "-5%" },
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
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };
  const cardItemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 24 },
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
          <ArrowLeftCircle size={18} /> Back to Settings{" "}
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
        {isPresetMode && (
          <motion.div
            variants={cardItemVariants} // Also animate this banner
            className={`lg:col-span-2 mb-6 p-3.5 rounded-lg bg-${theme.accent}-800/30 border border-${theme.accent}-700 text-${theme.accent}-200 text-sm flex items-center gap-2 shadow-md`}
          >
            <Lock size={16} /> Preset data loaded. Manual data input and file
            upload are disabled.
          </motion.div>
        )}
        {/* Grid will be fully disabled by pointer-events if isPresetMode */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start ${
            isPresetMode ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <motion.section
            variants={cardItemVariants}
            className={`p-6 sm:p-8 rounded-2xl ${theme.cardAlt} border ${theme.divider} shadow-2xl flex flex-col space-y-5`}
          >
            <div className="flex items-center gap-2 mb-1">
              <FileText size={24} className={`text-${theme.accent}-400`} />{" "}
              <h2 className={`text-xl font-semibold ${theme.textPrimary}`}>
                Input Features & Labels
              </h2>
            </div>
            <DarkFloatTextarea
              id="data-textarea"
              label="Feature Data (CSV rows, no header/labels)"
              value={data}
              setValue={setData}
              disabled={isPresetMode}
            />
            <p className={`text-xs ${theme.textMuted} -mt-3 ml-1`}>
              One sample per line, comma-separated values.
            </p>
            <DarkFloatInput
              id="labels-input"
              label="Labels (comma-separated, single line)"
              value={labels}
              setValue={setLabels}
              className="mt-1"
              disabled={isPresetMode}
            />
            <p className={`text-xs ${theme.textMuted} -mt-3 ml-1`}>
              Order must match data samples. No header.
            </p>
            <div className="flex items-center gap-4 pt-3">
              {" "}
              <div className={`h-px flex-grow ${theme.divider}`}></div>{" "}
              <span className={`${theme.textMuted} text-sm`}>OR</span>{" "}
              <div className={`h-px flex-grow ${theme.divider}`}></div>{" "}
            </div>
            <motion.label
              htmlFor="csvUpload"
              className={`w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-gradient-to-r from-${
                theme.accent
              }-600 to-${theme.accent}-500 ${
                theme.textPrimary
              } font-medium shadow-lg 
                          ${
                            isPresetMode
                              ? "opacity-50 cursor-not-allowed !from-slate-600 !to-slate-500"
                              : `cursor-pointer hover:from-${theme.accent}-500 hover:to-${theme.accent}-400 transition-all duration-200 ease-out transform hover:scale-[1.02]`
                          }`}
              whileTap={!isPresetMode ? { scale: 0.98 } : {}}
            >
              <UploadCloud size={20} /> Upload CSV File
              <input
                id="csvUpload"
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isPresetMode}
              />
            </motion.label>
            <p className={`text-xs ${theme.textMuted} text-center -mt-3`}>
              CSV format: features in initial columns, label in the last column.
              No headers.
            </p>
          </motion.section>

          <motion.section
            variants={cardItemVariants}
            className={`p-6 sm:p-8 rounded-2xl ${theme.cardAlt} border ${theme.divider} shadow-2xl flex flex-col space-y-6`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Save size={20} className={`text-${theme.accentSecondary}-400`} />{" "}
              <h2 className={`text-xl font-semibold ${theme.textPrimary}`}>
                Model Saving Options
              </h2>
            </div>
            <DarkGlowToggle
              enabled={saveAfter}
              setEnabled={setSaveAfter}
              label="Save Model After Training"
              disabled={isPresetMode}
            />
            <AnimatePresence>
              {saveAfter && (
                <motion.div
                  key="filename-input-motion"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: "0.75rem" }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <DarkFloatInput
                    id="filename"
                    label="Filename (e.g., my_model)"
                    value={filename}
                    setValue={setFilename}
                    className="mt-2"
                    disabled={isPresetMode || !saveAfter}
                  />
                  <p className={`text-xs ${theme.textMuted} mt-1 ml-1`}>
                    No extension. Saved in project's designated /models folder.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {isPresetMode &&
              filename && ( // Use local state 'filename' for consistency
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className={`text-sm font-medium ${theme.textPrimary}`}>
                    Preset Model Filename:
                  </p>
                  <p
                    className={`text-sm ${theme.textMuted} font-mono bg-slate-700/50 px-2 py-1 rounded inline-block mt-1`}
                  >
                    {filename}.npz
                  </p>
                </div>
              )}
          </motion.section>
        </div>
      </motion.div>

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
            if (!isPresetMode && (!data.trim() || !labels.trim())) {
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
