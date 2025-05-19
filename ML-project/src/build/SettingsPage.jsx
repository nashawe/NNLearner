/* ───────── src/build/SettingsPage.jsx ─────────
   fixes:
   • dropped custom thumb overlay → plain sliders
   • Dropout toggle no longer inflates
   • batch-size dropdown sits first in General Training
   • three-column grid so every box fits without scroll (1080 p tall)
*/
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftCircle, ArrowRightCircle, Info } from "lucide-react";

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

const settingDescriptions = {
  LearningRateScheduler: [
    "Adjusts learning rate during training.",
    "Starts high, then lowers it over time.",
    "Helps model learn faster at first, then fine-tune.",
    "Good for complex models or large datasets.",
    "Can help avoid overshooting the best weights.",
  ],
  learningRate: [
    "Controls how big each training step is.",
    "Too high? Model might overshoot.",
    "Too low? Training is super slow.",
    "Try values like 0.01 or 0.001.",
  ],
  dropout: [
    "Temporarily 'drops' random neurons during training.",
    "Prevents overfitting by forcing robustness.",
    "Only applies during training, not predicting after the model is trained.",
    "If your data set is small, this will help prevent the model from just memorizing the training data.",
  ],
  weightInit: [
    "How your network starts its weights.",
    "Better init = faster and more stable training.",
    "Surprisingly, this setting impacts training quality a lot.",
    "Xavier works well for sigmoid/tanh, He is better for ReLU.",
    "Random usually does NOT work well and is mostly there for testing and seeing the difference between weight inits.",
  ],
  optimizer: [
    "Controls how weights update during training.",
    "SGD is simple, Adam is smarter with momentum + adaptive steps.",
    "Adam works great for most tasks.",
  ],
  batchSize: [
    "How many samples are processed before the model updates its weights.",
    "Smaller = slower training but more precise updates (can help generalization).",
    "Larger = faster training but may converge to worse minima or overfit.",
    "Common values: 16, 32, 64 — balance speed, stability, and memory usage.",
    "Also affects how smooth or noisy the loss curve is.",
  ],
};

function InfoButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="ml-1 bg-transparent rounded-full hover:bg-gray-300"
    >
      <Info size={18} />
    </button>
  );
}

