// src/components/TrainingPage/TrainingInsights.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Info,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Layers as LayersIcon,
  Cpu,
  Brain,
  Activity,
} from "lucide-react";

const theme = {
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  accentPositive: "emerald",
  accentNeutral: "sky",
  accentWarning: "amber",
  accentCritical: "rose",
  accentSuggestion: "amber",
  card: "bg-slate-800/70 backdrop-blur-md border border-slate-700/50",
  divider: "border-slate-700",
};

// Corrected and Enhanced Analysis Function
function getAdvancedTrainingSummary(history, settings, layersFromArchitecture) {
  if (!history || !history.loss?.length || !history.accuracy?.length) {
    return {
      title: "Analysis Pending",
      points: [
        {
          type: "neutral",
          text: "Training data is incomplete or not yet available.",
        },
      ],
      suggestions: [],
      overallSentiment: "neutral",
    };
  }

  const points = []; // For observations
  const suggestions = []; // For actionable advice
  let overallSentiment = "neutral";

  const lossCurve = history.loss;
  const accuracyCurve = history.accuracy;
  const lrCurve = history.learning_rate || [];
  const numEpochsRun = lossCurve.length;
  const targetEpochs = settings.epochs;

  const initialLoss = lossCurve[0];
  const finalLoss = lossCurve[numEpochsRun - 1];
  const minLoss = Math.min(...lossCurve);
  const minLossEpoch = lossCurve.indexOf(minLoss) + 1;

  const initialAccuracy = accuracyCurve[0] * 100;
  const finalAccuracy = accuracyCurve[numEpochsRun - 1] * 100;
  const maxAccuracy = Math.max(...accuracyCurve) * 100;
  const maxAccuracyEpoch = accuracyCurve.indexOf(maxAccuracy / 100) + 1;

  // Calculate averages for plateau detection (ensure enough data points)
  const lastChunkSize = Math.max(5, Math.floor(numEpochsRun * 0.1));
  let avgLossLastChunk = finalLoss;
  if (lossCurve.length >= lastChunkSize) {
    avgLossLastChunk =
      lossCurve.slice(-lastChunkSize).reduce((a, b) => a + b, 0) /
      lastChunkSize;
  }
  let avgLossPrevChunk = initialLoss;
  if (lossCurve.length >= lastChunkSize * 2) {
    avgLossPrevChunk =
      lossCurve
        .slice(-lastChunkSize * 2, -lastChunkSize)
        .reduce((a, b) => a + b, 0) / lastChunkSize;
  }

  const significantImprovementEpoch =
    accuracyCurve.findIndex(
      (acc) =>
        acc * 100 >= initialAccuracy + (maxAccuracy - initialAccuracy) * 0.8
    ) + 1 || numEpochsRun;

  // --- Base Observations ---
  points.push({
    type: "neutral",
    text: `Trained for ${numEpochsRun} epochs (target: ${targetEpochs}).`,
  });
  points.push({
    type: "neutral",
    text: `Final Loss: ${finalLoss.toFixed(4)} (best was ${minLoss.toFixed(
      4
    )} at epoch ${minLossEpoch}).`,
  });
  points.push({
    type: "neutral",
    text: `Final Accuracy: ${finalAccuracy.toFixed(
      2
    )}% (best was ${maxAccuracy.toFixed(2)}% at epoch ${maxAccuracyEpoch}).`,
  });

  // --- Sentiment & Core Performance Analysis ---
  if (finalAccuracy >= 98) {
    points.push({
      type: "positive",
      text: "Exceptional training accuracy! The model has learned the training data patterns extremely well.",
    });
    overallSentiment = "positive";
  } else if (finalAccuracy >= 90) {
    points.push({
      type: "positive",
      text: "High training accuracy achieved, indicating effective learning.",
    });
    overallSentiment = "positive";
  } else if (finalAccuracy >= 75) {
    points.push({
      type: "neutral",
      text: "Good training accuracy. Further improvements might be possible with fine-tuning.",
    });
  } else if (finalAccuracy >= 50) {
    points.push({
      type: "warning",
      text: "Moderate training accuracy. The model shows some learning but may benefit from significant adjustments.",
    });
    overallSentiment = "warning";
  } else {
    points.push({
      type: "critical",
      text: "Low training accuracy suggests the model struggled significantly with the training patterns.",
    });
    suggestions.push(
      "Urgently review: data quality, model complexity vs. data complexity, learning rate, and label correctness."
    );
    overallSentiment = "critical";
  }

  // --- Convergence Speed Analysis ---
  if (numEpochsRun > 10) {
    // Only if enough epochs
    if (significantImprovementEpoch < targetEpochs * 0.3 && targetEpochs > 20) {
      points.push({
        type: "neutral",
        text: `Rapid Convergence: Achieved 80% of total accuracy improvement by epoch ${significantImprovementEpoch}.`,
      });
      if (finalAccuracy > 95) {
        suggestions.push(
          "Consider if fewer epochs could yield similar results for faster iterations, or explore early stopping."
        );
      }
    } else if (
      significantImprovementEpoch > targetEpochs * 0.8 &&
      targetEpochs > 20 &&
      finalAccuracy < 90
    ) {
      points.push({
        type: "warning",
        text: "Slow Convergence: The model took a relatively long time to reach its peak performance.",
      });
      suggestions.push(
        "A higher initial learning rate (if stable and data is normalized) or a more adaptive optimizer might accelerate learning."
      );
    } else if (numEpochsRun > 5) {
      // Default if not fitting above categories
      points.push({
        type: "neutral",
        text: "Learning progression appears to have been steady.",
      });
    }
  }

  // --- Loss Reduction & Plateau Analysis ---
  const lossReductionRatio =
    initialLoss > 0
      ? (initialLoss - finalLoss) / initialLoss
      : finalLoss === 0
      ? 1
      : 0;
  if (lossReductionRatio > 0.75) {
    points.push({
      type: "positive",
      text: "Loss decreased substantially (over 75%), indicating effective optimization.",
    });
  } else if (
    lossReductionRatio < 0.15 &&
    finalLoss > 0.2 &&
    numEpochsRun > 10
  ) {
    points.push({
      type: "warning",
      text: "Loss did not decrease substantially. Model might be underfitting or learning very slowly.",
    });
    if (overallSentiment === "neutral") overallSentiment = "warning"; // Elevate sentiment
    suggestions.push(
      "Investigate: Learning rate (too low/high?); Model capacity (too simple?); Weight initialization; Data preprocessing."
    );
  } else if (
    lossReductionRatio <= 0 &&
    numEpochsRun > 5 &&
    initialLoss > 0.001
  ) {
    // Loss increased or stayed same
    points.push({
      type: "critical",
      text: "Critical: Training loss did not decrease or may have increased. This indicates a serious problem.",
    });
    suggestions.push(
      "Check for: Exploding gradients (reduce LR drastically!); Incorrect loss function for the task; Severe data issues (unnormalized, incorrect labels)."
    );
    overallSentiment = "critical";
  }

  if (numEpochsRun > 20 && avgLossPrevChunk > 0) {
    // Plateau check
    const changeInLastChunks = Math.abs(avgLossLastChunk - avgLossPrevChunk);
    if (
      changeInLastChunks < Math.max(minLoss, 0.001) * 0.02 &&
      finalLoss > 0.02 &&
      numEpochsRun > targetEpochs * 0.4
    ) {
      points.push({
        type: "warning",
        text: "Learning Plateau: Loss has stabilized with minimal improvement in later epochs.",
      });
      if (finalAccuracy < 95 && overallSentiment !== "critical") {
        suggestions.push(
          "If target accuracy isn't met, consider reducing learning rate (or use scheduler if off), trying a different optimizer, or exploring model architecture changes (if within parameter limits)."
        );
      }
    }
  }

  // --- Overfitting Hint (especially relevant since 100% accuracy is common) ---
  if (
    maxAccuracy >= 99.9 &&
    finalLoss < 0.01 &&
    maxAccuracyEpoch < numEpochsRun * 0.6 &&
    numEpochsRun > 20
  ) {
    points.push({
      type: "neutral",
      text: "Model achieved near-perfect training accuracy very quickly and maintained it.",
    });
    // Check if loss continued to drop significantly after max accuracy was hit
    const lossAfterMaxAccuracy = lossCurve.slice(maxAccuracyEpoch - 1); // -1 because epoch is 1-indexed
    if (
      lossAfterMaxAccuracy.length > 5 &&
      lossAfterMaxAccuracy[lossAfterMaxAccuracy.length - 1] <
        lossAfterMaxAccuracy[0] * 0.5 &&
      !settings.useDropout
    ) {
      suggestions.push(
        "While 100% training accuracy is excellent, the loss continued to decrease significantly afterwards. This *could* indicate fitting to noise. Ensure robust generalization with a validation set or techniques like dropout if not already active."
      );
    }
  } else if (finalAccuracy >= 99) {
    points.push({
      type: "positive",
      text: "Model has successfully learned the training dataset to a very high degree of accuracy.",
    });
  }

  // --- Underfitting Hint ---
  if (
    overallSentiment !== "critical" &&
    finalAccuracy < 60 &&
    finalLoss > 0.5 &&
    numEpochsRun > targetEpochs * 0.5
  ) {
    points.push({
      type: "warning",
      text: "Potential Underfitting: Model performance is low despite significant training.",
    });
    suggestions.push(
      "Try increasing model capacity (more neurons/layers within limits), using a more complex model mode, or ensuring data is clean and features are relevant."
    );
  }

  // --- Settings Commentary ---
  if (settings.useLrScheduler && lrCurve.length > 1) {
    if (lrCurve[numEpochsRun - 1] < lrCurve[0] * 0.9) {
      points.push({
        type: "neutral",
        text: `Learning Rate Scheduler was active, reducing LR from ${lrCurve[0].toExponential(
          1
        )} to ${lrCurve[numEpochsRun - 1].toExponential(1)}.`,
      });
    } else {
      points.push({
        type: "neutral",
        text: "Learning Rate Scheduler was enabled, but significant LR decay was not observed.",
      });
    }
  }
  if (settings.useDropout && settings.dropout > 0) {
    points.push({
      type: "positive",
      text: `Dropout (${(settings.dropout * 100).toFixed(
        0
      )}%) was active, aiding model generalization.`,
    });
  } else if (
    finalAccuracy >= 99 &&
    (!settings.useDropout || settings.dropout === 0)
  ) {
    suggestions.push(
      "Excellent training accuracy! For robust performance on new data, consider enabling dropout if overfitting becomes a concern."
    );
  }

  // --- Architecture Specific Insights ---
  if (layersFromArchitecture && layersFromArchitecture.length > 0) {
    const inputLayer = layersFromArchitecture.find((l) => l.type === "input");
    const hiddenLayers = layersFromArchitecture.filter(
      (l) => l.type === "hidden"
    );
    const outputLayer = layersFromArchitecture.find((l) => l.type === "output");
    const numHidden = hiddenLayers.length;
    const firstHiddenSize = hiddenLayers[0]?.neurons;

    if (numHidden === 0 && inputLayer && outputLayer) {
      points.push({
        type: "neutral",
        text: "A shallow network (direct input to output, no hidden layers) was used. This is effective for linearly separable data.",
      });
      if (
        finalAccuracy < 85 &&
        overallSentiment !== "critical" &&
        settings.mode_id !== 1 &&
        settings.mode_id !== 3
      ) {
        // If not already a very simple mode
        suggestions.push(
          "For potentially more complex patterns, adding at least one hidden layer (respecting parameter limits) is strongly recommended."
        );
      }
    } else if (numHidden > 0) {
      let archDesc = `Model architecture: ${
        inputLayer?.neurons || "N/A"
      } (Input) → `;
      hiddenLayers.forEach(
        (l, i) => (archDesc += `${l.neurons}${i < numHidden - 1 ? " → " : ""}`)
      );
      archDesc += ` (Hidden x${numHidden}) → ${
        outputLayer?.neurons || "N/A"
      } (Output).`;
      points.push({ type: "neutral", text: archDesc });
    }
    if (
      numHidden > 3 &&
      firstHiddenSize &&
      firstHiddenSize < Math.max(16, (inputLayer?.neurons || 32) / 4) &&
      finalAccuracy < 75
    ) {
      // If deep AND narrow relative to input
      suggestions.push(
        "The network is relatively deep with narrow hidden layers. If underfitting is observed, consider fewer, wider hidden layers or increasing neurons per layer (respecting parameter limits)."
      );
    }
  }

  // --- Concluding Title & Default Suggestion ---
  let title = "Training Analysis";
  if (overallSentiment === "positive")
    title = "Excellent Training Performance!";
  else if (overallSentiment === "warning")
    title = "Training Review & Recommendations";
  else if (overallSentiment === "critical")
    title = "Training Alert: Critical Issues Identified";

  if (suggestions.length === 0 && overallSentiment === "positive") {
    suggestions.push(
      "Model performed exceptionally well on training data! Key next steps: evaluate on a separate test set to confirm generalization, and experiment with variations if desired."
    );
  } else if (suggestions.length === 0) {
    suggestions.push(
      "Analyze the graphs closely for detailed performance trends. Standard hyperparameter tuning (learning rate, optimizer, batch size) may yield further improvements."
    );
  }

  return { title, points, suggestions, overallSentiment };
}

