import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import NetworkVisualizer from "./components/NetworkVisualizer";

/**
 * Simple input components for configuration.
 * You can break these out into separate files if desired.
 */
const InputSlider = ({ label, value, onChange, min, max }) => (
  <div>
    <label className="text-sm font-medium block">{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      className="w-full accent-blue-500 transition-all"
    />
    <div className="text-right text-xs text-gray-500">{value}</div>
  </div>
);

const InputBox = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm font-medium block">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="border rounded w-full px-2 py-1 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
    />
  </div>
);

const SelectBox = ({ label, value, options, onChange }) => (
  <div>
    <label className="text-sm font-medium block">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="border rounded w-full px-2 py-1 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
    >
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

/**
 * BuildTrainPage:
 * 1) Shows config form on the left
 * 2) Shows a 600x500 preview on the right
 * 3) Expands to full-screen on "Train Model" with a repeating animation
 */
const BuildTrainPage = () => {
  const [numLayers, setNumLayers] = useState(3);
  const [neuronsPerLayer, setNeuronsPerLayer] = useState(8);
  const [learningRate, setLearningRate] = useState("0.01");
  const [activationFn, setActivationFn] = useState("ReLU");
  const [lossFn, setLossFn] = useState("Cross-Entropy");
  const [optimizer, setOptimizer] = useState("Adam");
  const [dropout, setDropout] = useState("0.2");
  const [batchSize, setBatchSize] = useState("32");
  const [inputSize, setInputSize] = useState("3");
  const [outputSize, setOutputSize] = useState("2");
  const [epochs, setEpochs] = useState("1000");
  const [mode, setMode] = useState("1"); // Default to Mode 1
  const [saveModel, setSaveModel] = useState(true);
  const [filename, setFilename] = useState("latest_model.npz");
  const [dataInput, setDataInput] = useState("");
  const [labelsInput, setLabelsInput] = useState("");

  // For overlay
  const [zoomed, setZoomed] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  // Refs
  const visualizerRef = useRef(null);

  // Repeated animation loop
  useEffect(() => {
    if (!isTraining) return;

    const loop = async () => {
      if (!visualizerRef.current) return;

      // Trigger a single forward pass
      await visualizerRef.current.startAnimation();
      // Wait a tiny gap before repeating
      setTimeout(loop, 1000);
    };

    loop();
  }, [isTraining]);

  const handleSubmit = async () => {
    try {
      // 1. Expand visualizer + start animation
      setZoomed(true);
      setIsTraining(true);

      // 2. Parse data input
      const data = dataInput
        .trim()
        .split("\n")
        .map((line) => line.split(",").map((val) => parseFloat(val)));

      const labels = labelsInput
        .trim()
        .split(",")
        .map((val) => {
          const parsed = parseFloat(val);
          return isNaN(parsed) ? val : parsed;
        });

      // 3. Prepare payload
      const payload = {
        input_size: parseInt(inputSize),
        output_size: parseInt(outputSize),
        hidden_size: parseInt(neuronsPerLayer),
        num_layers: parseInt(numLayers),
        dropout: parseFloat(dropout),
        optimizer_choice:
          optimizer === "Adam" ? 3 : optimizer === "RMSProp" ? 2 : 1,
        mode_id: parseInt(mode),
        batch_size: parseInt(batchSize),
        learning_rate: parseFloat(learningRate),
        epochs: parseInt(epochs),
        data,
        labels,
        save_after_train: saveModel,
        filename,
      };
      console.log("Sending payload:", payload);
      console.log("To:", "http://127.0.0.1:8000/train");

      // 4. Send to backend
      const response = await fetch("http://127.0.0.1:8000/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("✅ Training result:", result);

      // You can use result.loss_history or accuracy_history to plot later
    } catch (error) {
      console.error("❌ Error during training:", error);
      alert("Training failed. Check console for details.");
    }
  };

  const handleStopTraining = () => {
    setZoomed(false);
    setIsTraining(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Build & Train a Model</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        {/* LEFT: Configuration */}
        <div className="p-4 md:p-6 border-r border-gray-300 max-h-[calc(100vh-120px)] overflow-y-auto sticky top-[100px]">
          <h2 className="text-lg font-semibold mb-4">Network Configuration</h2>
          <div className="space-y-4">
            <InputBox
              label="Input Size"
              value={inputSize}
              onChange={(e) => setInputSize(e.target.value)}
            />
            <InputBox
              label="Output Size"
              value={outputSize}
              onChange={(e) => setOutputSize(e.target.value)}
            />
            <InputBox
              label="Epochs"
              value={epochs}
              onChange={(e) => setEpochs(e.target.value)}
            />
            <InputSlider
              label="Number of Layers"
              value={numLayers}
              onChange={(e) => setNumLayers(parseInt(e.target.value))}
              min={1}
              max={10}
            />
            <InputSlider
              label="Neurons per Layer"
              value={neuronsPerLayer}
              onChange={(e) => setNeuronsPerLayer(parseInt(e.target.value))}
              min={1}
              max={32}
            />
            <InputBox
              label="Learning Rate"
              value={learningRate}
              onChange={(e) => setLearningRate(e.target.value)}
            />
            <SelectBox
              label="Model Mode (Activation + Loss)"
              value={mode}
              options={[
                "1 - Sigmoid + MSE",
                "2 - Sigmoid + Binary Cross-Entropy",
                "3 - Tanh + MSE",
                "4 - ReLU + Sigmoid + BCE",
                "5 - ReLU + Softmax + Cross-Entropy",
              ]}
              onChange={(e) => setMode(e.target.value.split(" ")[0])}
            />
            <SelectBox
              label="Optimizer"
              value={optimizer}
              options={["Adam", "RMSProp", "SGD"]}
              onChange={(e) => setOptimizer(e.target.value)}
            />
            <InputBox
              label="Dropout"
              value={dropout}
              onChange={(e) => setDropout(e.target.value)}
            />
            <InputBox
              label="Batch Size"
              value={batchSize}
              onChange={(e) => setBatchSize(e.target.value)}
            />
            <div>
              <label className="text-sm font-medium block mb-1">
                Training Data
              </label>
              <textarea
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                rows={6}
                className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                placeholder="Each line is a sample (comma-separated)
Example:
1,2,3
4,5,6"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium block mb-1">Labels</label>
              <textarea
                value={labelsInput}
                onChange={(e) => setLabelsInput(e.target.value)}
                rows={2}
                className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                placeholder="Comma-separated labels (e.g. 0,1,1,0)"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-all duration-200 shadow hover:shadow-md"
            >
              Train Model
            </button>
          </div>
        </div>

        {/* RIGHT: 600x500 preview */}
        <div className="p-4 md:p-6 flex flex-col items-center justify-center bg-gray-50 border rounded-md">
          {/* Save model toggle */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between mb-4">
            <label className="text-base font-semibold text-gray-700 hover:scale-[1.02] transition-transform duration-200">
              <input
                type="checkbox"
                checked={saveModel}
                onChange={(e) => setSaveModel(e.target.checked)}
                className="mr-2 accent-blue-500"
              />
              Save model after training
            </label>

            {saveModel && (
              <input
                type="text"
                placeholder="Filename (e.g., my_model.npz)"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="mt-2 md:mt-0 border px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              />
            )}
          </div>

          <h2 className="text-lg font-semibold mb-4">Architecture Preview</h2>
          <div className="w-[600px] h-[500px] border border-gray-300 rounded">
            <NetworkVisualizer
              ref={visualizerRef}
              inputSize={4}
              outputSize={2}
              numLayers={numLayers}
              neuronsPerLayer={neuronsPerLayer}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Zoom in and pan to explore the network.
          </p>
        </div>
      </div>
      {/* Fullscreen Overlay */}
      <LayoutGroup>
        <AnimatePresence>
          {zoomed && (
            <motion.div
              className="fixed top-0 left-0 w-screen h-screen z-50 bg-white flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-[90%] h-[80%] border border-gray-300 rounded">
                <NetworkVisualizer
                  ref={visualizerRef}
                  inputSize={4}
                  outputSize={2}
                  numLayers={numLayers}
                  neuronsPerLayer={neuronsPerLayer}
                />
              </div>
              <button
                onClick={handleStopTraining}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 shadow"
              >
                Stop Training
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
};

export default BuildTrainPage;
