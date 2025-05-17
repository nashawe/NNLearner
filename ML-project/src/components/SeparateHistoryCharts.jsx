// src/components/SeparateHistoryCharts.jsx
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SeparateHistoryCharts({
  loss,
  accuracy,
  learning_rate,
}) {
  const [active, setActive] = useState(null);
  const [linear, setLinear] = useState(false);

  const baseData = loss.map((v, i) => ({
    epoch: i + 1,
    loss: parseFloat(v.toFixed(6)),
    accuracy: parseFloat(accuracy[i].toFixed(6)),
    lr: parseFloat(learning_rate[i].toFixed(6)),
  }));

  const charts = [
    {
      key: "loss",
      title: "Loss",
      data: baseData,
      dataKey: "loss",
      step: 100,
      yLabel: "Loss",
      extra: <div className="flex items-center space-x-2"></div>,
    },
    {
      key: "accuracy",
      title: "Accuracy",
      data: baseData,
      dataKey: "accuracy",
      yLabel: "%",
      extra: null,
    },
    {
      key: "lr",
      title: "Learning Rate",
      data: baseData,
      dataKey: "lr",
      yLabel: "LR",
      extra: null,
    },
  ];

  return (
    <div className="flex flex-col space-y-8 p-8">
      {charts.map((c) => (
        <div
          key={c.key}
          className="relative bg-white rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition cursor-pointer"
        >
          <div className="absolute top-4 right-4 flex space-x-2">
            {c.extra}
            <button onClick={() => setActive(c.key)}>
              <Maximize2 className="w-6 h-6 text-gray-600 hover:text-gray-900 transition" />
            </button>
          </div>
          <h3 className="text-2xl font-bold mb-4">{c.title} vs Epoch</h3>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={c.data}>
                <CartesianGrid stroke="#000" strokeDasharray="3 3" />
                <XAxis
                  dataKey="epoch"
                  stroke="#000"
                  ticks={baseData
                    .filter((d, i) => d.epoch % 25 === 0)
                    .map((d) => d.epoch)}
                  label={{
                    value: "Epoch",
                    position: "insideBottomRight",
                    offset: -5,
                    fill: "#000",
                  }}
                  tick={{ fill: "#000" }}
                  margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  stroke="#000"
                  tick={{ fill: "#000" }}
                  tickFormatter={
                    c.key === "accuracy"
                      ? (v) => (v * 100).toFixed(0) + "%"
                      : undefined
                  }
                  label={{
                    value: c.yLabel,
                    angle: -90,
                    position: "insideLeft",
                    fill: "#000",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#000",
                  }}
                  labelStyle={{ color: "#000" }}
                  itemStyle={{ color: "#000" }}
                  formatter={(v) =>
                    c.key === "accuracy" ? (v * 100).toFixed(2) + "%" : v
                  }
                />
                <Line
                  type="monotone"
                  dataKey={c.dataKey}
                  stroke="#000"
                  strokeWidth={2}
                  dot={false}
                />
                <Brush
                  dataKey="epoch"
                  height={30}
                  stroke="#000"
                  travellerStroke="#000"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <AnimatePresence>
            {active === c.key && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActive(null)}
              >
                <motion.div
                  className="bg-white rounded-3xl shadow-4xl p-8 relative w-[90vw] h-[80vh]"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-4 right-4"
                    onClick={() => setActive(null)}
                  >
                    <X className="w-6 h-6 text-gray-600 hover:text-gray-900 transition" />
                  </button>
                  <h3 className="text-3xl font-bold mb-6 text-center">
                    {c.title} vs Epoch
                  </h3>
                  <div className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={c.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="epoch" />
                        <YAxis
                          domain={["auto", "auto"]}
                          tickFormatter={
                            c.key === "accuracy"
                              ? (v) => (v * 100).toFixed(0) + "%"
                              : undefined
                          }
                          label={{
                            value: c.yLabel,
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip
                          formatter={(v) =>
                            c.key === "accuracy"
                              ? (v * 100).toFixed(2) + "%"
                              : v
                          }
                        />
                        <Line
                          type="monotone"
                          dataKey={c.dataKey}
                          stroke="#4f46e5"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Brush dataKey="epoch" height={40} stroke="#4f46e5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
