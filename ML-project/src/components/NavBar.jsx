import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import PraxisLogo from "../assets/praxis-logo.svg";

const steps = [
  { id: 1, label: "build architecture" },
  { id: 2, label: "tune hyperparameters" },
  { id: 3, label: "select type" },
  { id: 4, label: "input data" },
  { id: 5, label: "view summary" },
];

export default function NavBar({ currentStep }) {
  return (
    <nav className="w-full bg-white flex items-center justify-between border-b px-6 py-3">
      {/* "Place your SVG logo here" */}
      <img src={PraxisLogo} alt="Praxis Logo" className="w-32 h-32" />

      <div className="flex-1 flex justify-center relative">
        <ul className="flex items-center">
          {steps.map((step, index) => {
            const active = step.id === currentStep;
            const completed = step.id < currentStep;
            return (
              <li key={step.id} className="flex items-center">
                {/* line before circle except first */}
                {index > 0 && (
                  <motion.div
                    className="h-0.5 flex-1"
                    initial={{ backgroundColor: "#d1d5db" }}
                    animate={{
                      backgroundColor: completed ? "#000000" : "#d1d5db",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0.5, scale: 0.8 }}
                    animate={{
                      opacity: active || completed ? 1 : 0.5,
                      scale: active ? 1.2 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="mb-1"
                  >
                    {completed || active ? (
                      <CheckCircle
                        size={24}
                        className={active ? "text-black" : "text-gray-400"}
                      />
                    ) : (
                      <Circle size={24} className="text-gray-400" />
                    )}
                  </motion.div>

                  <motion.span
                    initial={{ color: "#9CA3AF" }}
                    animate={{ color: active ? "#000000" : "#9CA3AF" }}
                    transition={{ duration: 0.3 }}
                    className="text-xs tracking-wide text-center uppercase"
                  >
                    {step.label}
                  </motion.span>
                </div>
                {/* line after circle except last */}
                {index < steps.length - 1 && <div className="w-4" />}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex-shrink-0" />
    </nav>
  );
}
