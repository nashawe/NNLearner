// src/components/Layout/MainNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CodeXml } from "lucide-react"; // Example Project Icon

// Assume theme is defined globally or imported
const theme = {
  surface: "bg-slate-900",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  accent: "sky",
};

const MainNavbar = ({ navLinks }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // // GSAP entrance animation for the navbar
    // if (navRef.current) {
    //   gsap.fromTo(
    //     navRef.current,
    //     { y: -100, opacity: 0 }, // Start off-screen and invisible
    //     { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" } // Animate to final position
    //   );
    // }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      ref={navRef}
      className={`w-full fixed top-0 left-0 z-40 flex items-center justify-between px-6 md:px-10 py-3 transition-all duration-300 ease-in-out
                 ${
                   isScrolled
                     ? `${theme.surface} shadow-2xl bg-opacity-80 backdrop-blur-md border-b border-slate-700/50`
                     : "bg-transparent"
                 }`}
    >
      <motion.div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")} // Assuming '/' is your home page
        whileHover={{ scale: 1.05 }}
        title="Project Home"
      >
        <CodeXml size={28} className={`text-${theme.accent}-400`} />
        <span
          className={`text-xl font-bold ${theme.textPrimary} hidden sm:inline`}
        >
          NN<span className={`text-${theme.accent}-400`}>Project</span>{" "}
          {/* Placeholder Name */}
        </span>
      </motion.div>

      <div className="flex items-center gap-3 md:gap-5">
        {navLinks.map(
          (
            { label, path, Icon } // Assuming navLinks might have Icon
          ) => (
            <motion.button
              key={label}
              onClick={() => navigate(path)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200
                       ${theme.textSecondary} hover:${theme.textPrimary} 
                       hover:bg-${theme.accent}-500/20 focus:outline-none focus:ring-2 focus:ring-${theme.accent}-500/50 focus:ring-offset-2 focus:ring-offset-slate-900`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              title={`Go to ${label}`}
            >
              {Icon && <Icon size={16} className="mr-1.5 inline" />}
              {label}
            </motion.button>
          )
        )}
      </div>
    </motion.nav>
  );
};

export default MainNavbar;
