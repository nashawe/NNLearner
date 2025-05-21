// src/components/Explore/ActivationVisualizer.jsx
"use client";
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Info, CheckSquare, Square } from "lucide-react"; // Added CheckSquare, Square for toggle
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale
);
if (!ScrollTrigger.isRegistered) {
  gsap.registerPlugin(ScrollTrigger);
}

const theme = {
  bgSection: "bg-slate-950",
  card: "bg-slate-800/70 backdrop-blur-lg border border-slate-700/50",
  textPrimary: "#d1d5db",
  textSecondary: "#d1d5db",
  textMuted: "#d1d5db",
  accent: "sky",
  accentSecondary: "emerald",
  accentTertiary: "rose",
  inputBg: "bg-slate-700",
  inputBorder: "border-slate-600",
  gridStroke: "rgba(255, 255, 255, 0.1)", // More subtle grid for charts
  tooltipBg: "bg-white-800/90 backdrop-blur-sm",
  tooltipBorder: "border-sky-700",
  divider: "border-slate-700/60",
};

const ACTIVATIONS = [
  /* ... (ACTIVATIONS array as before, with colorHex) ... */
  {
    name: "Sigmoid",
    color: theme.accent,
    colorHex: "#0ea5e9",
    range: [-6, 6],
    yRange: [-0.2, 1.2],
  },
  {
    name: "Tanh",
    color: theme.accentSecondary,
    colorHex: "#10b981",
    range: [-4, 4],
    yRange: [-1.2, 1.2],
  },
  {
    name: "ReLU",
    color: theme.accentTertiary,
    colorHex: "#f43f5e",
    range: [-3, 3],
    yRange: [-0.5, 3.5],
  },
  {
    name: "Leaky ReLU",
    color: "purple",
    colorHex: "#a855f7",
    range: [-3, 3],
    yRange: [-0.5, 3.5],
  },
  {
    name: "GELU",
    color: "orange",
    colorHex: "#f97316",
    range: [-4, 4],
    yRange: [-0.5, 4.5],
  },
];

function activate(name, x) {
  /* ... (activate function as before) ... */
  const geluApprox = (val) =>
    0.5 *
    val *
    (1 +
      Math.tanh(Math.sqrt(2 / Math.PI) * (val + 0.044715 * Math.pow(val, 3))));
  switch (name) {
    case "Sigmoid":
      return 1 / (1 + Math.exp(-x));
    case "Tanh":
      return Math.tanh(x);
    case "ReLU":
      return Math.max(0, x);
    case "Leaky ReLU":
      return x >= 0 ? x : 0.03 * x;
    case "GELU":
      return geluApprox(x);
    default:
      return x;
  }
}
function derivative(name, x) {
  /* ... (derivative function as before) ... */
  const { exp, pow, sqrt, tanh, PI } = Math;
  const geluApproxDerivative = (val) => {
    const k = Math.sqrt(2 / PI);
    const inner = k * (val + 0.044715 * pow(val, 3));
    const sechSquared = 1 / pow(Math.cosh(inner), 2);
    return (
      0.5 * (1 + Math.tanh(inner)) +
      0.5 * val * sechSquared * k * (1 + 3 * 0.044715 * pow(val, 2))
    );
  };
  switch (name) {
    case "Sigmoid": {
      const y = 1 / (1 + exp(-x));
      return y * (1 - y);
    }
    case "Tanh":
      return 1 - pow(tanh(x), 2);
    case "ReLU":
      return x > 0 ? 1 : 0;
    case "Leaky ReLU":
      return x > 0 ? 1 : 0.01;
    case "GELU":
      return geluApproxDerivative(x);
    default:
      return 1;
  }
}

const SectionTitle = (
  {
    text,
    className = "",
  } /* ... (as before but remove scrolltrigger for simple appearance) ... */
) => (
  <motion.h2
    className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center ${theme.textPrimary} tracking-tight ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.6, ease: "circOut" }}
  >
    {text}
  </motion.h2>
);

