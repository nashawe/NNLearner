// src/components/BuildPage/BuildHero.jsx (or your preferred path)
import React, { useRef, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import {
  Construction,
  PenTool,
  PlayCircle,
  BookOpen,
  Blocks,
  Waypoints,
  CodeXml,
} from "lucide-react";
import MainNavbar from "../components/Layout/MainNavbar";

const theme = {
  bg: "bg-slate-950",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  accent: "violet",
  accentSecondary: "sky",
  bgIconColor: "text-violet-900", // Darker violet for Construction icon
  // Added navbar specific theme properties

  navbarText: "text-slate-200",
  navbarHoverText: "text-white",
  navbarActiveText: "text-violet-300", // For active link if you implement that
};

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
const navLinks = [
  { label: "Learn", path: "/learn", Icon: BookOpen },
  { label: "Build", path: "/build", Icon: Blocks },
  { label: "Explore", path: "/explore", Icon: Waypoints },
];

export default function BuildHero() {
  const [isScrolled, setIsScrolled] = React.useState(false); // For Navbar scroll effect
  const heroRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

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

  useLayoutEffect(() => {
    const heroContent = heroRef.current?.querySelector(".build-hero-content");
    if (!heroContent) return;

    const ctx = gsap.context(() => {
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
          delay: 0.5,
          ease: "expo.out",
        }
      );
      gsap.fromTo(
        heroContent.querySelectorAll(".subtitle-word-anim"),
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.04,
          delay: 1.0,
          ease: "power2.out",
        }
      );
      gsap.fromTo(
        heroContent.querySelector(".animate-buttons-container"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 1.5,
          ease: "power3.out",
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const titleLines = ["Build"];
  const MotionLink = motion(Link);

  return (
    <motion.section
      ref={heroRef}
      id="build-hero"
      className={`min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden px-4 pt-12 sm:pt-16 ${theme.bg}`} // Reduced top padding a bit
      style={{ opacity: contentOpacity }}
    >
      {/* Navbar - Positioned Top Left */}
      {/* --- INTEGRATED NAVBAR --- */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.2,
          delay: 0.1,
          ease: "easeOut",
        }} // Slightly faster entrance
        className={`w-full fixed top-4 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 transition-all duration-200 ease-in-out
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

      {/* Background Parallax Construction Icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0" // Keep behind navbar
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

      {/* Main Content with Parallax */}
      <motion.div
        style={{ y: contentY }}
        className="build-hero-content relative z-10 max-w-4xl mx-auto mt-16 md:mt-0" // Added margin-top to push content below potential fixed navbar space
      >
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl -mt-28 lg:text-8xl font-extrabold ${theme.textPrimary} tracking-tighter leading-tight mb-6 sm:mb-8`}
        >
          {titleLines.map((line, index) => (
            <span
              key={index}
              className="animate-main-title-line block mb-2 sm:mb-2 md:mb-4 overflow-hidden"
            >
              <span
                className={`title-text-span inline-block bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400 brightness-125 saturate-150`}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p
          className={`text-md sm:text-lg md:text-xl ${theme.textSecondary} max-w-lg md:max-w-xl mx-auto leading-relaxed mb-10 sm:mb-12`}
        >
          {prepareSubtitleWords(
            "Shape the future of intelligence. Start by designing your neural network from the ground up, or learn the ropes with our comprehensive tutorial."
          )}
        </p>

        {/* Buttons Container */}
        <div className="animate-buttons-container flex flex-col sm:flex-row sm:items-stretch sm:justify-center gap-4 sm:gap-6">
          <MotionLink
            to="/build/design"
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
            Create Architecture
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
      {/* No scroll down indicator in this hero, buttons are primary CTA */}
    </motion.section>
  );
}
