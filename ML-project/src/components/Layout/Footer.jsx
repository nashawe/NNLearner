// src/components/Layout/Footer.jsx
import React from "react";
import { Github, User } from "lucide-react"; // User for potential portfolio link

// Assume theme is defined globally or imported
const theme = {
  surface: "bg-slate-900",
  textPrimary: "text-slate-50",
  textMuted: "text-slate-400",
};

const Footer = () => (
  <footer
    className={`w-full ${theme.surface} border-t border-slate-700/50 py-10 sm:py-12`}
  >
    <div className="container mx-auto px-6 max-w-5xl text-center sm:text-left">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <p className={`text-xs ${theme.textMuted} mb-4 sm:mb-0`}>
          © 2025 Nathaniel Shawe. A Neural Network project built from scratch.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/nashawe/neural-network"
            target="_blank"
            rel="noopener noreferrer"
            title="Project GitHub Repository"
            className={`${theme.textMuted} hover:${theme.textPrimary} transition-colors`}
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
