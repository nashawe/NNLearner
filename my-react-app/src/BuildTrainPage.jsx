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
  // For configuration
  const [numLayers, setNumLayers] = useState(3);
  const [neuronsPerLayer, setNeuronsPerLayer] = useState(8);
  const [learningRate, setLearningRate] = useState("0.01");
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
  const [init_fn, setInitFn] = useState("Xavier");

  // For training results
  const [trainingResults, setTrainingResults] = useState(null);

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

      let rawLabels = labelsInput
        .trim()
        .split(",")
        .map((val) => parseFloat(val));

      let labels;

      if (parseInt(outputSize) === 1) {
        const invalidLabels = rawLabels.filter(
          (label) => label !== 0 && label !== 1
        );
        if (invalidLabels.length > 0) {
          alert(
            "Error: For binary classification (output size = 1), labels must be 0 or 1."
          );
          return;
        }
        labels = rawLabels.map((label) => [label]); // ✅ wrap in array to match (1,) shape
      } else {
        const numClasses = parseInt(outputSize);
        labels = rawLabels.map((label) => {
          const vec = new Array(numClasses).fill(0);
          vec[label] = 1;
          return vec;
        });
      }

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
        init_fn: parseInt(init_fn),
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

      // ⬇️ STOP the animation loop...
      setIsTraining(false);
      // ⬇️ CLOSE the full‑screen overlay...
      setZoomed(false);
      // ⬇️ SAVE the training payload so we can render it
      setTrainingResults(result);

      // Can use result.loss_history or accuracy_history to plot later
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
            <InputSlider
              label="Input Size"
              value={inputSize}
              onChange={(e) => setInputSize(parseInt(e.target.value))}
              min={1}
              max={10}
            />
            <InputSlider
              label="Output Size"
              value={outputSize}
              onChange={(e) => setOutputSize(parseInt(e.target.value))}
              min={1}
              max={10}
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
              value={mode} // Ensure this is tied to the state
              options={[
                "1 - Sigmoid + MSE",
                "2 - Sigmoid + Binary Cross-Entropy",
                "3 - Tanh + MSE",
                "4 - ReLU + Sigmoid + BCE",
                "5 - ReLU + Softmax + Cross-Entropy",
              ]}
              onChange={(e) => setMode(e.target.value)} // Update state with the selected value
            />
            <SelectBox
              label="Weight Initialization Function"
              value={init_fn}
              options={["Xavier", "He", "Uniform"]}
              onChange={(e) => setInitFn(e.target.value)}
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
              inputSize={parseInt(inputSize)}
              outputSize={parseInt(outputSize)}
              numLayers={numLayers}
              neuronsPerLayer={neuronsPerLayer}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Zoom in and pan to explore the network.
          </p>
        </div>
      </div>

      {/* --- TRAINING SUMMARY --- */}
      {trainingResults && (
        <div className="mt-6 p-4 bg-white border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">🎉 Training Complete!</h2>
          <p className="text-sm">
            Training ID: <code>{trainingResults.training_id}</code>
          </p>
          {trainingResults.accuracy !== undefined && (
            <p className="text-sm">
              Final Accuracy: {(trainingResults.accuracy * 100).toFixed(2)}%
            </p>
          )}
          {trainingResults.loss !== undefined && (
            <p className="text-sm">
              Final Loss: {trainingResults.loss.toFixed(6)}
            </p>
          )}

          {trainingResults.loss_history && (
            <>
              <h3 className="mt-4 font-medium">Loss History:</h3>
              <ul className="list-disc list-inside text-sm max-h-48 overflow-y-auto">
                {trainingResults.loss_history.map((loss, idx) => (
                  <li key={idx}>
                    Epoch {idx * 100}: {loss.toFixed(6)}
                  </li>
                ))}
              </ul>
            </>
          )}

          {trainingResults.accuracy_history && (
            <>
              <h3 className="mt-4 font-medium">Accuracy History:</h3>
              <ul className="list-disc list-inside text-sm max-h-48 overflow-y-auto">
                {trainingResults.accuracy_history.map((acc, idx) => (
                  <li key={idx}>
                    Epoch {idx * 100}: {(acc * 100).toFixed(2)}%
                  </li>
                ))}
                {trainingResults.accuracy_history?.length === 0 && (
                  <p className="text-sm italic text-gray-500">
                    No accuracy data available for this setup.
                  </p>
                )}
              </ul>
            </>
          )}
        </div>
      )}

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
                  inputSize={inputSize}
                  outputSize={outputSize}
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
