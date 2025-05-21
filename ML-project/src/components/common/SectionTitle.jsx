// src/components/Common/SectionTitle.jsx
"use client";
import React from "react";
import { motion } from "framer-motion";

// Theme for the title can be passed via className or have some defaults here
const defaultTheme = {
  textPrimary: "text-sky-300", // Example default, often overridden by parent's theme
  // You can add more default theme styles if needed
};

const SectionTitle = ({
  text,
  className = "",
  subtitle,
  subtitleClassName = "text-slate-400",
}) => {
  return (
    <div className="mb-10 md:mb-16 text-center">
      {" "}
      {/* Added margin bottom and text-center */}
      <motion.h2
        initial={{ opacity: 0, y: 25, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }} // Trigger when 30% is in view
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${defaultTheme.textPrimary} ${className}`}
      >
        {text}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
          className={`mt-3 text-base sm:text-lg max-w-2xl mx-auto ${subtitleClassName}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionTitle;
