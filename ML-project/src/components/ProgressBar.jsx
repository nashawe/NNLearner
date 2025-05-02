import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { label: "Architecture" },
  { label: "Settings" },
  { label: "Mode" },
  { label: "Payload" },
  { label: "Review" },
];

export default function ProgressBar({ currentStep }) {
  return (
    <nav className="w-full flex justify-center pt-4 pb-4 border-b">
      <div className="w-3/4 flex items-center">
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
                      ? "bg-blue-600 text-white"
                      : isActive
                      ? "border-2 border-blue-600 text-blue-600"
                      : "border-2 border-gray-300 text-gray-300"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span
                  className={`mt-2 text-xs ${
                    isCompleted || isActive ? "text-blue-600" : "text-gray-400"
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
                  className={`flex-1 h-1 ${
                    isCompleted ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
