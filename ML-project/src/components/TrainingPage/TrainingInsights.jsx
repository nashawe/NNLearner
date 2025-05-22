// src/components/TrainingPage/TrainingInsights_revamped.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Info,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  Activity,
  Sparkles,
  Brain,
  Gauge,
  Settings2,
} from "lucide-react";

const theme = {
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-400",
  accentPositive: "emerald",
  accentNeutral: "sky",
  accentWarning: "amber",
  accentCritical: "rose",
  accentSuggestion: "amber", // Or a different color for suggestions like 'violet' or 'teal'
  card: "bg-slate-800/70 backdrop-blur-md border border-slate-700/50",
  divider: "border-slate-700",
};

// REVAMPED Analysis Function
function getAdvancedTrainingSummary_revamped(
  history,
  settings,
  layersFromArchitecture
) {
  if (!history || !history.loss?.length || !history.accuracy?.length) {
    return {
      title: "Analysis Pending",
      points: [
        {
          type: "neutral",
          icon: Info,
          text: "Training data is incomplete or not yet available.",
        },
      ],
      suggestions: [],
      overallSentiment: "neutral",
    };
  }

  const points = [];
  const suggestions = [];
  let overallSentiment = "neutral"; // Will be positive, warning, critical

  const lossCurve = history.loss;
  const accuracyCurve = history.accuracy;
  const lrCurve = history.learning_rate || [];
  const numEpochsRun = lossCurve.length;
  const targetEpochs = settings.epochs || numEpochsRun; // Ensure targetEpochs is defined

  const initialLoss = lossCurve[0];
  const finalLoss = lossCurve[numEpochsRun - 1];
  const minLoss = Math.min(...lossCurve);
  const minLossEpoch = lossCurve.indexOf(minLoss) + 1;

  const initialAccuracy = accuracyCurve[0] * 100;
  const finalAccuracy = accuracyCurve[numEpochsRun - 1] * 100;
  const maxAccuracy = Math.max(...accuracyCurve) * 100;
  const maxAccuracyEpoch = accuracyCurve.indexOf(maxAccuracy / 100) + 1;

  const isPerfectAccuracy = finalAccuracy >= 99.9;
  const isHighAccuracy = finalAccuracy >= 95;
  const isGoodAccuracy = finalAccuracy >= 80;
  const isModerateAccuracy = finalAccuracy >= 60;

  // --- Overall Performance Sentiment ---
  if (isPerfectAccuracy) {
    overallSentiment = "positive";
    points.push({
      type: "positive",
      icon: Sparkles,
      text: `Achieved exceptional training accuracy of ${finalAccuracy.toFixed(
        2
      )}%. The model has mastered the training data.`,
    });
  } else if (isHighAccuracy) {
    overallSentiment = "positive";
    points.push({
      type: "positive",
      icon: CheckCircle,
      text: `Reached high training accuracy of ${finalAccuracy.toFixed(
        2
      )}%, indicating strong learning.`,
    });
  } else if (isGoodAccuracy) {
    overallSentiment = "neutral"; // Could be positive if target isn't perfection
    points.push({
      type: "neutral",
      icon: Info,
      text: `Good training accuracy (${finalAccuracy.toFixed(
        2
      )}%) achieved. Further fine-tuning could yield improvements.`,
    });
  } else if (isModerateAccuracy) {
    overallSentiment = "warning";
    points.push({
      type: "warning",
      icon: AlertTriangle,
      text: `Moderate training accuracy (${finalAccuracy.toFixed(
        2
      )}%). The model shows some learning but may need significant adjustments.`,
    });
  } else {
    overallSentiment = "critical";
    points.push({
      type: "critical",
      icon: AlertTriangle,
      text: `Low training accuracy (${finalAccuracy.toFixed(
        2
      )}%) suggests the model struggled significantly.`,
    });
    suggestions.push(
      "Urgently review: Data quality & normalization, model architecture complexity vs. data, learning rate, loss function choice, and label correctness."
    );
  }

  // --- Convergence Speed & Efficiency ---
  if (numEpochsRun > 5) {
    const quickConvergenceEpochThreshold = Math.max(10, targetEpochs * 0.35);
    const slowConvergenceEpochThreshold = targetEpochs * 0.75;

    if (
      maxAccuracyEpoch < quickConvergenceEpochThreshold &&
      numEpochsRun >= quickConvergenceEpochThreshold
    ) {
      points.push({
        type: "positive",
        icon: TrendingUp,
        text: `Rapid Convergence: Peak accuracy of ${maxAccuracy.toFixed(
          2
        )}% was achieved quickly by epoch ${maxAccuracyEpoch}.`,
      });
      if (isHighAccuracy) {
        suggestions.push(
          "Given the rapid convergence, consider if fewer epochs or an early stopping mechanism could save training time in future iterations while maintaining high performance."
        );
      }
    } else if (
      maxAccuracyEpoch > slowConvergenceEpochThreshold &&
      !isHighAccuracy &&
      numEpochsRun > 10
    ) {
      points.push({
        type: "warning",
        icon: TrendingUp, // TrendingUp but with a warning context
        text: `Slow Convergence: Reaching peak accuracy took a considerable number of epochs (${maxAccuracyEpoch}/${numEpochsRun}).`,
      });
      suggestions.push(
        "If learning speed is a concern, explore: a slightly higher (but stable) initial learning rate, a more adaptive optimizer, or ensuring data is optimally preprocessed."
      );
    } else {
      points.push({
        type: "neutral",
        icon: Activity,
        text: `Learning progressed steadily, reaching peak accuracy at epoch ${maxAccuracyEpoch} and final accuracy of ${finalAccuracy.toFixed(
          2
        )}%.`,
      });
    }

    // Over-training / Post-convergence behavior
    if (
      maxAccuracyEpoch < numEpochsRun * 0.8 &&
      numEpochsRun - maxAccuracyEpoch > Math.max(10, targetEpochs * 0.2) &&
      isHighAccuracy
    ) {
      const lossAtMaxAccuracy = lossCurve[maxAccuracyEpoch - 1];
      if (finalLoss < lossAtMaxAccuracy * 0.75 && !settings.useDropout) {
        // Loss significantly dropped after max accuracy
        points.push({
          type: "neutral", // It's an observation, could be a warning for overfitting
          icon: Info,
          text: `Post-Peak Optimization: Loss continued to decrease substantially after peak accuracy was hit at epoch ${maxAccuracyEpoch}.`,
        });
        suggestions.push(
          "While strong training set optimization is good, ensure robust generalization on unseen data. Consider enabling dropout or using a validation set to monitor for overfitting."
        );
      } else {
        points.push({
          type: "positive",
          icon: CheckCircle,
          text: `Stable Performance: Model maintained high accuracy after reaching its peak around epoch ${maxAccuracyEpoch}.`,
        });
      }
    }
  }

  // --- Loss Analysis ---
  points.push({
    type: "neutral",
    icon: Gauge,
    text: `Loss started at ${initialLoss.toFixed(
      4
    )} and ended at ${finalLoss.toFixed(4)} (min: ${minLoss.toFixed(
      4
    )} at epoch ${minLossEpoch}).`,
  });

  const lossReductionRatio =
    initialLoss > 1e-9
      ? (initialLoss - finalLoss) / initialLoss
      : finalLoss === 0
      ? 1
      : 0;

  if (
    lossReductionRatio < 0.1 &&
    finalLoss > 0.1 &&
    numEpochsRun > 10 &&
    overallSentiment !== "critical"
  ) {
    points.push({
      type: "warning",
      icon: AlertTriangle,
      text: "Limited Loss Reduction: The loss did not decrease substantially during training.",
    });
    if (overallSentiment === "neutral") overallSentiment = "warning";
    suggestions.push(
      "Investigate: Learning rate (too low/high?); Model capacity (too simple for data?); Weight initialization; Data normalization and quality."
    );
  } else if (lossReductionRatio < 0 && initialLoss > 1e-5 && numEpochsRun > 3) {
    points.push({
      type: "critical",
      icon: AlertTriangle,
      text: "Critical: Training loss increased or stagnated. This indicates a serious problem.",
    });
    overallSentiment = "critical";
    suggestions.push(
      "Check for: Exploding gradients (reduce LR drastically, use gradient clipping if possible); Incorrect loss function for the task; Severe data issues (unnormalized, NaN values, incorrect labels)."
    );
  }

  // Plateau detection (more nuanced)
  if (numEpochsRun > 20) {
    const lastChunkSize = Math.max(5, Math.floor(numEpochsRun * 0.1));
    if (lossCurve.length >= lastChunkSize * 2) {
      const avgLossLastChunk =
        lossCurve.slice(-lastChunkSize).reduce((a, b) => a + b, 0) /
        lastChunkSize;
      const avgLossPrevChunk =
        lossCurve
          .slice(-lastChunkSize * 2, -lastChunkSize)
          .reduce((a, b) => a + b, 0) / lastChunkSize;
      const relativeChange =
        avgLossPrevChunk > 1e-9
          ? Math.abs(avgLossLastChunk - avgLossPrevChunk) / avgLossPrevChunk
          : 0;

      if (
        relativeChange < 0.02 && // Less than 2% change
        numEpochsRun > targetEpochs * 0.5 &&
        !isPerfectAccuracy // Only a concern if not yet perfect
      ) {
        points.push({
          type: "warning",
          icon: Info,
          text: "Learning Plateau: Loss and accuracy showed minimal improvement in later epochs.",
        });
        if (overallSentiment !== "critical") {
          suggestions.push(
            "If target accuracy isn't met: Consider a learning rate adjustment (e.g., scheduler or manual reduction), trying a different optimizer, or carefully re-evaluating model architecture or data preprocessing."
          );
        }
      }
    }
  }

  // --- Settings & Architecture Commentary ---
  let modelDesc = "Model with ";
  if (layersFromArchitecture && layersFromArchitecture.length > 0) {
    const hiddenLayers = layersFromArchitecture.filter(
      (l) => l.type === "hidden"
    );
    const numHidden = hiddenLayers.length;
    modelDesc += `${numHidden} hidden layer(s)`;
    if (numHidden > 0) {
      modelDesc += ` (sizes: ${hiddenLayers
        .map((l) => l.neurons)
        .join(", ")}).`;
    } else {
      modelDesc += ".";
    }
    points.push({ type: "neutral", icon: Brain, text: modelDesc });

    if (
      numHidden === 0 &&
      !isHighAccuracy &&
      settings.mode_id !== 1 &&
      settings.mode_id !== 3
    ) {
      // mode_id 1 (Linear Regression) and 3 (Logistic Regression) are expected to be shallow
      suggestions.push(
        "The current shallow architecture (no hidden layers) might be too simple for the dataset's complexity. Consider adding hidden layers if the task is non-linear."
      );
    } else if (
      numHidden > 3 &&
      isHighAccuracy &&
      maxAccuracyEpoch > targetEpochs * 0.6
    ) {
      // Deep model, good accuracy, but took a while
      suggestions.push(
        "The deep architecture learned well. For faster iterations, you could explore if a slightly shallower or wider model (within limits) achieves similar results more quickly."
      );
    }
  }

  if (settings.useLrScheduler && lrCurve.length > 1) {
    const lrChangedSignificantly = lrCurve[numEpochsRun - 1] < lrCurve[0] * 0.8;
    points.push({
      type: "neutral",
      icon: Settings2,
      text: `Learning Rate Scheduler was active. Initial LR: ${lrCurve[0].toExponential(
        1
      )}, Final LR: ${lrCurve[numEpochsRun - 1].toExponential(1)}. ${
        lrChangedSignificantly
          ? "Effective decay observed."
          : "Minimal decay observed."
      }`,
    });
  }

  if (settings.useDropout && settings.dropout > 0) {
    points.push({
      type: "positive",
      icon: Settings2,
      text: `Dropout (${(settings.dropout * 100).toFixed(
        0
      )}%) was active, aiding model generalization.`,
    });
  } else if (isPerfectAccuracy) {
    suggestions.push(
      "Achieved perfect training accuracy. As a best practice for robust generalization to new data, consider enabling dropout in future experiments, especially with complex models or limited datasets."
    );
  }

  // --- Final Title & Default Suggestions ---
  let title = "Training Analysis";
  if (overallSentiment === "positive" && isPerfectAccuracy)
    title = "Optimal Training Performance Mastered!";
  else if (overallSentiment === "positive")
    title = "Strong Training Performance Achieved!";
  else if (overallSentiment === "warning")
    title = "Training Review: Observations & Recommendations";
  else if (overallSentiment === "critical")
    title = "Training Alert: Critical Issues Identified";

  if (suggestions.length === 0) {
    if (isPerfectAccuracy) {
      suggestions.push(
        "Model mastered the training data! Key next steps: rigorously evaluate on a separate, unseen test set to confirm generalization. Experiment with more challenging datasets."
      );
    } else if (isHighAccuracy) {
      suggestions.push(
        "Excellent performance on the training set. Validate thoroughly on a test set. Consider minor hyperparameter tuning if aiming for perfection or faster convergence."
      );
    } else {
      suggestions.push(
        "Analyze graphs for detailed trends. Standard hyperparameter tuning (learning rate, optimizer, batch size, architecture) may yield improvements. Ensure data is clean and appropriate for the task."
      );
    }
  }

  // Remove duplicate suggestions (simple check)
  const uniqueSuggestions = Array.from(new Set(suggestions));

  return { title, points, suggestions: uniqueSuggestions, overallSentiment };
}