// The TrainingInsights React Component
const TrainingInsights = ({ history, settings, layersFromArchitecture }) => {
  const { title, points, suggestions, overallSentiment } = useMemo(() => {
    // Ensure settings and layersFromArchitecture are passed, even if empty, to avoid undefined errors
    return getAdvancedTrainingSummary(
      history,
      settings || {},
      layersFromArchitecture || []
    );
  }, [history, settings, layersFromArchitecture]);

  if (!history) {
    return (
      // Placeholder while history is null (e.g., initial load or error before history is set)
      <div
        className={`${theme.card} p-6 sm:p-8 rounded-2xl shadow-2xl mt-10 sm:mt-12 w-full text-center`}
      >
        <Info
          size={24}
          className={`mx-auto mb-3 text-${theme.accentNeutral}-400`}
        />
        <p className={theme.textMuted}>
          Awaiting training completion for analysis...
        </p>
      </div>
    );
  }

  const sentimentIconMap = {
    positive: (
      <CheckCircle size={24} className={`text-${theme.accentPositive}-400`} />
    ),
    neutral: <Info size={24} className={`text-${theme.accentNeutral}-400`} />,
    warning: (
      <AlertTriangle
        size={24}
        className={`text-${theme.accentWarning || "amber"}-400`}
      />
    ),
    critical: (
      <AlertTriangle size={24} className={`text-${theme.accentCritical}-400`} />
    ),
  };

  const itemVariants = (type) => ({
    // Renamed from itemVariants in previous example to avoid conflict if copy-pasting
    hidden: {
      opacity: 0,
      x: type === "suggestion" ? 20 : -20,
      filter: "blur(3px)",
    },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.06,
        type: "spring",
        stiffness: 180,
        damping: 16,
      },
    }),
  });

  return (
    <motion.div
      key={
        history
          ? JSON.stringify(history.loss.slice(-1)) +
            JSON.stringify(history.accuracy.slice(-1))
          : "no-history-insights"
      } // More robust key for re-animation
      className={`${theme.card} p-6 sm:p-8 rounded-2xl shadow-2xl mt-10 sm:mt-12 w-full`}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-start sm:items-center gap-3.5 mb-5 border-b ${theme.divider} pb-4">
        {sentimentIconMap[overallSentiment] || (
          <Info size={24} className={`text-${theme.accentNeutral}-400`} />
        )}
        <h3
          className={`text-xl sm:text-2xl font-semibold ${theme.textPrimary}`}
        >
          {title}
        </h3>
      </div>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <h4
            className={`text-lg font-medium ${theme.textPrimary} mb-3 flex items-center gap-2`}
          >
            <Activity size={18} className="opacity-80" /> Key Observations:
          </h4>
          {points.length > 0 ? (
            <ul
              className={`space-y-2.5 text-sm ${theme.textSecondary} leading-relaxed`}
            >
              {points.map((pt, i) => (
                <motion.li
                  key={`obs-${i}`}
                  custom={i}
                  variants={itemVariants("observation")}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start gap-2.5"
                >
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full opacity-90 shrink-0
                                        ${
                                          pt.type === "positive"
                                            ? `bg-${theme.accentPositive}-500`
                                            : pt.type === "warning"
                                            ? `bg-${
                                                theme.accentWarning || "amber"
                                              }-500`
                                            : pt.type === "critical"
                                            ? `bg-${theme.accentCritical}-500`
                                            : `bg-${theme.accentNeutral}-500`
                                        }`}
                  ></span>
                  <span>{pt.text}</span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className={theme.textMuted}>
              No specific observations generated.
            </p>
          )}
        </div>
        <div className="md:border-l md:pl-8 ${theme.divider} md:border-opacity-50">
          <h4
            className={`text-lg font-medium text-${
              theme.accentSuggestion || "amber"
            }-400 mb-3 flex items-center gap-2`}
          >
            <Lightbulb size={18} /> Potential Next Steps:
          </h4>
          {suggestions.length > 0 ? (
            <ul
              className={`space-y-2.5 text-sm ${theme.textSecondary} leading-relaxed`}
            >
              {suggestions.map((sug, i) => (
                <motion.li
                  key={`sug-${i}`}
                  custom={i}
                  variants={itemVariants("suggestion")}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start gap-2.5 hover:text-slate-100 transition-colors"
                >
                  <Zap
                    size={15}
                    className={`mt-1 shrink-0 text-${
                      theme.accentSuggestion || "amber"
                    }-500 opacity-80`}
                  />
                  <span>{sug}</span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className={theme.textMuted}>
              No specific suggestions at this time.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default TrainingInsights;
