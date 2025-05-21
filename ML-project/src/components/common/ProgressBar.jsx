// src/components/common/ProgressBar.jsx
import React from "react";
import { motion } from "framer-motion";
import { Home, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const theme = {
  bg: "bg-slate-900",
  surfaceContrast: "bg-slate-700",
  textPrimary: "text-slate-50",
  textMuted: "text-slate-400",
  accentCurrent: "sky",
  accentCompleted: "emerald",
  divider: "border-slate-700", // For the vertical line
};

const DEFAULT_STEP_NAMES = [
  "Architecture",
  "Settings",
  "Data Payload",
  "Review & Train",
];

const ProgressBar = ({
  currentStep,
  totalSteps = 4,
  stepNames = DEFAULT_STEP_NAMES,
}) => {
  const navigate = useNavigate();

  const lineFillVariants = {
    empty: { pathLength: 0, opacity: 0.5 },
    filled: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "circOut", delay: 0.1 },
    },
  };

  return (
    <div
      className={`w-full px-4 sm:px-6 md:px-8 py-3 ${theme.bg} border-b ${theme.divider} sticky top-0 z-30 shadow-lg`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-6">
        {" "}
        {/* Main flex container */}
        {/* Home Button - Now part of the flex flow */}
        <motion.button
          onClick={() => navigate("/")}
          className={`p-2.5 rounded-full ${theme.surfaceContrast} hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 ring-offset-2 ring-offset-slate-900 focus:ring-${theme.accentCurrent}-500/70`}
          whileHover={{ scale: 1.1, rotate: -3 }}
          whileTap={{ scale: 0.9 }}
          title="Go to Home Page"
        >
          <Home size={20} className={`text-${theme.accentCurrent}-300`} />
        </motion.button>
        {/* Subtle Vertical Divider */}
        <div className={`h-8 w-px ${theme.divider} hidden sm:block`}></div>{" "}
        {/* Only show on sm and up for space */}
        {/* Steps - Will take up remaining space and center its items */}
        <div className="flex items-center justify-center flex-grow">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNumber = i + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <React.Fragment key={stepNumber}>
                <motion.div
                  className="flex flex-col items-center text-center relative"
                  // variants={stepItemVariants} // If defined for individual step entrance
                >
                  <motion.div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ease-out
                      ${
                        isActive
                          ? `bg-${theme.accentCurrent}-500 border-${theme.accentCurrent}-400 text-white shadow-lg shadow-${theme.accentCurrent}-500/40`
                          : isCompleted
                          ? `bg-${theme.accentCompleted}-500 border-${theme.accentCompleted}-400 text-white`
                          : `${theme.surfaceContrast} border-slate-600 ${theme.textMuted}`
                      }`}
                    initial={false} // Let parent handle entrance if any
                    animate={{
                      scale: isActive ? 1.15 : isCompleted ? 1.05 : 0.9,
                      opacity: isActive || isCompleted ? 1 : 0.6,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  >
                    {isCompleted && !isActive ? (
                      <Check size={16} />
                    ) : (
                      stepNumber
                    )}
                  </motion.div>
                  <span
                    className={`mt-2 text-[10px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-300
                    ${
                      isActive
                        ? `text-${theme.accentCurrent}-300`
                        : isCompleted
                        ? `text-${theme.accentCompleted}-300`
                        : theme.textMuted
                    }`}
                  >
                    {stepNames[i] || `Step ${stepNumber}`}
                  </span>
                </motion.div>

                {stepNumber < totalSteps && (
                  <div
                    className={`flex-1 h-1 mx-2 sm:mx-3 md:mx-4 min-w-[25px] sm:min-w-[35px] relative rounded-full ${theme.surfaceContrast}`}
                  >
                    {" "}
                    {/* Adjusted margins and min-width */}
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 100 4"
                      preserveAspectRatio="none"
                      className="absolute top-0 left-0"
                    >
                      <motion.line
                        x1="0"
                        y1="2"
                        x2="100"
                        y2="2"
                        strokeWidth="4"
                        className={
                          isCompleted
                            ? `stroke-${theme.accentCompleted}-500`
                            : // Fill line to active step if previous is completed
                            isActive && i < currentStep - 1
                            ? `stroke-${theme.accentCompleted}-500`
                            : // Fill line from active step if current is the active one
                            isActive && stepNumber === currentStep - 1
                            ? `stroke-${theme.accentCurrent}-500`
                            : `stroke-transparent`
                        }
                        variants={lineFillVariants}
                        initial="empty"
                        animate={
                          isCompleted || (isActive && i === currentStep - 2) // Fill if previous is completed or is current and this line leads to current
                            ? "filled"
                            : "empty"
                        }
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        {/* Optional: Right side element for balance if needed, or remove if steps center well */}
        {/* For true centering of steps, this might need to be the same width as Home + Divider */}
        <div
          className="w-[50px] sm:w-[62px] hidden sm:block"
          aria-hidden="true"
        >
          {" "}
          {/* Approx width of home button + divider + gap */}
          {/* This helps center the middle "steps" section if the home button + divider take up space */}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
