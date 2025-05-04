/* ───────── src/pages/SettingsPage.jsx ─────────
   fixes:
   • dropped custom thumb overlay → plain sliders
   • Dropout toggle no longer inflates
   • batch-size dropdown sits first in General Trainin’
   • three-column grid so every box fits without scroll (1080 p tall)
*/
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

/* ─── helpers ─── */
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

/* plain slider */
const BasicSlider = ({ value, setValue, min, max, step }) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value}
    onChange={(e) => setValue(parseFloat(e.target.value))}
    className="w-full accent-orange-500"
  />
);

/* fly-in select */
function FlySelect({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border rounded flex justify-between items-center bg-white"
      >
        {value}
        <span className="text-xs">&#9662;</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute z-20 mt-1 w-full bg-white border rounded shadow"
          >
            {options.map((opt) => (
              <motion.li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                whileHover={{ scale: 1.03 }}
                className={`px-3 py-2 cursor-pointer ${
                  value === opt ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                {opt}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Dropout toggle - slim, no layout-shift */
function GlowToggle({ enabled, setEnabled }) {
  return (
    <div
      onClick={() => setEnabled(!enabled)}
      className={`relative w-12 h-6 rounded-full cursor-pointer flex items-center p-1 transition-colors ${
        enabled ? "bg-orange-500" : "bg-gray-300"
      }`}
    >
      <motion.div
        className="w-4 h-4 bg-white rounded-full shadow"
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      {enabled && (
        <motion.div
          key="halo"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.3, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-full bg-orange-400"
        />
      )}
    </div>
  );
}

/* floating label */
function FloatInput({ label, children }) {
  const [focus, setFocus] = useState(false);
  return (
    <div
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      className="relative flex flex-col pt-6"
    >
      <motion.label
        animate={
          focus ? { y: -10, scale: 1, color: "#000" } : { y: -5, scale: 0.85 }
        }
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="absolute left-0 top-2 text-gray-500 pointer-events-none origin-left"
      >
        {label}
      </motion.label>
      {children}
    </div>
  );
}

export default function SettingsPage({ onBack, onContinue, onSave }) {
  const [mode, setMode] = useState("1 - Sigmoid + Mean Squared Error");
  const [learningRate, setLearningRate] = useState(0.01);
  const [epochs, setEpochs] = useState(1000);
  const [batchSize, setBatchSize] = useState(1);
  const [useDropout, setUseDropout] = useState(false);
  const [dropout, setDropout] = useState(0.2);
  const [weightInit, setWeightInit] = useState("Random");
  const [optimizer, setOptimizer] = useState("SGD");

  const [badge, setBadge] = useState(null);
  const showBadge = (txt) => {
    setBadge(txt);
    clearTimeout(window.__badgeTimer);
    window.__badgeTimer = setTimeout(() => setBadge(null), 1200);
  };

  // onSave effect
  React.useEffect(() => {
    onSave?.({
      mode,
      learningRate,
      epochs,
      batchSize,
      useDropout,
      dropout,
      weightInit,
      optimizer,
    });
  }, [
    mode,
    learningRate,
    epochs,
    batchSize,
    useDropout,
    dropout,
    weightInit,
    optimizer,
  ]);

  return (
    <motion.div className="relative w-full h-[calc(100vh-90px)] overflow-hidden bg-gray-50 text-gray-900">
      {/* breadcrumb */}
      <div className="flex gap-2 items-center px-6 py-3 text-sm font-medium">
        <button
          onClick={onBack}
          className="flex items-center gap-1 hover:text-gray-600"
        >
          <ArrowLeftCircle size={18} /> Architecture
        </button>
        <span className="opacity-50">→</span>
        <span className="font-bold">Settings</span>
      </div>

      {/* grid -- three columns, no scroll required on 1080 p  */}
      <motion.div
        className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 px-6"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="show"
      >
        {/* Mode (full first row) */}
        <motion.div
          custom={0}
          variants={staggerKids}
          className="lg:col-span-3 p-4 rounded-2xl bg-white shadow-md"
        >
          <h2 className="text-lg font-semibold mb-3">
            Mode (Activation + Loss)
          </h2>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {[
              "1 - Sigmoid + Mean Squared Error (Regression / simple binary)",
              "2 - Sigmoid + Binary Cross-Entropy (Probabilistic binary)",
              "3 - Tanh + Mean Squared Error (Outputs -1 ↔ 1)",
              "4 - ReLU (hidden) + Sigmoid (output) + Binary Cross-Entropy (Deep, fast)",
              "5 - ReLU (hidden) + Softmax (output) + Cross-Entropy (Multiclass)",
            ].map((opt) => (
              <label
                key={opt}
                className={`p-3 border rounded-xl cursor-pointer transition text-sm ${
                  mode === opt ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  className="sr-only"
                  value={opt}
                  checked={mode === opt}
                  onChange={() => {
                    setMode(opt);
                    showBadge(opt.split(" ")[0]);
                  }}
                />
                {opt}
              </label>
            ))}
          </div>
        </motion.div>

        {/* General Trainin’ */}
        <motion.div
          custom={1}
          variants={staggerKids}
          className="p-4 rounded-2xl bg-white shadow-md flex flex-col gap-4"
        >
          <h2 className="text-base font-semibold">General Training</h2>

          {/* Batch first so dropdown visible */}
          <FloatInput label="Batch Size">
            <FlySelect
              value={batchSize}
              options={[1, 8, 16, 32, 64, 128]}
              onChange={(v) => {
                setBatchSize(v);
                showBadge(`Batch Size: ${v}`);
              }}
            />
            <span className="text-[11px] opacity-60 mt-1">
              1 → feed samples one-by-one
            </span>
          </FloatInput>

          {/* learning rate */}
          {/* learning rate */}
          <label className="flex flex-col gap-2">
            <span>Learning Rate</span>
            <input
              type="number"
              step="0.001"
              min={0.0001}
              max={0.1}
              value={learningRate}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setLearningRate(v);
                showBadge(`Learning Rate: ${v.toFixed(3)}`);
              }}
              className="border px-3 py-2 rounded w-full bg-white"
            />
          </label>
          {/* epochs */}
          <FloatInput label="Epochs">
            <input
              type="number"
              min={1}
              value={epochs}
              onChange={(e) => {
                setEpochs(parseInt(e.target.value));
                showBadge(`Epochs: ${e.target.value}`);
              }}
              className="border px-3 py-2 rounded w-full bg-white"
            />
          </FloatInput>
        </motion.div>

        {/* Reg + Init */}
        <motion.div
          custom={2}
          variants={staggerKids}
          className="p-4 rounded-2xl bg-white shadow-md flex flex-col gap-4"
        >
          <h2 className="text-base font-semibold">Regularization & Init</h2>

          <div className="flex items-center gap-4">
            <span className="font-medium">Dropout</span>
            <GlowToggle
              enabled={useDropout}
              setEnabled={(v) => {
                setUseDropout(v);
                showBadge(v ? "Dropout ON" : "Dropout OFF");
              }}
            />
          </div>

          <AnimatePresence>
            {useDropout && (
              <motion.div
                key="dropSlider"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <FloatInput label="Dropout Rate">
                  <BasicSlider
                    value={dropout}
                    setValue={(v) => {
                      setDropout(v);
                      showBadge(`Dropout Rate: ${v}`);
                    }}
                    min={0}
                    max={0.9}
                    step={0.01}
                  />
                </FloatInput>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <span className="block mb-1 font-medium">Weight Init</span>
            <div className="flex gap-3 flex-wrap">
              {["He", "Random", "Xavier"].map((opt) => (
                <label key={opt} className="relative cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="weightInit"
                    value={opt}
                    checked={weightInit === opt}
                    onChange={() => {
                      setWeightInit(opt);
                      showBadge(opt);
                    }}
                    className="peer sr-only"
                  />
                  <span
                    className={`px-3 py-1 border rounded-full ${
                      weightInit === opt
                        ? "bg-gray-900 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Optimizer */}
        <motion.div
          custom={3}
          variants={staggerKids}
          className="p-4 rounded-2xl bg-white shadow-md flex flex-col gap-4"
        >
          <h2 className="text-base font-semibold">Optimizer</h2>
          <FlySelect
            value={optimizer}
            options={["SGD", "Adam", "RMSProp"]}
            onChange={(v) => {
              setOptimizer(v);
              showBadge(v);
            }}
          />
        </motion.div>
      </motion.div>

      {/* live badge */}
      <AnimatePresence>
        {badge && (
          <motion.span
            key="liveBadge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-1 rounded-full shadow-lg pointer-events-none"
          >
            {badge}
          </motion.span>
        )}
      </AnimatePresence>

      {/* nav buttons */}
      <div className="fixed bottom-6 right-6 flex gap-4">
        {["Back", "Continue"].map((btn) => (
          <motion.button
            key={btn}
            onClick={() => {
              if (btn === "Back") onBack();
              else onContinue();
            }}
            className={`relative overflow-hidden px-5 py-2 rounded-full text-sm font-semibold ${
              btn === "Back" ? "border bg-white" : "bg-gray-900 text-white"
            }`}
            whileHover="hover"
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
                <ArrowLeftCircle size={20} className="inline mr-1 " /> Back
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