const MemoizedChart = React.memo(({ chartData, chartOptions, chartKey }) => {
  /* ... (as before) ... */
  const chartRef = useRef(null);
  useEffect(() => {
    const chartInstance = chartRef.current;
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartKey]);
  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${theme.textMuted}`}
      >
        Loading chart data...
      </div>
    );
  }
  return (
    <Line
      ref={chartRef}
      data={chartData}
      options={chartOptions}
      key={chartKey}
    />
  );
});

export default function ActivationVisualizer() {
  const [selected, setSelected] = useState(ACTIVATIONS[0]);
  const [showDeriv, setShowDeriv] = useState(false);
  const sectionRef = useRef(null);

  const xs = useMemo(() => {
    /* ... */
    const arr = [];
    const currentRange = selected.range || [-5, 5];
    for (
      let i = Math.floor(currentRange[0] * 10);
      i <= Math.ceil(currentRange[1] * 10);
      i++
    ) {
      arr.push(i / 10);
    }
    return arr;
  }, [selected]);

  const chartKey = useMemo(
    () => selected.name + (showDeriv ? "-deriv" : ""),
    [selected, showDeriv]
  );

  const chartJsData = useMemo(() => {
    const ys = xs.map((x) => activate(selected.name, x));
    const derivativeYs = showDeriv
      ? xs.map((x) => derivative(selected.name, x))
      : [];
    const selectedColorHex = selected.colorHex || "#0ea5e9";
    return {
      labels: xs,
      datasets: [
        {
          label: selected.name,
          data: ys,
          borderColor: selectedColorHex,
          backgroundColor: `${selectedColorHex}2A`,
          borderWidth: 2.5,
          tension: 0.4,
          fill: "origin",
          pointRadius: 0,
          pointHitRadius: 10,
        },
        ...(showDeriv
          ? [
              {
                label: `${selected.name} Derivative`,
                data: derivativeYs,
                borderColor: selectedColorHex,
                borderDash: [4, 4],
                borderWidth: 1.5,
                tension: 0.4,
                fill: false,
                pointRadius: 0,
                pointHitRadius: 10,
              },
            ]
          : []),
      ],
    };
  }, [selected, showDeriv, xs]);

  const chartJsOptions = useMemo(() => {
    /* ... (as before, minor styling tweaks for clarity) ... */
    const currentYRange = selected.yRange || [-1, 1];
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400, easing: "easeOutQuad" },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: {
            color: theme.textSecondary,
            font: { size: 14 },
            boxWidth: 10,
            boxHeight: 10,
            padding: 10,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        title: { display: false },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: theme.tooltipBg,
          titleFont: { size: 14, weight: "bold" },
          bodyFont: { size: 14 },
          titleColor: theme.textPrimary,
          bodyColor: theme.textSecondary,
          borderColor: theme.tooltipBorder,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 6,
          boxPadding: 3,
        },
      },
      scales: {
        x: {
          type: "linear",
          ticks: {
            color: theme.textSecondary,
            font: { size: 14 },
            maxTicksLimit: 10,
            padding: 5,
          },
          grid: { color: theme.gridStroke, drawBorder: false, lineWidth: 0.5 },
          title: {
            display: true,
            text: "Input (x)",
            color: theme.textMuted,
            font: { size: 14, weight: "medium" },
          },
        },
        y: {
          ticks: {
            color: theme.textSecondary,
            font: { size: 14 },
            callback: (v) => Number(v.toFixed(1)),
            padding: 5,
          },
          grid: { color: theme.gridStroke, drawBorder: false, lineWidth: 0.5 },
          title: {
            display: true,
            text: "Output f(x)",
            color: theme.textMuted,
            font: { size: 24, weight: "medium" },
          },
          min: currentYRange[0],
          max: currentYRange[1],
        },
      },
      elements: { point: { radius: 0 } },
    };
  }, [selected]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  return (
    <section
      id="activations-visualizer"
      ref={sectionRef}
      className={`${theme.bgSection} py-16 sm:py-20 px-4 sm:px-6 min-h-screen flex flex-col items-center justify-center`}
    >
      <div className="w-full max-w-6xl mx-auto text-center">
        {" "}
        {/* Increased max-width for side menu */}
        <div className="mb-10 sm:mb-12">
          <SectionTitle text="Activation Function Playground" />
          <motion.p
            className={`mt-3 text-base sm:text-lg ${theme.textSecondary} max-w-2xl mx-auto`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Interactively explore how different activation functions transform
            inputs and observe their derivatives.
          </motion.p>
        </div>
        <motion.div
          className="flex flex-col md:flex-row gap-6 md:gap-8 items-start w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" // Animate when this container is in view
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Side Menu for Controls */}
          <motion.div
            variants={itemVariants}
            className={`md:w-1/4 lg:w-1/5 p-4 sm:p-5 rounded-2xl ${theme.card} shadow-xl self-start md:sticky md:top-28`} // Sticky side menu on desktop
          >
            <h3
              className={`text-lg font-semibold ${theme.textPrimary} mb-4 text-left border-b ${theme.divider} pb-2.5`}
            >
              Activations
            </h3>
            <div className="space-y-2 mb-6">
              {ACTIVATIONS.map((act) => (
                <motion.button
                  key={act.name}
                  onClick={() => setSelected(act)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ease-out shadow-sm outline-none focus:ring-2 ring-offset-2 ring-offset-slate-900
                            ${
                              selected.name === act.name
                                ? `text-white ring-${act.color}-500` // Ring for active
                                : `text-slate-300 hover:bg-slate-700 hover:text-white ${theme.inputBg}`
                            }`}
                  style={
                    selected.name === act.name
                      ? {
                          backgroundColor: act.colorHex || theme[act.color],
                          boxShadow: `0 0 15px -2px ${act.colorHex}55`,
                        }
                      : {}
                  }
                  whileHover={{
                    scale: selected.name !== act.name ? 1.03 : 1,
                    y: selected.name !== act.name ? -1 : 0,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {act.name}
                  {selected.name === act.name && (
                    <CheckSquare size={16} className="text-white/80" />
                  )}
                </motion.button>
              ))}
            </div>

            <div className={`border-t ${theme.divider} pt-4`}>
              <h3
                className={`text-lg font-semibold ${theme.textPrimary} mb-3 text-left`}
              >
                Options
              </h3>
              <motion.button
                onClick={() => setShowDeriv((prev) => !prev)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ease-out shadow-sm outline-none focus:ring-2 ring-offset-2 ring-offset-slate-900
                                   ${
                                     showDeriv
                                       ? `bg-${theme.accentTertiary}-600/80 text-white ring-${theme.accentTertiary}-500 hover:bg-${theme.accentTertiary}-600`
                                       : `${theme.inputBg} text-slate-300 hover:bg-slate-600/70 hover:text-white`
                                   }`}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                Show Derivative
                {showDeriv ? (
                  <CheckSquare size={16} className="text-white/80" />
                ) : (
                  <Square size={16} className="text-slate-500" />
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Chart Area */}
          <motion.div
            variants={itemVariants}
            className={`w-full md:w-3/4 lg:w-4/5 h-[450px] sm:h-[500px] md:h-[550px] ${theme.card} p-4 sm:p-6 rounded-2xl shadow-2xl`}
          >
            <MemoizedChart
              chartData={chartJsData}
              chartOptions={chartJsOptions}
              chartKey={chartKey}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
