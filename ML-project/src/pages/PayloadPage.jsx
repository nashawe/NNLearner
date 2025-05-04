import React, { useState } from "react";
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
React.useEffect(() => {
  onSave?.({ data, labels, saveAfter, filename });
}, [data, labels, saveAfter, filename]);

export default function PayloadPage({ onBack, onContinue }) {
  const [data, setData] = useState("");
  const [labels, setLabels] = useState("");
  const [saveAfter, setSaveAfter] = useState(false);
  const [filename, setFilename] = useState("");
  const [exitCurtain, setExitCurtain] = useState(false);

  return (
    <motion.div
      className="relative p-6 flex flex-col h-[calc(100vh-90px)] bg-gray-50 text-gray-900 overflow-hidden"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
    >
      {/* breadcrumb */}
      <div className="flex gap-2 items-center px-6 pb-3 text-sm font-medium">
        <button
          onClick={onBack}
          className="flex items-center gap-1 hover:text-gray-600"
        >
          <ArrowLeftCircle size={18} /> Settings
        </button>
        <span className="opacity-50">→</span>
        <span className="font-bold">Data</span>
      </div>
      <motion.div className="grid gap-6 xl:grid-cols-3 md:grid-cols-2">
        {/* DATA CARD */}
        <motion.section
          custom={0}
          variants={staggerKids}
          className="bg-white shadow-lg rounded-lg p-6 flex flex-col"
        >
          <h2 className="font-semibold text-lg">CSV Data</h2>
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
            Each line represent a record. Comma-separated.
          </p>
        </motion.section>

        {/* LABEL CARD */}
        <motion.section
          custom={1}
          variants={staggerKids}
          className="bg-white shadow-lg rounded-lg p-6 flex flex-col"
        >
          <h2 className="font-semibold text-lg">Labels</h2>
          <FloatingInput
            id="labels"
            label="Label row"
            placeholder=" "
            value={labels}
            setValue={setLabels}
          />
          <p className="text-xs text-gray-500 mt-1">
            Single line, comma-separated, matching data columns.
          </p>
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
                custom={3}
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
                  Model gon’ save under /models.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </motion.div>

      {/* nav buttons */}
      <div className="fixed bottom-6 right-6 flex gap-4">
        {["Back", "Continue"].map((btn, idx) => (
          <motion.button
            key={btn}
            onClick={() => {
              if (btn === "Back") onBack();
              else {
                onContinue();
              }
            }}
            className={`relative overflow-hidden px-5 py-2 rounded-full text-sm font-semibold ${
              btn === "Back" ? "border bg-white" : "bg-gray-900 text-white"
            }`}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <AnimatePresence>
              <motion.span
                className="absolute inset-0 opacity-0"
                variants={{ hover: rippleAnim }}
              >
                <motion.span
                  variants={rippleAnim}
                  className="absolute left-1/2 top-1/2 w-1 h-1 bg-current rounded-full"
                />
              </motion.span>
            </AnimatePresence>
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
