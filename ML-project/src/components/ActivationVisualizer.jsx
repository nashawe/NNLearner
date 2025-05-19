"use client";
import React, { useState, useMemo } from "react";
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
} from "chart.js";
import { erf, exp, pow, sqrt, tanh } from "mathjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ACTIVATIONS = ["Sigmoid", "Tanh", "ReLU", "Leaky ReLU", "GELU"];

function activate(name, x) {
  switch (name) {
    case "Sigmoid":
      return 1 / (1 + Math.exp(-x));
    case "Tanh":
      return tanh(x);
    case "ReLU":
      return Math.max(0, x);
    case "Leaky ReLU":
      return x >= 0 ? x : 0.1 * x;
    case "GELU":
      return 0.5 * x * (1 + erf(x / Math.SQRT2));
    default:
      return x;
  }
}

function derivative(name, x) {
  switch (name) {
    case "Sigmoid": {
      const y = 1 / (1 + Math.exp(-x));
      return y * (1 - y);
    }
    case "Tanh":
      return 1 - pow(tanh(x), 2);
    case "ReLU":
      return x > 0 ? 1 : 0;
    case "Leaky ReLU":
      return x > 0 ? 1 : 0.1;
    case "GELU": {
      // derivative of GELU (approximation)
      const c = 0.5 * (1 + erf(x / Math.SQRT2));
      const pdf = exp(-pow(x, 2) / 2) / sqrt(2 * Math.PI);
      return c + x * pdf;
    }
    default:
      return 1;
  }
}

export default function ActivationVisualizer() {
  const [selected, setSelected] = useState("Sigmoid");
  const [showDeriv, setShowDeriv] = useState(false);

  const xs = useMemo(() => {
    const arr = [];
    for (let i = -60; i <= 60; i++) {
      arr.push(i / 10);
    }
    return arr;
  }, []);

  const { data, options } = useMemo(() => {
    const ys = xs.map((x) => activate(selected, x));
    const derivativeYs = xs.map((x) => derivative(selected, x));

    return {
      data: {
        labels: xs,
        datasets: [
          {
            label: selected,
            data: ys,
            borderColor: "#FFFFFF",
            borderWidth: 2,
            tension: 0.4, // smoother curves
            fill: false,
            pointRadius: 0, // no dots
          },
          ...(showDeriv
            ? [
                {
                  label: `${selected} derivative`,
                  data: derivativeYs,
                  borderDash: [6, 6],
                  borderColor: "#FFFFFF",
                  borderWidth: 2,
                  tension: 0.4,
                  fill: false,
                  pointRadius: 0,
                },
              ]
            : []),
        ],
      },
      scales: {
        x: {
          ticks: { display: true, color: "#FFFFFF" },
          grid: { display: true, color: "#444444" },
        },
        y: {
          ticks: { display: true, color: "#FFFFFF" },
          grid: { display: true, color: "#444444" },
          suggestedMin:
            selected === "Leaky ReLU" ? -1 : selected === "Tanh" ? -1.2 : 0,
          suggestedMax:
            selected === "Sigmoid"
              ? 1.2
              : selected === "Tanh"
              ? 1.2
              : selected === "Leaky ReLU"
              ? 6
              : undefined,
        },
      },
      elements: {
        line: { tension: 0.4 }, // global smoothness
      },
    };
  }, [selected, showDeriv, xs]);

  return (
    <section id="activations" className="bg-gray-900 pb-28 pt-4 px-6 h-screen">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-white mb-8">
          Activation Functions
        </h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center flex-wrap gap-4 mb-8">
          {ACTIVATIONS.map((name) => (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className={`px-4 py-2 rounded-lg transition ${
                selected === name
                  ? "bg-red-400 text-black"
                  : "bg-white text-black hover:bg-red-400"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Derivative Toggle */}
        <button
          onClick={() => setShowDeriv((prev) => !prev)}
          className="mb-8 px-4 py-2 rounded-lg transition bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          {showDeriv ? "Hide Derivative" : "Show Derivative"}
        </button>

        {/* Chart */}
        <div className="h-96 w-full">
          <Line data={data} options={options} />
        </div>
      </div>
    </section>
  );
}