const modeDescriptions = {
  1: [
    "Mainly for educational purposes because of simplicity.",
    "Uses sigmoid to squish values into a 0-1 range.",
    "Not ideal for deep nets — can get slow or stuck learning.",
    "Is usually quite slow, but it is a good example of the most basic model mode.",
    "Best for: teaching basic neural nets or visualizing how backprop works step-by-step.",
  ],
  2: [
    "Uses sigmoid + Binary Cross-Entropy for better yes/no probability learning.",
    "Better at handling uncertainty than MSE.",
    "Perfect for any binary question (eg. cat vs. not a cat).",
    "BCE is a bit more complicated than MSE, but way more stable for binary tasks.",
    "Best for: clean binary classification datasets like moons, spam detection, or medical diagnosis (yes/no).",
  ],
  3: [
    "Tanh gives outputs from -1 to 1 instead of 0-1 (unlike sigmoid).",
    "Still uses MSE to measure loss.",
    "Good if your data has negative values or you want symmetric activation.",
    "Works for stuff that require direction.",
    "One example is automated driving: if output is negative, car will turn left. If positive, it will turn right.",
    "Best for: tasks where outputs have natural directionality, like steering, movement control, or joystick prediction.",
  ],
  4: [
    "ReLU in hidden layers speeds up learning and avoids small gradients.",
    "Ends with sigmoid + BCE, so outputs are clear probabilities.",
    "Watch out: ReLUs can die if the learning rate's too high.",
    "Great for deeper and non-linear binary classifiers.",
    "Best for: modern binary classifiers with complex data — like image classification (dog vs. not dog), sentiment analysis, etc.",
  ],
  5: [
    "This is specifically for multi-class classification.",
    "ReLU hidden layers + Softmax output for multi-class percentages.",
    "Cross-Entropy loss pairs perfectly with softmax.",
    "Use when you've got more than two choices (digits 0-9, categories, etc.).",
    "Industry standard for most classification problems.",
    "Best for: MNIST digit recognition, language models, facial expression classification, etc.",
  ],
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
  const [mode_id, setMode_id] = useState(null);
  const [learningRate, setLearningRate] = useState(0.001);
  const [epochs, setEpochs] = useState(null);
  const [batchSize, setBatchSize] = useState(32);
  const [useDropout, setUseDropout] = useState(false);
  const [dropout, setDropout] = useState(null);
  const [weightInit, setWeightInit] = useState(null);
  const [optimizer, setOptimizer] = useState(null);
  const [useLrScheduler, setUseLrScheduler] = useState(false);
  const [settingInfoId, setSettingInfoId] = useState(null);

  const [badge, setBadge] = useState(null);
  const showBadge = (txt) => {
    setBadge(txt);
    clearTimeout(window.__badgeTimer);
    window.__badgeTimer = setTimeout(() => setBadge(null), 1200);
  };

  const [infoId, setInfoId] = useState(null);

  const optimizerMap = {
    SGD: 1,
    RMSProp: 2,
    Adam: 3,
  };

  const reverseMap = {
    1: "SGD",
    2: "RMSProp",
    3: "Adam",
  };

  const weightInitMap = {
    Random: 1,
    Xavier: 2,
    He: 3,
  };

  const reverseWeightInitMap = {
    1: "Random",
    2: "Xavier",
    3: "He",
  };

  // onSave effect
  React.useEffect(() => {
    onSave?.({
      mode_id,
      learningRate,
      epochs,
      batchSize,
      useDropout,
      dropout,
      weightInit,
      optimizer,
      useLrScheduler,
    });
  }, [
    mode_id,
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
          <h2 className="text-lg font-bold mb-3">Mode (Activation + Loss)</h2>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {[
              "1 - Sigmoid + Mean Squared Error",
              "2 - Sigmoid + Binary Cross-Entropy",
              "3 - Tanh + Mean Squared Error",
              "4 - ReLU + Sigmoid + Binary Cross-Entropy",
              "5 - ReLU + Softmax + Cross-Entropy",
            ].map((opt) => {
              const id = parseInt(opt.split(" ")[0], 10);
              const isSelected = mode_id === id;
              return (
                <div key={id} className="relative group">
                  <label
                    className={`
                      flex items-center p-3 border rounded-xl cursor-pointer transition
                      ${
                        isSelected
                          ? "bg-gray-800 text-white shadow-lg"
                          : "bg-white text-black hover:bg-gray-100"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="mode_id"
                      className="sr-only"
                      value={id}
                      checked={isSelected}
                      onChange={() => {
                        setMode_id(id);
                        showBadge(`Mode: ${id}`);
                      }}
                    />
                    <span className="truncate whitespace-nowrap">{opt}</span>
                  </label>
                  <button
                    onClick={() => setInfoId(id)}
                    className="
                       group-hover:block absolute top-2 right-2
                      bg-transparent text-gray-700 p-1 rounded-full
                      hover:bg-gray-300
                    "
                  >
                    <Info size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence>
          {infoId !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="relative bg-white w-3/4 max-w-lg max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-2xl"
              >
                <button
                  onClick={() => setInfoId(null)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
                >
                  ×
                </button>
                <h3 className="text-xl font-bold mb-4">
                  {[
                    "1 - Sigmoid + Mean Squared Error",
                    "2 - Sigmoid + Binary Cross-Entropy",
                    "3 - Tanh + Mean Squared Error",
                    "4 - ReLU (hidden) + Sigmoid (output) + Binary Cross-Entropy",
                    "5 - ReLU (hidden) + Softmax (output) + Cross-Entropy",
                  ].find((o) => parseInt(o.split(" ")[0], 10) === infoId)}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  {modeDescriptions[infoId].map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <motion.div
          custom={1}
          variants={staggerKids}
          className="p-4 rounded-2xl bg-white shadow-md flex flex-col"
        >
          <h2 className="text-base font-bold">General Training</h2>

          {/* Batch size dropdown */}
          <FloatInput>
            <span className="pb-2">Batch Size</span>
            <FlySelect
              value={batchSize}
              options={[1, 8, 16, 32, 64, 128]}
              onChange={(v) => {
                setBatchSize(v);
                showBadge(`Batch Size: ${v}`);
              }}
            />
            <span className="text-[11px] opacity-60 pt-3">
              1 → feed samples one-by-one
            </span>
          </FloatInput>

          {/* epochs */}
          <FloatInput>
            <span className="pb-2">Epochs</span>
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

        {/* Algo and Dropout */}
        <motion.div
          custom={2}
          variants={staggerKids}
          className="p-4 rounded-2xl bg-white shadow-md flex flex-col gap-4"
        >
          <h2 className="text-base font-bold">Algorithms and Dropout</h2>
          {/* optimizer */}
          <div>
            <div className="flex items-center">
              <span className="pr-3">Optimizer </span>
              <button
                onClick={() => setSettingInfoId("optimizer")}
                className="top-2 right-2 
                bg-transparent text-gray-700 p-1 rounded-full
                hover:bg-gray-300"
              >
                <Info size={18} />
              </button>
            </div>
            <div className="flex gap-3 flex-wrap pt-3 pb-4">
              {["SGD", "RMSProp", "Adam"].map((opt) => (
                <label key={opt} className="relative cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="optimizer"
                    value={opt}
                    checked={reverseMap[optimizer] === opt}
                    onChange={() => {
                      const val = optimizerMap[opt]; // get int from string
                      setOptimizer(val); // set optimizer to int
                      showBadge(`${opt} Optimizer`);
                    }}
                    className="peer sr-only"
                  />
                  <span
                    className={`px-3 py-1 border rounded-full ${
                      reverseMap[optimizer] === opt
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
          {/* dropout */}
          <div className="flex items-center pb-4 gap-4">
            <span className="font-medium">Dropout</span>
            <GlowToggle
              enabled={useDropout}
              setEnabled={(v) => {
                setUseDropout(v);
                showBadge(v ? "Dropout ON" : "Dropout OFF");
              }}
            />
            <div className="flex items-center">
              <button
                onClick={() => setSettingInfoId("dropout")}
                className="top-2 right-2 
                bg-transparent text-gray-700 p-1 rounded-full
                hover:bg-gray-300"
              >
                <Info size={18} />
              </button>
            </div>
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
          {/* weight init */}
          <div>
            <div className="flex items-center">
              <span>Weight Initializer </span>
              <button
                onClick={() => setSettingInfoId("weightInit")}
                className="top-2 right-2 ml-3
                bg-transparent text-gray-700 p-1 rounded-full
                hover:bg-gray-300"
              >
                <Info size={18} />
              </button>
            </div>
            <div className="flex gap-3 flex-wrap pt-3 pb-1">
              {["Random", "Xavier", "He"].map((opt) => (
                <label key={opt} className="relative cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="weightInit"
                    value={opt}
                    checked={reverseWeightInitMap[weightInit] === opt}
                    onChange={() => {
                      const w_val = weightInitMap[opt]; // get int from string
                      setWeightInit(w_val); // set weightInit to int
                      showBadge(`${opt} Weight Initializer`);
                    }}
                    className="peer sr-only"
                  />
                  <span
                    className={`px-3 py-1 border rounded-full ${
                      reverseWeightInitMap[weightInit] === opt
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

        {/* Learning Rate */}
        <motion.div
          custom={3}
          variants={staggerKids}
          className="p-4 rounded-2xl bg-white shadow-md flex flex-col gap-4"
        >
          <h2 className="text-base font-bold">Learning Rate Tuning</h2>
          <label className="flex flex-col gap-2">
            <div className="flex items-center">
              <span>Learning Rate</span>
              <button
                onClick={() => setSettingInfoId("learningRate")}
                className="top-2 right-2 ml-3
                bg-transparent text-gray-700 p-1 rounded-full
                hover:bg-gray-300"
              >
                <Info size={18} />
              </button>
            </div>
            <input
              type="number"
              step="0.001"
              value={Math.abs(learningRate)}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setLearningRate(v);
                showBadge(`Learning Rate: ${v.toFixed(3)}`);
              }}
              className="border px-3 py-2 rounded w-full bg-white"
            />
          </label>
          <div className="flex items-center gap-3 mt-2">
            <span>Use LR Scheduler</span>
            <GlowToggle
              enabled={useLrScheduler}
              setEnabled={(v) => {
                setUseLrScheduler(v);
                showBadge(v ? "Scheduler ON" : "Scheduler OFF");
              }}
            />
            <button
              onClick={() => setSettingInfoId("LearningRateScheduler")}
              className="top-2 right-2
                bg-transparent text-gray-700 p-1 rounded-full
                hover:bg-gray-300"
            >
              <Info size={18} />
            </button>
          </div>
          <span className="text-[11px] opacity-60 mt-1">
            Cosine decay from current LR → 0.0001
          </span>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {settingInfoId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative bg-white w-3/4 max-w-md p-6 rounded-lg shadow-2xl"
            >
              <button
                onClick={() => setSettingInfoId(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4 capitalize">
                {settingInfoId.replace(/([A-Z])/g, " $1")}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {settingDescriptions[settingInfoId].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              if (btn === "Back") {
                onBack();
              } else {
                const isValid =
                  mode_id !== null &&
                  epochs !== null &&
                  optimizer !== null &&
                  weightInit !== null &&
                  (!useDropout || (useDropout && dropout !== null));

                if (!isValid) {
                  setBadge("Please fill out all settings.");
                  clearTimeout(window.__badgeTimer);
                  window.__badgeTimer = setTimeout(() => setBadge(null), 1500);
                  return;
                }

                onContinue();
              }
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

      {/* Footer */}
      <div>
        <p className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-s font-medium text-gray-800">
          Be sure to click the info buttons near each setting to learn more
          about what each one does!
        </p>
      </div>
    </motion.div>
  );
}
