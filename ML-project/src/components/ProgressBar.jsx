import React from "react";
import { motion } from "framer-motion";
import { Check, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  { label: "Architecture" },
  { label: "Settings" },
  { label: "Data" },
  { label: "Review" },
];

export default function ProgressBar({ currentStep }) {
  const navigate = useNavigate();

  return (
    <nav className="w-full flex items-center justify-between pt-4 pb-4 border-b">
      {/* Progress steps */}
      <div
        className="flex items-center ml-8"
        style={{ width: "calc(78% - 30px)" }}
      >
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          return (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center relative">
                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted
                      ? "bg-black text-white"
                      : isActive
                      ? "border-2 border-black text-black"
                      : "border-2 border-gray-300 text-gray-300"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span
                  className={`mt-2 text-xs ${
                    isCompleted || isActive ? "text-black" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex-1 h-1 mb-[18px] ${
                    isCompleted ? "bg-black" : "bg-gray-300"
                  }`}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Separator */}
      <div className="h-8 border-l border-gray-300" />

      {/* Home Button */}
      <motion.div
        className="flex items-center -ml-14"
        whileHover={{ scale: 1.15, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-6 py-3 bg-white text-black font-semibold rounded-2xl shadow-md hover:bg-gray-100 transition-all duration-200"
        >
          <Home size={24} />
          <span className="text-md">Home</span>
        </button>
      </motion.div>
    </nav>
  );
}
