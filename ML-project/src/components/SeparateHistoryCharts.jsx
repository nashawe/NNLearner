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
  Legend,
  ReferenceLine, // Brush removed
} from "recharts";
import {
  Maximize2,
  Minimize2,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Theme ---
const theme = {
  surface: "bg-slate-900",
  card: "bg-slate-800/70 backdrop-blur-md border border-slate-700/50",
  textPrimary: "text-slate-100",
  textSecondary: "#d1d5db", // Brighter for axis ticks/labels
  textMuted: "text-slate-500",
  accentLoss: `rgb(var(--color-rose-rgb, 225 29 72))`, // Rose for Loss (theme.accentTertiary)
  accentAccuracy: `rgb(var(--color-emerald-rgb, 16 185 129))`, // Emerald for Accuracy (theme.accentSecondary)
  accentLR: `rgb(var(--color-sky-rgb, 14 165 233))`, // Sky for Learning Rate (theme.accent)
  gridStroke: "rgba(255, 255, 255, 0.1)",
  tooltipBg: "bg-slate-800",
  tooltipBorder: "border-slate-600",
  divider: "border-slate-700", // Added for consistency
};

// Updated chartLineColors to use direct theme values from above
const chartLineColors = {
  loss: theme.accentLoss,
  accuracy: theme.accentAccuracy,
  lr: theme.accentLR,
};

// Helper to format ticks
const formatWholeNumberTick = (tick) => Math.round(tick);
const formatLRTick = (tick) => {
  if (tick === 0) return "0";
  if (tick < 0.0001 && tick > 0) return tick.toExponential(1); // Use scientific for very small
  return parseFloat(tick.toFixed(5)).toString(); // Show up to 5 decimal places, remove trailing zeros
};

const ChartCard = ({
  title,
  chartData,
  yLabelFormat,
  yAxisDomain = ["auto", "auto"],
  lineColor,
  icon: Icon,
  onMaximize,
  dataKey, // Added dataKey for specific yAxis formatting
}) => {
  if (!chartData || chartData.length === 0) {
    /* ... (no data handling unchanged) ... */
    return (
      <div
        className={`w-full h-80 flex flex-col items-center justify-center ${theme.card} rounded-2xl p-6`}
      >
        {" "}
        <Icon size={32} className={`mb-3 ${theme.textMuted}`} />{" "}
        <h3 className={`text-lg font-semibold ${theme.textSecondary} mb-2`}>
          {title}
        </h3>{" "}
        <p className={theme.textMuted}>No data available yet.</p>{" "}
      </div>
    );
  }

  const yTickFormatter =
    dataKey === "lr"
      ? formatLRTick
      : dataKey === "accuracy"
      ? (v) => `${formatWholeNumberTick(v)}%`
      : formatWholeNumberTick;

  return (
    <motion.div
      className={`relative ${theme.card} rounded-2xl shadow-2xl p-4 sm:p-6 hover:shadow-slate-950/50 transition-shadow duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "circOut" }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Icon size={20} style={{ color: lineColor }} />
          <h3
            className={`text-lg sm:text-xl font-semibold ${theme.textPrimary}`}
          >{`${title}`}</h3>
        </div>
        <motion.button
          onClick={onMaximize}
          className={`p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          title="Maximize Chart"
        >
          <Maximize2 size={18} />
        </motion.button>
      </div>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 25, left: 5, bottom: 10 }}
          >
            {" "}
            {/* Increased bottom margin */}
            <CartesianGrid
              stroke={theme.gridStroke}
              strokeDasharray="2 2"
            />{" "}
            {/* More subtle dash */}
            <XAxis
              dataKey="epoch"
              stroke={theme.textSecondary} // Brighter axis line
              tick={{ fontSize: 10, fill: theme.textSecondary }}
              tickFormatter={(tick) =>
                tick % 25 === 0 || tick === 1 || tick === chartData.length
                  ? formatWholeNumberTick(tick)
                  : ""
              }
              dy={8} // Increased distance from axis line
            />
            <YAxis
              stroke={theme.textSecondary} // Brighter axis line
              tick={{ fontSize: 10, fill: theme.textSecondary }}
              tickFormatter={yTickFormatter}
              domain={yAxisDomain}
              allowDataOverflow={false}
              width={40} // Slightly more width for Y-axis labels
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.tooltipBg,
                borderColor: theme.divider,
                borderRadius: "0.5rem",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              }}
              labelStyle={{
                color: theme.textPrimary,
                fontWeight: "semibold",
                marginBottom: "0.25rem",
                borderBottom: `1px solid ${theme.divider}`,
                paddingBottom: "0.25rem",
              }}
              formatter={(value) => [
                yLabelFormat ? yLabelFormat(value) : value,
                title,
              ]} // Use passed yLabelFormat
              cursor={{
                stroke: lineColor,
                strokeWidth: 1.5,
                strokeDasharray: "3 3",
                opacity: 0.6,
              }} // Slightly thicker cursor
              itemStyle={{ color: lineColor }} // Ensure this is applied
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "15px" }} // More padding
              formatter={(value) => (
                <span style={{ color: lineColor }} className="opacity-80">
                  {value}
                </span>
              )} // Legend text uses line color
            />
            <Line
              type="basis" // Smoother curve type
              dataKey="value"
              name={title}
              stroke={lineColor}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                fill: lineColor,
                stroke: theme.surface,
              }}
              isAnimationActive={true}
              animationDuration={700}
              animationEasing="ease-out"
            />
            {title === "Accuracy" && (
              <ReferenceLine
                y={100}
                label={{
                  value: "Max",
                  position: "insideTopRight",
                  fill: theme.textSecondary,
                  fontSize: 10,
                }}
                stroke={theme.textSecondary}
                strokeDasharray="4 4"
                strokeOpacity={0.4}
              />
            )}
            {title === "Loss" && (
              <ReferenceLine
                y={0}
                label={{
                  value: "Min",
                  position: "insideBottomRight",
                  fill: theme.textSecondary,
                  fontSize: 10,
                }}
                stroke={theme.textSecondary}
                strokeDasharray="4 4"
                strokeOpacity={0.4}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Brush Removed */}
    </motion.div>
  );
};

