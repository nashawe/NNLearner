import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

/* ─── intro animation from SettingsPage ─── */
const staggerKids = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, type: "spring", stiffness: 220 },
  }),
};
const rippleAnim = {
  initial: { scale: 0, opacity: 0.35 },
  animate: {
    scale: 3,
    opacity: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* -------- floating label field -------- */
const FloatingInput = ({
  label,
  as = "input",
  id,
  value,
  setValue,
  ...props
}) => {
  const Tag = as;
  return (
    <div className="relative mt-4">
      <Tag
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="peer block w-full border rounded-md px-3 pt-5 pb-2 bg-transparent focus:border-indigo-500 focus:ring-0"
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute text-sm left-3 top-2 text-gray-500 transition-all peer-focus:text-xs peer-focus:-top-1 peer-focus:text-indigo-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400"
      >
        {label}
      </label>
    </div>
  );
};

/* -------- save-model pill -------- */
const PillToggle = ({ enabled, setEnabled, id }) => (
  <button
    id={id}
    onClick={() => setEnabled(!enabled)}
    className={`mt-4 px-4 py-1 rounded-full border transition select-none ${
      enabled
        ? "bg-indigo-600 text-white border-indigo-600 shadow"
        : "bg-white text-gray-600"
    }`}
  >
    Save model
  </button>
);

export default function PayloadPage({ onBack, onContinue, onSave }) {
  const [data, setData] = useState("");
  const [labels, setLabels] = useState("");
  const [saveAfter, setSaveAfter] = useState(false);
  const [filename, setFilename] = useState("");
  const [exitCurtain, setExitCurtain] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const txt = evt.target.result.trim();
      const lines = txt.split(/\r?\n/).filter(Boolean);
      const features = lines.map((l) => {
        const cols = l.split(",").map((s) => s.trim());
        return cols.slice(0, -1).join(",");
      });
      const lbls = lines.map((l) => {
        const cols = l.split(",").map((s) => s.trim());
        return cols.at(-1);
      });
      setData(features.join("\n"));
      setLabels(lbls.join(","));
    };
    reader.readAsText(file);
  };

  /* push the payload up to ArchitecturePage whenever it changes */
  useEffect(() => {
    onSave?.({ data, labels, saveAfter, filename });
  }, [data, labels, saveAfter, filename, onSave]);

  return (
    <motion.div
      className="relative h-[calc(100vh-90px)] w-full bg-gray-50 text-gray-900 flex flex-col items-center overflow-hidden p-6"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
    >
      {/* PAGE CONTENT WRAPPER */}
      <div className="w-full max-w-5xl flex flex-col flex-1">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 px-2 pb-4 text-sm font-medium">
          <button
            onClick={onBack}
            className="flex items-center gap-1 hover:text-gray-600"
          >
            <ArrowLeftCircle size={18} /> Settings
          </button>
          <span className="opacity-50">→</span>
          <span className="font-bold">Data</span>
        </div>

        {/* CARDS */}
        <motion.div className="grid w-full gap-6 md:grid-cols-2">
          {/* DATA CARD */}
          <motion.section
            custom={0}
            variants={staggerKids}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col"
          >
            <h2 className="font-semibold text-lg">Features</h2>
            <FloatingInput
              as="textarea"
              id="data"
              label="Paste data lines"
              rows={8}
              placeholder=" "
              value={data}
              setValue={setData}
            />
            <p className="text-xs text-gray-500 mt-1">
              Each line = one record, comma-separated.
            </p>

            <FloatingInput
              id="labels"
              label="Label row"
              placeholder=" "
              value={labels}
              setValue={setLabels}
            />
            <p className="text-xs text-gray-500 mt-1">
              Single line, comma-separated, matches record count.
            </p>

            <p className="text-sm text-gray-500 mt-6 text-center">— or —</p>

            <motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              htmlFor="csvUpload"
              className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white cursor-pointer shadow hover:shadow-lg transition"
            >
              <ArrowRightCircle size={18} />
              Upload CSV
              <input
                id="csvUpload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </motion.label>
          </motion.section>

          {/* FILE OPTIONS CARD */}
          <motion.section
            custom={2}
            variants={staggerKids}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col"
          >
            <h2 className="font-semibold text-lg">File options</h2>
            <PillToggle
              id="saveAfter"
              enabled={saveAfter}
              setEnabled={setSaveAfter}
            />
            <AnimatePresence>
              {saveAfter && (
                <motion.div
                  key="filename-input"
                  custom={0.5}
                  variants={staggerKids}
                  className="mt-4"
                >
                  <FloatingInput
                    id="filename"
                    label="File name"
                    placeholder=" "
                    value={filename}
                    setValue={setFilename}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Model saved under /models.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </motion.div>
      </div>

      {/* nav buttons */}
      <div className="absolute bottom-6 right-6 flex gap-4">
        {["Back", "Continue"].map((btn) => (
          <motion.button
            key={btn}
            onClick={btn === "Back" ? onBack : onContinue}
            className={`relative overflow-hidden px-5 py-2 rounded-full text-sm font-semibold ${
              btn === "Back" ? "border bg-white" : "bg-gray-900 text-white"
            }`}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            {btn === "Back" ? (
              <>
                <ArrowLeftCircle size={20} className="inline mr-1" /> Back
              </>
            ) : (
              <>
                Continue <ArrowRightCircle size={20} className="inline ml-1" />
              </>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
