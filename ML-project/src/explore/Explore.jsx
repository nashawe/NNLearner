// src/pages/Explore.jsx
import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { CodeXml, BookOpen, Waypoints, Blocks } from "lucide-react";

import ExploreHero from "../components/Explore/ExploreHero";
import ArchitectureGallery from "../components/Explore/ArchitectureGallery";
import ActivationVisualizer from "../components/Explore/ActivationVisualizer";
// Updated Import:
import NNAnatomy from "../components/Explore/NNAnatomy"; // Add new one
// import Footer from "../components/Layout/Footer";

if (!ScrollToPlugin.isRegistered) {
  gsap.registerPlugin(ScrollToPlugin);
}

// --- Navbar Links Data (Consistent with other pages) ---
const navLinks = [
  { label: "Learn", path: "/learn", Icon: BookOpen },
  { label: "Build", path: "/build", Icon: Blocks },
  { label: "Explore", path: "/explore", Icon: Waypoints },
];

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
  const [isScrolled, setIsScrolled] = React.useState(false); // For Navbar scroll effect

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
      {/* --- INTEGRATED NAVBAR --- */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.2,
          delay: 0.1,
          ease: "easeOut",
        }} // Slightly faster entrance
        className={`w-full fixed top-4 left-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 transition-all duration-200 ease-in-out
                   ${
                     isScrolled
                       ? `${theme.surface} shadow-xl bg-opacity-80 backdrop-blur-lg border-b border-slate-700/50`
                       : "bg-transparent border-b border-transparent"
                   }`}
      >
        {/* Left Side: Logo/Project Name */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          title="Go to Homepage"
        >
          <CodeXml size={28} className={`text-${theme.accent}-400`} />
          <span
            className={`text-xl font-bold ${theme.textPrimary} hidden sm:inline`}
          >
            NN<span className={`text-${theme.accent}-400`}>Learner</span>
          </span>
        </motion.div>

        {/* Right Side: Navigation Links */}
        {/* Navbar - Positioned Top Right */}
        <div className="flex items-center gap-2 md:gap-3">
          {navLinks.map(({ label, path, Icon }) => (
            <motion.button
              key={label}
              onClick={() => navigate(path)} // CORRECTLY USE navigate
              className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200
                         ${
                           (location.pathname.startsWith(path) &&
                             path !== "/") ||
                           (location.pathname === "/" && path === "/")
                             ? `${theme.navbarActiveText} bg-${theme.accent}-500/20 ring-1 ring-${theme.accent}-500/50`
                             : `${theme.navbarText} hover:${theme.navbarHoverText} hover:bg-slate-700/50`
                         } 
                         focus:outline-none focus:ring-2 focus:ring-${
                           theme.accent
                         }-500/70 focus:ring-offset-2 focus:ring-offset-slate-900`}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              title={`Go to ${label}`}
            >
              {Icon && (
                <Icon size={14} className="mr-1 md:mr-1.5 inline -mt-0.5" />
              )}
              {label}
            </motion.button>
          ))}
        </div>
      </motion.nav>
      {/* --- END OF INTEGRATED NAVBAR --- */}
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
