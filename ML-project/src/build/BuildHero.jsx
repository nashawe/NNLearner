// src/components/BuildPage/BuildHero.jsx
import React, { useRef, useLayoutEffect, useState, useEffect } from "react"; // Added useState for isScrolled if we keep local navbar logic
import { Link, useNavigate, useLocation } from "react-router-dom"; // Keep all three
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
// ScrollToPlugin might not be strictly needed if scrollToAction is removed or handled differently
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import {
  Construction,
  PenTool,
  PlayCircle,
  BookOpen,
  Blocks,
  Waypoints,
  CodeXml, // For potential logo in navbar
} from "lucide-react";

// if (!ScrollToPlugin.isRegistered) { // Only if scrollToAction using GSAP is kept
//   gsap.registerPlugin(ScrollToPlugin);
// }

// Define theme locally or ensure it's consistent if imported from a shared location
const theme = {
  bg: "bg-slate-950", // Assuming this is the desired background for this hero section
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  accent: "violet", // Primary accent for "Build" page hero elements
  accentSecondary: "sky", // For the tutorial button or other secondary actions
  bgIconColor: "text-violet-900", // Darker violet for Construction icon background
  // Navbar specific theme properties (if navbar is kept local here)
  navbarSurface: "bg-slate-900",
  navbarText: "text-slate-300",
  navbarHoverText: "text-violet-300",
  navbarActiveText: "text-violet-300 font-semibold",
};

// Navbar links if kept local (otherwise this would be from a shared source if AltNavbar is global)
const navLinks = [
  { label: "Learn", path: "/learn", Icon: BookOpen },
  { label: "Build", path: "/build", Icon: Blocks },
  { label: "Explore", path: "/explore", Icon: Waypoints },
];

const prepareSubtitleWords = (text) => {
  return text.split(" ").map((word, index) => (
    <span key={index} className="subtitle-word-wrapper inline-block">
      <span className="subtitle-word-anim inline-block">
        {word}
        {index < text.split(" ").length - 1 ? "\u00A0" : ""}
      </span>
    </span>
  ));
};

