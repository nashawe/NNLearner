// src/components/Explore/NNAnatomy.jsx
"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { Sigma } from "lucide-react"; // Removed Zap as its button is gone

import SectionTitle from "../common/SectionTitle";
import ActivationDD from "../common/ActivationDropdown";
import NeuronDiagram from "./NeuronDiagram"; // <-- IMPORTING THE NEW DIAGRAM

// --- THEME (Self-contained for this component) ---
// — ULTRA-FAST FUTURISTIC THEME —
const theme = {
  // section + canvas
  bgSection: "bg-black",
  canvasBg: "bg-gray-800", // This will be the background for the NeuronDiagram container
  surface: "bg-gray-700/50",

  // text
  textPrimary: "text-white",
  textHeader: "text-cyan-300",
  textSecondary: "text-gray-200",
  textMuted: "text-gray-400",

  // accents
  accentPrimary: "cyan-300", // used for text, buttons, chart
  accentPrimaryRGB: "0, 255, 255", // for chart line primarily
  accentSecondary: "magenta-300",
  accentSecondaryRGB: "255, 0, 255",
  accentTertiary: "yellow-300",
  accentTertiaryRGB: "255, 255, 0",

  // dividers + grid
  divider: "border-gray-600",
  gridStroke: "rgba(255,255,255,0.2)",

  // Note: Styles below were for the OLD SVG. NeuronDiagram.jsx handles its own.
  // They are left here to avoid breaking other potential uses of this theme object,
  // but they are NOT actively styling the new NeuronDiagram.
  pathStroke: "rgba(0,255,255,0.8)",
  nodeBg: "bg-gray-900",
  nodeBorder: "border-cyan-300",
  nodeGlow: "filter drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]",
  multBg: "bg-gray-900",
  multBorder: "border-magenta-300",
  multGlow: "filter drop-shadow-[0_0_6px_rgba(255,0,255,0.6)]",
  biasBg: "bg-gray-900",
  biasBorder: "border-yellow-300",
  biasGlow: "filter drop-shadow-[0_0_6px_rgba(255,255,0,0.6)]",
};

// --- ACTIVATION FUNCTIONS ---
const ACTIVATION_FUNCTIONS_LIST = [
  {
    name: "Sigmoid",
    func: (x) => 1 / (1 + Math.exp(-x)),
    yAxisDomain: [-0.2, 1.2],
    yTicks: [0, 0.5, 1],
  },
  {
    name: "ReLU",
    func: (x) => Math.max(0, x),
    yAxisDomain: [-0.5, 3.1],
    yTicks: [0, 1, 2, 3],
  },
  {
    name: "Tanh",
    func: (x) => Math.tanh(x),
    yAxisDomain: [-1.2, 1.2],
    yTicks: [-1, -0.5, 0, 0.5, 1],
  },
  {
    name: "Leaky ReLU",
    func: (x) => (x >= 0 ? x : 0.01 * x),
    yAxisDomain: [-0.5, 3.1],
    yTicks: [0, 1, 2, 3],
  },
];

// --- STATIC VALUES ---
const X1_VAL = 0.7;
const X2_VAL = 0.3;
const W1_VAL = 0.6;
const W2_VAL = -0.9;
const BIAS_VAL = 0.15;

// Note: createPath function removed as NeuronDiagram.jsx handles its own path drawing.
// Note: SimpleTooltip component and related state (hoveredElement) removed as
// NeuronDiagram.jsx doesn't use this specific tooltip mechanism.

