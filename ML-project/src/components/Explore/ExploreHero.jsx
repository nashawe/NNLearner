// src/components/Explore/ExploreHero.jsx
import React, { useRef, useLayoutEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useNavigate and useLocation
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Waypoints, Orbit, BookOpen, Blocks } from "lucide-react";

if (!ScrollToPlugin.isRegistered) {
  gsap.registerPlugin(ScrollToPlugin);
}

const navLinks = [
  { label: "Learn", path: "/learn", Icon: BookOpen },
  { label: "Build", path: "/build", Icon: Blocks },
  { label: "Explore", path: "/explore", Icon: Waypoints },
];

const theme = {
  bg: "bg-slate-950", // Base background for the section
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  accent: "sky",
  accentSecondary: "emerald",
  accentTertiary: "rose",
  bgIconColor: "text-sky-900", // Darker sky for Waypoints background
  // Navbar specific theme properties
  navbarBg: "bg-slate-900/60 backdrop-blur-lg", // More blur, slightly more opacity
  navbarText: "text-slate-300", // Default nav link text
  navbarHoverText: "text-sky-300", // Hover text color
  navbarActiveText: "text-sky-300 font-semibold", // Active link text (e.g., sky color and bold)
};

export default function ExploreHero() {
  const heroRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation for active link styling

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.7, 0.9],
    [1, 1, 0]
  );
  const bgIconScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.5, 0.5]);
  const bgIconOpacity = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [0.06, 0.1, 0]
  ); // Even more subtle
  const bgIconRotate = useTransform(scrollYProgress, [0, 1], [0, -35]);
  const smallOrbit1Y = useTransform(scrollYProgress, [0, 1], ["0%", "70%"]);
  const smallOrbit2Y = useTransform(scrollYProgress, [0, 1], ["0%", "90%"]);

  useLayoutEffect(() => {
    const heroContent = heroRef.current?.querySelector(".explore-hero-content");
    const scrollIndicator = heroRef.current?.querySelector(
      ".explore-hero-scroll-indicator"
    );

    if (!heroContent || !scrollIndicator) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroContent.querySelectorAll(".animate-main-title-line .inline-block"),
        { yPercent: 105, opacity: 0, skewY: 8, rotateX: -40 },
        {
          yPercent: 0,
          opacity: 1,
          skewY: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.12,
          delay: 0.5,
          ease: "expo.out", // Start title a bit sooner
        }
      );
      gsap.fromTo(
        heroContent.querySelectorAll(".subtitle-word-anim"),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.05,
          delay: 1.0,
          ease: "power2.out", // Subtitle after title starts
        }
      );
      gsap.fromTo(
        scrollIndicator,
        { opacity: 0, y: -15 },
        {
          opacity: 1,
          y: 0,
          delay: 1.9,
          duration: 1.2, // Scroll indicator last
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToAction = (id) => {
    const element = document.getElementById(id);
    if (element) {
      gsap.to(window, {
        duration: 1.3,
        scrollTo: { y: element, offsetY: 70 }, // Increased offset for potentially taller nav
        ease: "power3.inOut",
      });
    }
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
  // const titleLines = ["Explore", "Neural", "Networks"]; // No longer needed here, direct text in h1
  // const MotionLink = motion(Link); // No longer needed here if buttons are navigate()

  return (
    <motion.section
      ref={heroRef}
      id="explore-hero-target"
      className={`min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden px-4 pt-20 sm:pt-16 ${theme.bg}`}
      style={{ opacity: contentOpacity }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
        style={{
          scale: bgIconScale,
          opacity: bgIconOpacity,
          rotate: bgIconRotate,
        }}
      >
        <Waypoints
          size="90vh"
          className={`${theme.bgIconColor} opacity-80`}
          strokeWidth={0.06}
        />
      </motion.div>

      <motion.div
        style={{ y: smallOrbit1Y, x: "-25vw", rotate: scrollYProgress }} // rotate with scroll
        className="absolute top-[15%] w-32 h-32 sm:w-48 sm:h-48 opacity-25"
        animate={{ rotate: scrollYProgress ? undefined : 360 }} // fallback rotate if no scroll
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <Orbit
          size="100%"
          className={`text-${theme.accent}-700/50`}
          strokeWidth={0.3}
        />
      </motion.div>
      <motion.div
        style={{
          y: smallOrbit2Y,
          x: "25vw",
          rotate: useTransform(scrollYProgress, (v) => v * -360),
        }} // rotate other way
        className="absolute bottom-[15%] w-40 h-40 sm:w-56 sm:h-56 opacity-20"
        animate={{ rotate: scrollYProgress ? undefined : -360 }}
        transition={{
          duration: 110,
          repeat: Infinity,
          ease: "linear",
          delay: 1.5,
        }}
      >
        <Orbit
          size="100%"
          className={`text-${theme.accentSecondary}-700/40`}
          strokeWidth={0.25}
        />
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        className="explore-hero-content relative z-10 max-w-4xl mx-auto"
      >
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl -mt-32 lg:text-8xl xl:text-9xl font-extrabold ${theme.textPrimary} tracking-tighter leading-none mb-6 sm:mb-8`}
        >
          <span className="animate-main-title-line block overflow-hidden">
            <span
              className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-${theme.accent}-400 via-${theme.accentTertiary}-400 to-${theme.accentSecondary}-300 brightness-125 saturate-150`}
            >
              Explore
            </span>
          </span>
        </h1>
        <p
          className={`text-md sm:text-lg md:text-xl ${theme.textSecondary} max-w-xl md:max-w-2xl mx-auto leading-relaxed`}
        >
          {prepareSubtitleWords(
            "Dive deep into the architectures, visualize activation dynamics, and dissect the anatomy of intelligent systems."
          )}
        </p>
      </motion.div>

      <div
        className="explore-hero-scroll-indicator absolute bottom-8 sm:bottom-10 flex flex-col items-center z-20 -mt-32 cursor-pointer group" // Increased z-index for scroll indicator
        onClick={() => scrollToAction("architectures-gallery-section")}
        title="Discover More"
      >
        <span
          className={`text-xs mb-1.5 text-slate-400 group-hover:text-${theme.accent}-300 transition-colors`}
        >
          Begin Exploration
        </span>
        <ChevronDown
          size={28}
          className={`text-slate-500 group-hover:text-${theme.accent}-400 transition-colors`}
        />
      </div>
    </motion.section>
  );
}