export default function BuildHero() {
  const [isScrolled, setIsScrolled] = useState(false); // For Navbar scroll effect
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // For active link styling

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.7, 0.9],
    [1, 1, 0]
  );
  const bgIconScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.6, 0.7]);
  const bgIconOpacity = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [0.07, 0.11, 0]
  );
  const bgIconRotate = useTransform(scrollYProgress, [0, 1], [0, -25]);

  // Effect for navbar scroll state
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP animations for hero content
  useLayoutEffect(() => {
    const heroContent = heroRef.current?.querySelector(".build-hero-content");
    const navElement = heroRef.current?.querySelector(".build-hero-navbar"); // Added for navbar animation

    if (!heroContent || !navElement) return;

    const ctx = gsap.context(() => {
      // Navbar entrance animation
      gsap.fromTo(
        navElement,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power2.out" }
      );

      // Main title animation
      gsap.fromTo(
        heroContent.querySelectorAll(
          ".animate-main-title-line .title-text-span"
        ),
        { yPercent: 105, opacity: 0, skewY: 8, rotateX: -30 },
        {
          yPercent: 0,
          opacity: 1,
          skewY: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.15,
          delay: 0.6, // Delayed to start after navbar
          ease: "expo.out",
        }
      );
      // Subtitle animation
      gsap.fromTo(
        heroContent.querySelectorAll(".subtitle-word-anim"),
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.04,
          delay: 1.1, // After title
          ease: "power2.out",
        }
      );
      // Buttons container animation
      gsap.fromTo(
        heroContent.querySelector(".animate-buttons-container"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 1.6, // After subtitle
          ease: "power3.out",
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const MotionLink = motion(Link);

  return (
    <motion.section
      ref={heroRef}
      id="build-hero"
      className={`min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden px-4 pt-24 sm:pt-20 ${theme.bg}`}
      style={{ opacity: contentOpacity }}
    >
      {/* --- INTEGRATED NAVBAR specific to BuildHero --- */}
      <nav // Changed from motion.nav if GSAP handles its entrance
        className={`build-hero-navbar absolute top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 transition-all duration-200 ease-in-out opacity-0
                   ${
                     isScrolled
                       ? `${theme.navbarSurface} shadow-xl bg-opacity-80 backdrop-blur-lg border-b border-slate-700/50`
                       : "bg-transparent border-b border-transparent"
                   }`} // Starts with opacity-0 for GSAP
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
            NN<span className={`text-${theme.accent}-400`}>Learner</span>{" "}
            {/* Or your project name */}
          </span>
        </motion.div>

        {/* Right Side: Navigation Links */}
        <div className="flex items-center gap-2 md:gap-3">
          {navLinks.map(({ label, path, Icon }) => (
            <motion.button
              key={label}
              onClick={() => navigate(path)}
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
                         }-500/70 
                         focus:ring-offset-2 focus:ring-offset-${
                           isScrolled ? "slate-900" : "slate-950"
                         }`}
              whileHover={{
                y: -2,
                scale: 1.03,
                transition: { type: "spring", stiffness: 350, damping: 15 },
              }}
              whileTap={{
                scale: 0.97,
                transition: { type: "spring", stiffness: 400, damping: 20 },
              }}
              title={`Go to ${label}`}
            >
              {Icon && (
                <Icon size={14} className="mr-1 md:mr-1.5 inline -mt-0.5" />
              )}
              {label}
            </motion.button>
          ))}
        </div>
      </nav>
      {/* --- END OF INTEGRATED NAVBAR --- */}

      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0"
        style={{
          scale: bgIconScale,
          opacity: bgIconOpacity,
          rotate: bgIconRotate,
        }}
      >
        <Construction
          size="80vh"
          className={`text-${theme.bgIconColor}`}
          strokeWidth={0.1}
        />
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        className="build-hero-content relative z-10 max-w-4xl mx-auto mt-16 md:mt-8" // Adjusted mt for navbar space
      >
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold ${theme.textPrimary} tracking-tighter leading-tight mb-6 sm:mb-8`}
        >
          <span
            className={`title-text-span inline-block bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400 brightness-125 saturate-150`}
          >
            Build
          </span>
        </h1>
        <p
          className={`text-md sm:text-lg md:text-xl ${theme.textSecondary} max-w-lg md:max-w-xl mx-auto leading-relaxed mb-10 sm:mb-12`}
        >
          {prepareSubtitleWords(
            "Shape the future of intelligence. Design your neural network architecture from the ground up or jumpstart with our comprehensive tutorials."
          )}
        </p>

        <div className="animate-buttons-container flex flex-col sm:flex-row sm:items-stretch sm:justify-center gap-4 sm:gap-6">
          <MotionLink
            to="/build/mode-selection" // Corrected path to the new selection page
            whileHover={{
              scale: 1.05,
              y: -4,
              boxShadow: `0 14px 35px rgba(167, 139, 250, 0.3), 0 0 25px rgba(167, 139, 250, 0.2)`,
            }}
            whileTap={{ scale: 0.97, y: -2 }}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
            className={`w-full sm:w-auto bg-gradient-to-r from-${theme.accent}-600 to-${theme.accent}-500 hover:from-${theme.accent}-500 hover:to-${theme.accent}-400 text-white font-semibold text-base sm:text-lg py-3.5 px-8 sm:py-4 sm:px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ease-out flex items-center justify-center gap-2.5 transform`}
          >
            <PenTool size={22} strokeWidth={2} />
            Start Building {/* Changed text to be more general */}
          </MotionLink>
          <MotionLink
            to="/tutorial"
            whileHover={{
              scale: 1.05,
              y: -4,
              boxShadow: `0 14px 35px rgba(14, 165, 233, 0.3), 0 0 25px rgba(14, 165, 233, 0.2)`,
            }}
            whileTap={{ scale: 0.97, y: -2 }}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
            className={`w-full sm:w-auto bg-gradient-to-r from-${theme.accentSecondary}-600 to-${theme.accentSecondary}-500 hover:from-${theme.accentSecondary}-500 hover:to-${theme.accentSecondary}-400 text-white font-semibold text-base sm:text-lg py-3.5 px-8 sm:py-4 sm:px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ease-out flex items-center justify-center gap-2.5 transform`}
          >
            <PlayCircle size={22} strokeWidth={2} />
            Watch Tutorial
          </MotionLink>
        </div>
      </motion.div>
      {/* No scroll down indicator in this hero if buttons are primary CTA */}
    </motion.section>
  );
}