// The TrainingInsights React Component (Identical Structure to original)
const TrainingInsights = ({ history, settings, layersFromArchitecture }) => {
  const { title, points, suggestions, overallSentiment } = useMemo(() => {
    return getAdvancedTrainingSummary_revamped(
      // Call the new function
      history,
      settings || {},
      layersFromArchitecture || []
    );
  }, [history, settings, layersFromArchitecture]);

  if (!history) {
    return (
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
        className={`text-${theme.accentWarning}-400`} // Tailwind JIT needs full class names
      />
    ),
    critical: (
      <AlertTriangle size={24} className={`text-${theme.accentCritical}-400`} />
    ),
  };

  const itemVariants = (type) => ({
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
          ? `insights-${history.loss.length}-${history.accuracy.slice(-1)[0]}`
          : "no-history-insights"
      } // Slightly more robust key for re-animation on data change
      className={`${theme.card} p-6 sm:p-8 rounded-2xl shadow-2xl mt-10 sm:mt-12 w-full`}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`flex items-start sm:items-center gap-3.5 mb-5 border-b ${theme.divider} pb-4`}
      >
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
                  key={`obs-${pt.text.slice(0, 15)}-${i}`} // More unique key
                  custom={i}
                  variants={itemVariants("observation")}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start gap-2.5"
                >
                  {pt.icon ? (
                    <pt.icon
                      size={16}
                      className={`mt-0.5 shrink-0 opacity-90
                        ${
                          pt.type === "positive"
                            ? `text-${theme.accentPositive}-500`
                            : pt.type === "warning"
                            ? `text-${theme.accentWarning}-500`
                            : pt.type === "critical"
                            ? `text-${theme.accentCritical}-500`
                            : `text-${theme.accentNeutral}-500`
                        }`}
                    />
                  ) : (
                    <span
                      className={`mt-1.5 w-2 h-2 rounded-full opacity-90 shrink-0
                                        ${
                                          pt.type === "positive"
                                            ? `bg-${theme.accentPositive}-500`
                                            : pt.type === "warning"
                                            ? `bg-${theme.accentWarning}-500`
                                            : pt.type === "critical"
                                            ? `bg-${theme.accentCritical}-500`
                                            : `bg-${theme.accentNeutral}-500`
                                        }`}
                    />
                  )}
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
        <div
          className={`md:border-l md:pl-8 ${theme.divider} md:border-opacity-50`}
        >
          <h4
            className={`text-lg font-medium text-${theme.accentSuggestion}-400 mb-3 flex items-center gap-2`}
          >
            <Lightbulb size={18} /> Potential Next Steps:
          </h4>
          {suggestions.length > 0 ? (
            <ul
              className={`space-y-2.5 text-sm ${theme.textSecondary} leading-relaxed`}
            >
              {suggestions.map((sug, i) => (
                <motion.li
                  key={`sug-${sug.slice(0, 15)}-${i}`} // More unique key
                  custom={i}
                  variants={itemVariants("suggestion")}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start gap-2.5 hover:text-slate-100 transition-colors"
                >
                  <Zap
                    size={15}
                    className={`mt-1 shrink-0 text-${theme.accentSuggestion}-500 opacity-80`}
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