const FullScreenChartModal = ({ chartConfig, chartData, onClose }) => {
  if (!chartConfig || !chartData) return null;

  const yTickFormatterModal =
    chartConfig.dataKey === "lr"
      ? formatLRTick
      : chartConfig.dataKey === "accuracy"
      ? (v) => `${formatWholeNumberTick(v)}%`
      : formatWholeNumberTick;

  return (
    <motion.div
      /* ... (Modal backdrop styling as before) ... */ className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        /* ... (Modal content box styling as before) ... */ className={`relative ${theme.card} rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] sm:h-[90vh] p-4 sm:p-6 flex flex-col`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <chartConfig.icon
              size={22}
              style={{ color: chartConfig.lineColor }}
            />
            <h3
              className={`text-xl sm:text-2xl font-semibold ${theme.textPrimary}`}
            >
              {chartConfig.title} vs Epoch
            </h3>
          </div>
          <motion.button
            onClick={onClose}
            className={`p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors`}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            title="Close"
          >
            <Minimize2 size={20} />
          </motion.button>
        </div>
        <div className="flex-grow w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 15, bottom: 30 }}
            >
              {" "}
              {/* Increased margins for labels */}
              <CartesianGrid stroke={theme.gridStroke} strokeDasharray="2 2" />
              <XAxis
                dataKey="epoch"
                stroke={theme.textSecondary}
                tick={{ fontSize: 11, fill: theme.textSecondary }}
                dy={8}
                label={{
                  value: "Epoch",
                  position: "insideBottom",
                  offset: -20,
                  fill: theme.textSecondary,
                  fontSize: 12,
                }}
              />
              <YAxis
                stroke={theme.textSecondary}
                tick={{ fontSize: 11, fill: theme.textSecondary }}
                tickFormatter={yTickFormatterModal}
                domain={chartConfig.yAxisDomain || ["auto", "auto"]}
                allowDataOverflow={false}
                label={{
                  value: chartConfig.yLabel,
                  angle: -90,
                  position: "insideLeft",
                  fill: theme.textSecondary,
                  fontSize: 12,
                  dx: -10,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.tooltipBg,
                  borderColor: theme.divider,
                  borderRadius: "0.5rem",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                }}
                labelStyle={{
                  color: theme.textPrimary,
                  fontWeight: "semibold",
                  marginBottom: "0.25rem",
                  borderBottom: `1px solid ${theme.divider}`,
                  paddingBottom: "0.25rem",
                }}
                formatter={(value) => [
                  chartConfig.yLabelFormat
                    ? chartConfig.yLabelFormat(value)
                    : value,
                  chartConfig.title,
                ]}
                cursor={{
                  stroke: chartConfig.lineColor,
                  strokeWidth: 1.5,
                  strokeDasharray: "3 3",
                  opacity: 0.6,
                }}
                itemStyle={{ color: chartConfig.lineColor }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "15px",
                  paddingBottom: "5px",
                }}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }} className="opacity-90">
                    {value}
                  </span>
                )}
              />
              <Line
                type="basis"
                dataKey="value"
                name={chartConfig.title}
                stroke={chartConfig.lineColor}
                strokeWidth={2.5}
                dot={{ r: 2, strokeWidth: 1, fill: chartConfig.lineColor }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: chartConfig.lineColor,
                  stroke: theme.surface,
                }}
                animationDuration={700}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function SeparateHistoryCharts({
  loss,
  accuracy,
  learning_rate,
}) {
  const [activeChartKey, setActiveChartKey] = useState(null);

  const baseData =
    loss && accuracy && learning_rate
      ? loss.map((v, i) => ({
          epoch: i + 1,
          loss: parseFloat(v.toFixed(6)),
          accuracy: parseFloat(accuracy[i].toFixed(6)) * 100,
          lr: parseFloat(learning_rate[i].toFixed(8)),
        }))
      : [];

  const chartsConfig = [
    {
      key: "loss",
      title: "Loss Trajectory",
      dataKey: "loss",
      yLabel: "Value",
      yLabelFormat: (v) => v.toFixed(4),
      lineColor: chartLineColors.loss,
      icon: TrendingDown,
      yAxisDomain: [0, "auto"],
    },
    {
      key: "accuracy",
      title: "Accuracy Progression",
      dataKey: "accuracy",
      yLabel: "%",
      yLabelFormat: (v) => `${parseFloat(v).toFixed(2)}%`,
      lineColor: chartLineColors.accuracy,
      icon: TrendingUp,
      yAxisDomain: [0, 100],
    },
    {
      key: "lr",
      title: "Learning Rate Schedule",
      dataKey: "lr",
      yLabel: "Value",
      yLabelFormat: (v) => parseFloat(v.toFixed(7)).toString(),
      lineColor: chartLineColors.lr,
      icon: Activity,
      yAxisDomain: ["auto", "auto"],
    },
  ];

  const activeChartConfig = chartsConfig.find((c) => c.key === activeChartKey);

  if (baseData.length === 0) {
    /* ... (no data handling unchanged) ... */
    return (
      <div className={`p-8 text-center ${theme.textMuted}`}>
        Preparing chart data...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {chartsConfig.map((chart) => (
        <ChartCard
          key={chart.key}
          title={chart.title}
          chartData={baseData.map((d) => ({
            epoch: d.epoch,
            value: d[chart.dataKey],
          }))}
          dataKey={chart.dataKey} // Pass dataKey for specific formatting
          yLabelFormat={chart.yLabelFormat}
          yAxisDomain={chart.yAxisDomain}
          lineColor={chart.lineColor}
          icon={chart.icon}
          onMaximize={() => setActiveChartKey(chart.key)}
        />
      ))}
      <AnimatePresence>
        {activeChartKey && activeChartConfig && (
          <FullScreenChartModal
            chartConfig={activeChartConfig}
            chartData={baseData.map((d) => ({
              epoch: d.epoch,
              value: d[activeChartConfig.dataKey],
            }))}
            onClose={() => setActiveChartKey(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
