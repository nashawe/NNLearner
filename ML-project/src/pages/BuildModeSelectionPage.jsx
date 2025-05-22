// src/pages/BuildModeSelectionPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Blocks, BrainCircuit, CheckCircle, HardHat } from "lucide-react"; // Added PackagePlus, Tool

const theme = {
  bg: "bg-slate-950",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  accent: "violet",
  accentSecondary: "sky",
  cardBg: "bg-slate-800/60 backdrop-blur-lg", // More blur
  cardHoverBg: "hover:bg-slate-700/80", // More opaque on hover
  divider: "border-slate-700/70", // More visible divider
  buttonCustomBg: `bg-gradient-to-br from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400`,
  buttonPresetBg: `bg-gradient-to-br from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400`,
};

const presets = {
  mnistClassifier: {
    /* ... (same as before, ensure no icon component is directly here if passing full preset) ... */
    name: "MNIST Digit Classifier",
    description:
      "A pre-configured convolutional-style network ideal for image classification tasks like recognizing handwritten digits (0-9). Includes optimized settings.",
    iconComponent: BrainCircuit, // Store component separately for local rendering
    layers: [
      { id: "uuid-input-mnist", type: "input", neurons: 784 },
      { id: "uuid-hidden1-mnist", type: "hidden", neurons: 128 },
      { id: "uuid-hidden2-mnist", type: "hidden", neurons: 64 },
      { id: "uuid-output-mnist", type: "output", neurons: 10 },
    ],
    settings: {
      mode_id: 5,
      learningRate: 0.001,
      epochs: 15,
      batchSize: 64,
      useDropout: true,
      dropout: 0.3,
      weightInit: 3,
      optimizer: 3,
      useLrScheduler: true,
    },
    payload: {
      data: "PRESET_MNIST_FEATURES",
      labels: "PRESET_MNIST_LABELS",
      saveAfter: true,
      filename: "mnist_classifier_preset",
    },
  },
  xorSolver: {
    /* ... (same as before) ... */ name: "XOR Problem Solver",
    description:
      "A compact network designed to master the classic XOR logical problem—a fundamental test of a network's ability to learn non-linear relationships.",
    iconComponent: CheckCircle,
    layers: [
      { id: "uuid-input-xor", type: "input", neurons: 2 },
      { id: "uuid-hidden1-xor", type: "hidden", neurons: 5 },
      { id: "uuid-output-xor", type: "output", neurons: 1 },
    ],
    settings: {
      mode_id: 2,
      learningRate: 0.05,
      epochs: 2000,
      batchSize: 4,
      useDropout: false,
      dropout: 0,
      weightInit: 2,
      optimizer: 3,
      useLrScheduler: false,
    },
    payload: {
      data: "0,0\n0,1\n1,0\n1,1",
      labels: "0,1,1,0",
      saveAfter: true,
      filename: "xor_solver_preset",
    },
  },
};

