// src/components/Explore/NNAnatomySimple.jsx
"use client";
import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Sigma, Zap } from "lucide-react"; // Zap for a "process" button

import SectionTitle from "../common/SectionTitle";
import ActivationDD from "../common/ActivationDropdown";

// --- THEME (Self-contained for this component) ---
const theme = {
  bgSection: "bg-slate-950",
  canvasBg: "bg-slate-900",
  surface: "bg-slate-800",
  textPrimary: "text-slate-100",
  textHeader: "text-sky-300",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  accentPrimary: "sky", // For main data flow, output
  accentPrimaryRGB: "14, 165, 233",
  accentSecondary: "emerald", // For weights
  accentTertiary: "rose", // For bias
  divider: "border-slate-700",
  inputBg: "bg-slate-700",
  inputBorder: "border-slate-600",
  gridStroke: "rgba(100, 116, 139, 0.3)",
  pathStroke: "rgba(100, 116, 139, 0.8)",
  arrowheadFill: "rgba(148, 163, 184, 0.9)",
  operationFill: "rgba(51, 65, 85, 0.85)",
  operationStroke: "rgba(100, 116, 139, 0.9)",
  highlightGlow: "shadow-[0_0_12px_3px_rgba(14,165,233,0.4)]", // Sky glow
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

// --- SVG Path Creator ---
const createPath = (
  start,
  end,
  c1o = { x: 60, y: 0 },
  c2o = { x: -40, y: 0 }
) =>
  `M ${start.x} ${start.y} C ${start.x + c1o.x} ${start.y + c1o.y}, ${
    end.x + c2o.x
  } ${end.y + c2o.y}, ${end.x} ${end.y}`;

// --- Simple Tooltip ---
const SimpleTooltip = ({ text, isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 22,
          duration: 0.15,
        }}
        className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md text-xs 
                   whitespace-nowrap ${theme.surface} ${theme.textSecondary} shadow-xl 
                   border ${theme.divider} z-20 pointer-events-none`}
      >
        {text}
      </motion.div>
    )}
  </AnimatePresence>
);

export default function NNAnatomy() {
  const [selectedActivation, setSelectedActivation] = useState(
    ACTIVATION_FUNCTIONS_LIST[0]
  );
  const [hoveredElement, setHoveredElement] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // For the simple animation

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

  // --- SVG Coordinates (Simplified Layout) ---
  const svgPoints = {
    x1: {
      id: "x1",
      cx: 100,
      cy: 100,
      r: 25,
      label: "X₁",
      tooltip: "Input value X₁",
    },
    w1: {
      id: "w1",
      x: 190,
      y: 75,
      label: "W₁",
      tooltip: `Weight W₁ (${W1_VAL.toFixed(1)}) multiplies X₁`,
    },
    x2: {
      id: "x2",
      cx: 100,
      cy: 250,
      r: 25,
      label: "X₂",
      tooltip: "Input value X₂",
    },
    w2: {
      id: "w2",
      x: 190,
      y: 275,
      label: "W₂",
      tooltip: `Weight W₂ (${W2_VAL.toFixed(1)}) multiplies X₂`,
    },
    bias: {
      id: "bias",
      cx: 220,
      cy: 350,
      r: 20,
      label: "b",
      tooltip: `Bias b (${BIAS_VAL.toFixed(1)}) is added`,
    },
    mul1: { id: "mul1", x: 280, y: 100, size: 35, op: "×", tooltip: "X₁ × W₁" },
    mul2: { id: "mul2", x: 280, y: 250, size: 35, op: "×", tooltip: "X₂ × W₂" },
    sum: {
      id: "sum",
      x: 400,
      y: 175,
      size: 40,
      op: "Σ",
      tooltip: "Weighted Sum + Bias (z)",
    },
    act: {
      id: "act",
      cx: 550,
      cy: 175,
      r: 50,
      label: selectedActivation.name,
      tooltip: "Activation Function",
    },
    output: {
      id: "output",
      x: 680,
      y: 175,
      label: "Y",
      tooltip: "Final Output Value",
    },
  };

  // Simple data flow animation trigger
  const handleProcessFlow = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1500); // Animation duration
  };
  const flowVariant = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  return (
    <section className={`${theme.bgSection} py-16 sm:py-20`}>
      <SectionTitle
        text="Anatomy of a Neuron: Simplified"
        className={theme.textHeader}
        subtitle="Explore the core computation of a single artificial neuron. Change the activation function to see how it affects the output."
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
                className={`font-mono float-right text-${theme.accentPrimary}-300`}
              >
                {outputValue.toFixed(3)}
              </strong>
            </p>
          </div>
          <div
            className={`w-full h-36 mt-2 ${theme.inputBg}/70 p-2 rounded-lg border ${theme.inputBorder}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={miniChartData}
                margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.gridStroke}
                  strokeOpacity={0.4}
                />
                <XAxis
                  dataKey="x"
                  stroke={theme.textMuted}
                  tick={{ fontSize: 9 }}
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
                  stroke={theme.textMuted}
                  tick={{ fontSize: 9 }}
                  domain={selectedActivation.yAxisDomain}
                  ticks={selectedActivation.yTicks}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.surface,
                    borderColor: theme.divider,
                    borderRadius: "0.3rem",
                    fontSize: "10px",
                  }}
                  labelStyle={{ color: theme.textPrimary }}
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
                  stroke={theme.textPrimary}
                  strokeWidth={1}
                  ifOverflow="extendDomain"
                  alwaysShow
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <button
            onClick={handleProcessFlow}
            disabled={isProcessing}
            className={`w-full mt-4 px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2
                         bg-sky-600 hover:bg-sky-500 text-white transition-all duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed ${
                           isProcessing ? "opacity-60" : theme.highlightGlow
                         }`}
          >
            <Zap size={18} className={isProcessing ? "animate-ping" : ""} />
            {isProcessing ? "Processing..." : "Visualize Flow"}
          </button>
        </motion.div>

        {/* Diagram Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={`md:col-span-2 p-4 rounded-xl ${theme.canvasBg} border ${theme.divider} shadow-2xl aspect-[750/400]`} // Maintain aspect ratio
        >
          <svg viewBox="0 0 750 400" className="w-full h-full">
            <defs>
              <marker
                id="simpleArrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 L 1 5 z"
                  fill={theme.arrowheadFill}
                />
              </marker>
              <filter
                id="simpleGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feFlood
                  floodColor={`rgba(${theme.accentPrimaryRGB},0.6)`}
                  result="glowColor"
                />
                <feComposite
                  in="glowColor"
                  in2="blur"
                  operator="in"
                  result="coloredGlow"
                />
                <feMerge>
                  <feMergeNode in="coloredGlow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connections (Static for simplicity, flow animated on paths) */}
            {[
              { from: svgPoints.x1, to: svgPoints.mul1, pathId: "p1" },
              {
                from: svgPoints.w1,
                to: svgPoints.mul1,
                pathId: "p2",
                dashed: true,
                c1o: { x: 20, y: 30 },
                c2o: { x: -5, y: -20 },
              },
              { from: svgPoints.x2, to: svgPoints.mul2, pathId: "p3" },
              {
                from: svgPoints.w2,
                to: svgPoints.mul2,
                pathId: "p4",
                dashed: true,
                c1o: { x: 20, y: -30 },
                c2o: { x: -5, y: 20 },
              },
              {
                from: svgPoints.mul1,
                to: svgPoints.sum,
                c1o: { x: 40, y: 0 },
                c2o: { x: -30, y: (svgPoints.sum.y - svgPoints.mul1.y) / 2 },
                pathId: "p5",
              },
              {
                from: svgPoints.mul2,
                to: svgPoints.sum,
                c1o: { x: 40, y: 0 },
                c2o: { x: -30, y: (svgPoints.sum.y - svgPoints.mul2.y) / 2 },
                pathId: "p6",
              },
              {
                from: svgPoints.bias,
                to: svgPoints.sum,
                c1o: { x: 0, y: -50 },
                c2o: { x: 0, y: 30 },
                pathId: "p7",
              },
              {
                from: svgPoints.sum,
                to: svgPoints.act,
                c1o: { x: 50, y: 0 },
                pathId: "p8",
              },
              {
                from: svgPoints.act,
                to: svgPoints.output,
                c1o: { x: 40, y: 0 },
                c2o: { x: -20, y: 0 },
                pathId: "p9",
              },
            ].map((p) => (
              <g key={p.pathId}>
                <motion.path
                  d={createPath(
                    {
                      x:
                        (p.from.cx || p.from.x) +
                        (p.from.r || (p.from.size || 0) / 2) *
                          Math.sign(
                            (p.to.x || p.to.cx) - (p.from.x || p.from.cx)
                          ),
                      y: p.from.cy || p.from.y,
                    },
                    {
                      x:
                        (p.to.cx || p.to.x) -
                        (p.to.r || (p.to.size || 0) / 2) *
                          Math.sign(
                            (p.to.x || p.to.cx) - (p.from.x || p.from.cx)
                          ),
                      y: p.to.cy || p.to.y,
                    },
                    p.c1o,
                    p.c2o
                  )}
                  stroke={theme.pathStroke}
                  strokeWidth="1.5"
                  fill="none"
                  markerEnd={p.dashed ? "" : "url(#simpleArrow)"}
                  strokeDasharray={p.dashed ? "4 3" : "none"}
                />
                {isProcessing && ( // Animated flow line
                  <motion.path
                    d={createPath(
                      // Re-calculate for animation to be cleaner
                      { x: p.from.cx || p.from.x, y: p.from.cy || p.from.y },
                      { x: p.to.cx || p.to.x, y: p.to.cy || p.to.y },
                      p.c1o,
                      p.c2o
                    )}
                    stroke={`rgba(${theme.accentPrimaryRGB},0.8)`}
                    strokeWidth="2.5"
                    fill="none"
                    variants={flowVariant}
                    initial="initial"
                    animate={isProcessing ? "animate" : "initial"}
                    style={{ filter: "url(#simpleGlow)" }}
                  />
                )}
              </g>
            ))}

            {/* Nodes and Operations */}
            {Object.values(svgPoints).map((el) => (
              <g
                key={el.id}
                className="relative group cursor-default" // For tooltip positioning and hover states
                onMouseEnter={() => setHoveredElement(el.id)}
                onMouseLeave={() => setHoveredElement(null)}
              >
                {el.cx ? ( // Circle based nodes (inputs, bias, activation)
                  <>
                    <motion.circle
                      cx={el.cx}
                      cy={el.cy}
                      r={el.r}
                      fill={
                        el.id === "act"
                          ? `rgba(${theme.accentPrimaryRGB}, 0.1)`
                          : el.id === "bias"
                          ? `rgba(225,29,72,0.1)`
                          : `rgba(${theme.accentPrimaryRGB},0.05)`
                      }
                      stroke={
                        el.id === "act"
                          ? `rgba(${theme.accentPrimaryRGB}, 0.5)`
                          : el.id === "bias"
                          ? "rgba(225,29,72,0.4)"
                          : `rgba(${theme.accentPrimaryRGB},0.3)`
                      }
                      strokeWidth="1.5"
                      whileHover={{ scale: 1.1, filter: "url(#simpleGlow)" }}
                    />
                    <text
                      x={el.cx}
                      y={el.cy}
                      dy=".3em"
                      textAnchor="middle"
                      fontSize={el.id === "act" ? "12px" : "14px"}
                      fontWeight={el.id === "act" ? "600" : "500"}
                      fill={theme.textPrimary}
                      pointerEvents="none"
                    >
                      {el.label}{" "}
                      {el.id === "act" && (
                        <tspan
                          x={el.cx}
                          dy="1.3em"
                          fontSize="9px"
                          fill={theme.textSecondary}
                        >
                          {selectedActivation.name}
                        </tspan>
                      )}
                    </text>
                  </>
                ) : el.size ? ( // Operation blocks (rects)
                  <>
                    <motion.rect
                      x={el.x - el.size / 2}
                      y={el.y - el.size / 2}
                      width={el.size}
                      height={el.size}
                      rx="6"
                      fill={theme.operationFill}
                      stroke={theme.operationStroke}
                      strokeWidth="1"
                      whileHover={{ scale: 1.1, filter: "url(#simpleGlow)" }}
                    />
                    <text
                      x={el.x}
                      y={el.y}
                      dy=".3em"
                      textAnchor="middle"
                      fontSize="18px"
                      fontWeight="bold"
                      fill={theme.textPrimary}
                      pointerEvents="none"
                    >
                      {el.op}
                    </text>
                  </>
                ) : el.id === "output" ? ( // Output Label 'Y'
                  <text
                    x={el.x}
                    y={el.y}
                    dy=".3em"
                    textAnchor="middle"
                    fontSize="28px"
                    fontWeight="bold"
                    fill={`rgba(${theme.accentPrimaryRGB},1)`}
                    pointerEvents="none"
                    className="group-hover:brightness-125 transition-all"
                  >
                    {el.label}
                    <tspan
                      dx="5"
                      dy="-8"
                      fontSize="14px"
                      fill={theme.textSecondary}
                    >
                      {outputValue.toFixed(3)}
                    </tspan>
                  </text>
                ) : (
                  // Weight Labels W1, W2
                  <text
                    x={el.x}
                    y={el.y}
                    dy=".3em"
                    textAnchor="middle"
                    fontSize="14px"
                    fontWeight="500"
                    fill={
                      el.id.startsWith("w")
                        ? theme.textSecondary
                        : theme.textMuted
                    }
                    pointerEvents="none"
                    className="group-hover:fill-sky-300 transition-colors"
                  >
                    {el.label}
                  </text>
                )}
                <SimpleTooltip
                  text={el.tooltip}
                  isVisible={hoveredElement === el.id}
                />
              </g>
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

// Assuming these are correctly imported in your project structure
// If not, you might need to provide simple local versions or adjust paths
// import SectionTitle from "../common/SectionTitle";
// import ActivationDropdown from "../common/ActivationDropdown";