export default function NNAnatomy() {
  const [selectedActivation, setSelectedActivation] = useState(
    ACTIVATION_FUNCTIONS_LIST[0]
  );
  // Removed hoveredElement and isProcessing state, as they are not needed for NeuronDiagram.

  const preActivationValue = useMemo(
    () => X1_VAL * W1_VAL + X2_VAL * W2_VAL + BIAS_VAL,
    []
  );
  const outputValue = useMemo(
    () => selectedActivation.func(preActivationValue),
    [preActivationValue, selectedActivation]
  );

  const miniChartData = useMemo(() => {
    const data = [];
    const range = selectedActivation.name.includes("ReLU") ? [-3, 3] : [-5, 5];
    for (let i = range[0]; i <= range[1]; i += 0.1) {
      data.push({ x: parseFloat(i.toFixed(1)), y: selectedActivation.func(i) });
    }
    return data;
  }, [selectedActivation]);

  // Removed svgPoints constant.
  // Removed handleProcessFlow and flowVariant for the old SVG animation.

  return (
    <section className={`${theme.bgSection} py-16 sm:py-20`}>
      <SectionTitle
        text="Anatomy of a Neuron: Simplified"
        className={theme.textHeader}
        subtitle="Explore the core computation of a single artificial neuron. Change the activation function to see how it affects the output. Click 'Visualize Forward Pass' on the diagram to see the data flow."
        subtitleClassName={theme.textSecondary}
      />

      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 items-start">
        {/* Controls Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`md:col-span-1 p-5 rounded-xl ${theme.surface} border ${theme.divider} shadow-xl space-y-6`}
        >
          <div>
            <h3
              className={`text-lg font-semibold ${theme.textHeader} mb-3 flex items-center gap-2`}
            >
              <Sigma size={20} />
              Neuron Configuration
            </h3>
            <div className="text-xs space-y-1.5 text-slate-300 mb-4">
              <p>
                Input X₁:{" "}
                <span className="font-mono text-sky-300 float-right">
                  {X1_VAL.toFixed(1)}
                </span>
              </p>
              <p>
                Weight W₁:{" "}
                <span className="font-mono text-emerald-300 float-right">
                  {W1_VAL.toFixed(1)}
                </span>
              </p>
              <p>
                Input X₂:{" "}
                <span className="font-mono text-sky-300 float-right">
                  {X2_VAL.toFixed(1)}
                </span>
              </p>
              <p>
                Weight W₂:{" "}
                <span className="font-mono text-emerald-300 float-right">
                  {W2_VAL.toFixed(1)}
                </span>
              </p>
              <p>
                Bias b:{" "}
                <span className="font-mono text-rose-300 float-right">
                  {BIAS_VAL.toFixed(1)}
                </span>
              </p>
            </div>
            <ActivationDD
              selected={selectedActivation}
              setSelected={setSelectedActivation}
              optionsList={ACTIVATION_FUNCTIONS_LIST}
            />
          </div>
          <div className="border-t border-slate-700 pt-4">
            <h4 className={`text-md font-semibold ${theme.textHeader} mb-1`}>
              Calculation:
            </h4>
            <p className="text-xs text-slate-400 mb-2">
              z = (X₁*W₁) + (X₂*W₂) + b
            </p>
            <p className="text-sm text-slate-200">
              Pre-Activation (z):{" "}
              <strong className="font-mono float-right">
                {preActivationValue.toFixed(3)}
              </strong>
            </p>
            <p className="text-sm text-slate-200 mt-1">
              Output (Y = {selectedActivation.name}(z)):{" "}
              <strong
                className={`font-mono float-right text-${theme.accentPrimary}`} // Adjusted to use theme.accentPrimary for consistency
              >
                {outputValue.toFixed(3)}
              </strong>
            </p>
          </div>
          <div
            className={`w-full h-36 mt-2 bg-gray-800/70 p-2 rounded-lg border border-gray-700`} // Simpler styling from theme
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={miniChartData}
                margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.7)" // slightly dim white
                  strokeOpacity={0.4}
                />
                <XAxis
                  dataKey="x"
                  stroke="rgba(255,255,255,0.7)" // slightly dim white
                  tick={{ fontSize: 12 }}
                  domain={
                    selectedActivation.name.includes("ReLU") ? [-3, 3] : [-5, 5]
                  }
                  ticks={
                    selectedActivation.name.includes("ReLU")
                      ? [-3, 0, 3]
                      : [-5, 0, 5]
                  }
                />
                <YAxis
                  stroke="rgba(255,255,255,0.7)" // slightly dim white
                  tick={{ fontSize: 12 }}
                  domain={selectedActivation.yAxisDomain}
                  ticks={selectedActivation.yTicks}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.surface, // Uses a string from theme, not bg-class
                    borderColor: theme.divider.replace("border-", ""), // hacky, better to have color var
                    borderRadius: "0.3rem",
                    fontSize: "10px",
                  }}
                  labelStyle={{ color: theme.textPrimary.replace("text-", "") }} // hacky
                  itemStyle={{ color: `rgba(${theme.accentPrimaryRGB},0.9)` }}
                  formatter={(v) => (typeof v === "number" ? v.toFixed(3) : v)}
                />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke={`rgba(${theme.accentPrimaryRGB},0.9)`}
                  strokeWidth={1.5}
                  dot={false}
                />
                <ReferenceDot
                  x={preActivationValue}
                  y={outputValue}
                  r={4}
                  fill={`rgba(${theme.accentPrimaryRGB},1)`}
                  stroke={theme.textPrimary.replace("text-", "white")} // Assuming white for now
                  strokeWidth={1}
                  ifOverflow="extendDomain"
                  alwaysShow
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Button for 'Visualize Flow' has been removed as NeuronDiagram has its own control */}
        </motion.div>

        {/* Diagram Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={`md:col-span-2 p-0 rounded-xl ${theme.canvasBg} border ${theme.divider} shadow-2xl overflow-hidden`} // Use theme.canvasBg
          // aspect-[750/400] removed to let NeuronDiagram decide its aspect. p-0 and overflow-hidden for tight fit.
        >
          {/* --- REPLACED OLD SVG WITH NeuronDiagram --- */}
          <NeuronDiagram />
        </motion.div>
      </div>
    </section>
  );
}
