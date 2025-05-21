// src/components/Common/ActivationDropdown.jsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Theme (can be adjusted or passed via props/context if more complex)
const theme = {
  inputBg: "bg-slate-700",
  inputBorder: "border-slate-600", // Slightly darker border
  textPrimary: "text-slate-100",
  textSecondary: "text-slate-300",
  surface: "bg-slate-800",
  divider: "border-slate-700",
  accent: "sky", // For hover/focus highlights
};

const ActivationDD = ({
  selected, // Expects an object like { name: "Sigmoid" }
  setSelected, // Expects a function like (option) => void
  optionsList, // Expects an array of objects like [{ name: "Sigmoid" }, { name: "ReLU" }]
  label = "Activation Function:",
  labelClassName = "block text-xs font-medium text-slate-400 mb-1.5",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!optionsList || optionsList.length === 0) {
    // console.warn("ActivationDropdown: optionsList is empty or not provided.");
    return (
      <div className="text-xs text-slate-500">
        No activation options available.
      </div>
    );
  }

  if (!selected || typeof selected.name === "undefined") {
    // console.warn("ActivationDropdown: 'selected' prop is invalid or missing 'name' property.");
    // Provide a sensible default or show an error/placeholder
    selected = optionsList[0] || { name: "Select..." };
  }

  return (
    <div>
      {label && <label className={labelClassName}>{label}</label>}
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg 
                     ${theme.inputBg} border ${theme.inputBorder} 
                     hover:border-${theme.accent}-500 text-sm ${theme.textPrimary} 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-offset-slate-900 focus:ring-${theme.accent}-500 transition-colors`}
          // whileHover={{ borderColor: `rgba(var(--rgb-${theme.accent}-500), 0.7)` }} // If using CSS vars
        >
          <span>{selected.name}</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown size={18} className={`text-slate-400`} />
          </motion.div>
        </motion.button>
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`absolute top-full mt-1.5 w-full ${theme.surface} border ${theme.divider} 
                         rounded-lg shadow-2xl z-30 max-h-60 overflow-y-auto 
                         scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800`}
            >
              {optionsList.map((option) => (
                <li
                  key={option.name}
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                  className={`px-3.5 py-2 text-sm hover:bg-slate-700/70 cursor-pointer transition-colors ${
                    selected.name === option.name
                      ? `text-${theme.accent}-300 font-medium bg-slate-700/70` // Highlight active
                      : theme.textSecondary
                  }`}
                >
                  {option.name}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActivationDD;