const BuildModeSelectionPage = () => {
  const navigate = useNavigate();

  const handleSelection = (mode, presetKey = null) => {
    if (mode === "custom") {
      navigate("/build/design", {
        state: { isPresetMode: false, presetData: null },
      });
    } else if (mode === "preset" && presetKey && presets[presetKey]) {
      const selectedPreset = presets[presetKey];
      const stateToPass = {
        // Only serializable data here
        isPresetMode: true,
        presetData: {
          name: selectedPreset.name,
          layers: selectedPreset.layers,
          settings: selectedPreset.settings,
          payload: selectedPreset.payload,
        },
      };
      navigate("/build/design", { state: stateToPass });
    }
  };

  const mainCardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] },
    }, // Custom ease
    hover: {
      scale: 1.02,
      transition: { type: "spring", stiffness: 280, damping: 12 },
    },
  };

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.1, ease: "circOut" },
    },
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className={`${theme.bg} min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 pt-20 md:pt-12`}
    >
      <motion.div
        className="text-center mb-10 md:mb-14 max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
      >
        <Blocks
          size={44}
          className={`mx-auto mb-4 text-${theme.accent}-400`}
          strokeWidth={1.5}
        />
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-extrabold ${theme.textPrimary} mb-4 tracking-tight`}
        >
          Begin Your Network{" "}
          <span
            className={`bg-clip-text text-transparent bg-gradient-to-r from-${theme.accent}-400 to-${theme.accentSecondary}-400`}
          >
            Construction
          </span>
        </h1>
        <p className={`${theme.textSecondary} text-md sm:text-lg`}>
          Choose how you'd like to start: jump in with a pre-built model for
          common tasks, or forge your own path by designing a neural network
          from scratch.
        </p>
      </motion.div>

      {/* Custom Build Option - More Prominent */}
      <motion.div
        variants={mainCardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onClick={() => handleSelection("custom")}
        className={`w-full max-w-3xl mb-8 md:mb-10 p-6 sm:p-8 rounded-2xl 
                   ${theme.cardBg} border ${theme.divider} cursor-pointer 
                   flex flex-col md:flex-row items-center text-center md:text-left 
                   gap-6 group ${theme.cardHoverBg} hover:border-${theme.accentSecondary}-500/70`}
        style={{ boxShadow: `0 0 30px -5px rgba(14,165,233,0.1)` }} // Subtle initial shadow for custom card
      >
        <motion.div
          className={`p-4 bg-gradient-to-br from-${theme.accentSecondary}-600 to-${theme.accentSecondary}-700 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300`}
          whileHover={{
            boxShadow: `0 0 20px rgba(var(--color-sky-rgb,14 165 233),0.5)`,
          }}
        >
          <HardHat size={36} className="text-white" strokeWidth={2} />
        </motion.div>
        <div className="flex-1">
          <h2
            className={`text-2xl sm:text-3xl font-bold ${theme.textPrimary} mb-2 group-hover:text-${theme.accentSecondary}-300 transition-colors`}
          >
            Craft a Custom Network
          </h2>
          <p className={`${theme.textMuted} text-sm sm:text-base mb-4`}>
            Total creative freedom. Define every layer, choose each parameter,
            and upload your unique dataset to train a truly bespoke model.
          </p>
          <div
            className={`px-6 py-2.5 rounded-lg font-semibold text-white ${theme.buttonCustomBg} text-sm inline-block shadow-md group-hover:brightness-110 transition-all`}
          >
            Design From Scratch
          </div>
        </div>
      </motion.div>

      {/* Separator for Presets */}
      <motion.div
        className="w-full max-w-xl text-center my-6 md:my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span
          className={`text-sm ${theme.textMuted} tracking-wider relative px-4
                         before:content-[''] before:absolute before:left-full before:top-1/2 before:w-16 before:h-px before:bg-slate-700
                         after:content-[''] after:absolute after:right-full after:top-1/2 after:w-16 after:h-px after:bg-slate-700`}
        >
          OR USE A PRESET
        </span>
      </motion.div>

      {/* Preset Models Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        {Object.entries(presets).map(([key, preset], index) => {
          const PresetIcon = preset.iconComponent; // Get the actual component
          return (
            <motion.div
              key={key}
              variants={mainCardVariants} // Use the same variants for consistency in animation profile
              initial="initial"
              animate="animate"
              transition={{ delay: 0.5 + index * 0.15 }} // Stagger appearance
              whileHover="hover"
              onClick={() => handleSelection("preset", key)}
              className={`p-6 sm:p-8 rounded-2xl ${theme.cardBg} border ${theme.divider} cursor-pointer 
                        flex flex-col items-center text-center group ${theme.cardHoverBg} 
                        hover:border-${theme.accent}-500/70`} // Use primary accent for preset cards
              style={{ boxShadow: `0 0 30px -5px rgba(167,139,250,0.08)` }} // Subtle initial shadow
            >
              <motion.div
                className={`p-3 bg-gradient-to-br from-${theme.accent}-600 to-${theme.accent}-700 rounded-full shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{
                  boxShadow: `0 0 20px rgba(var(--color-violet-rgb,167 139 250),0.5)`,
                }}
              >
                <PresetIcon
                  size={30}
                  className={`text-white`}
                  strokeWidth={2}
                />
              </motion.div>
              <h3
                className={`text-xl sm:text-2xl font-bold ${theme.textPrimary} mb-2 group-hover:text-${theme.accent}-300 transition-colors`}
              >
                {preset.name}
              </h3>
              <p
                className={`${theme.textMuted} text-xs sm:text-sm flex-grow mb-5`}
              >
                {preset.description}
              </p>
              <div
                className={`mt-auto px-6 py-2.5 rounded-lg font-semibold text-white ${theme.buttonPresetBg} text-sm inline-block shadow-md group-hover:brightness-110 transition-all`}
              >
                Select Preset
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BuildModeSelectionPage;
