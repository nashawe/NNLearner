// src/pages/Explore.jsx
import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Home } from "lucide-react";

import ExploreHero from "../components/Explore/ExploreHero";
import ArchitectureGallery from "../components/Explore/ArchitectureGallery";
import ActivationVisualizer from "../components/Explore/ActivationVisualizer";
// Updated Import:
import NNAnatomy from "../components/Explore/NNAnatomy"; // Add new one
// import Footer from "../components/Layout/Footer";

if (!ScrollToPlugin.isRegistered) {
  gsap.registerPlugin(ScrollToPlugin);
}

const theme = {
  bg: "bg-slate-950",
  surface: "bg-slate-900",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  accent: "sky",
  divider: "border-slate-700/50",
};

// Reusable Parallax Section Wrapper
const ParallaxSection = ({ children, className = "", id }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.5, 1, 1, 0.5]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <div ref={ref} id={id} className={`relative ${className}`}>
      <motion.div style={{ y, opacity, scale }}>{children}</motion.div>
    </div>
  );
};

export default function Explore() {
  const navigate = useNavigate();

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, delay: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className={`${theme.bg} ${theme.textSecondary} font-sans min-h-screen selection:bg-${theme.accent}-500 selection:text-white overflow-x-hidden`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.button
        onClick={() => navigate("/")}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full ${theme.surface} bg-opacity-70 backdrop-blur-md text-${theme.accent}-300 shadow-lg hover:bg-slate-700 hover:text-${theme.accent}-200 transition-colors`}
        whileHover={{ scale: 1.1, rotate: -3 }}
        whileTap={{ scale: 0.95 }}
        title="Go Home Page"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Home size={22} />
      </motion.button>

      <main className="flex flex-col">
        <ParallaxSection id="explore-hero-target">
          <ExploreHero />
        </ParallaxSection>

        <ParallaxSection id="architectures-gallery-section">
          <ArchitectureGallery />
        </ParallaxSection>

        {/* Optional: Add some spacing before components that don't have inherent top margin/padding */}
        <div className="h-16 sm:h-24 md:h-32"></div>

        {/* ActivationVisualizer (can be parallaxed if it doesn't pin internally) */}
        <ParallaxSection id="activation-visualizer-section">
          <ActivationVisualizer />
        </ParallaxSection>
        <ParallaxSection id="nn-anatomy-section">
          <NNAnatomy />
        </ParallaxSection>
      </main>

      <motion.footer
        className={`${theme.surface} py-12 mt-10 sm:mt-16 border-t ${theme.divider} opacity-90`} // Adjusted margin top
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <p className={`text-center text-xs ${theme.textMuted}`}>
          End of Exploration. The journey into the depths of AI continues.
        </p>
      </motion.footer>
    </motion.div>
  );
}
