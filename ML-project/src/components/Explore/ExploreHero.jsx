// src/components/Explore/ExploreHero.jsx
import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ChevronDown, SearchCode, Orbit } from "lucide-react"; // SearchCode for exploration, Orbit for an abstract feel

if (!ScrollTrigger.isRegistered) {
  gsap.registerPlugin(ScrollTrigger);
}

const theme = {
  bg: "bg-slate-950", // Should be inherited from ExplorePage
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  accent: "sky",
  accentSecondary: "emerald",
  accentTertiary: "rose",
};

// Helper to split text for GSAP animation
const splitTextForGSAP = (
  text,
  wrapperClass = "char-wrapper",
  innerClass = "char"
) => {
  return text.split("").map((char, index) => (
    <span
      key={index}
      className={wrapperClass}
      style={{ display: "inline-block", overflow: "hidden" }}
    >
      <span className={innerClass} style={{ display: "inline-block" }}>
        {char === " " ? "\u00A0" : char}
      </span>
    </span>
  ));
};

export default function ExploreHero() {
  const sectionRef = useRef(null); // For the whole section, used as ScrollTrigger trigger
  const contentWrapperRef = useRef(null); // For parallaxing the main content
  const titleRef = useRef(null); // For GSAP text animation
  const subtitleRef = useRef(null); // For GSAP text animation
  const linksContainerRef = useRef(null); // For GSAP stagger animation
  const scrollIndicatorRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation Timeline
      const tl = gsap.timeline({ delay: 0.3 });

      // Scroll-out animation for hero content: faster parallax and quicker fade
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.8, // Adjust scrub smoothness
        animation: gsap.to(contentWrapperRef.current, {
          yPercent: 50, // Increase parallax effect
          opacity: 0,
          scale: 0.85,
          filter: "blur(10px)", // More pronounced blur on exit
          ease: "power1.in", // Sharper exit ease
        }),
      });
    }, sectionRef); // Scope GSAP context to the section
    return () => ctx.revert();
  }, []);

  const scrollToAction = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Smooth scroll to section (matching Explore.jsx ToC)
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: element, offsetY: 80 },
        ease: "power3.inOut",
      });
    }
  };

  // Helper for subtitle word splitting specifically for GSAP
  const prepareSubtitleWords = (text) => {
    return text.split(" ").map((word, index) => (
      <span key={index} className="word-wrapper inline-block overflow-hidden">
        <span className="word inline-block">
          {word}
          {index < text.split(" ").length - 1 ? "\u00A0" : ""} {/* Add space */}
        </span>
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      id="explore-hero-target" // ID for ToC navigation
      className={`${theme.bg} min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden`}
    >
      {/* Abstract Animated Background Elements using Framer Motion */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-40 h-40 sm:w-56 sm:h-56 bg-gradient-to-br from-sky-700/30 to-emerald-700/30 rounded-full filter blur-3xl opacity-50"
        animate={{
          x: [-30, 30, -30],
          y: [-20, 20, -20],
          scale: [1, 1.2, 1],
          rotate: [0, 20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          repeatType: "mirror",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-tl from-rose-700/30 to-violet-700/30 rounded-full filter blur-3xl opacity-40"
        animate={{
          x: [40, -40, 40],
          y: [25, -25, 25],
          scale: [1, 0.8, 1],
          rotate: [0, -25, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          repeatType: "mirror",
          delay: 3,
        }}
      />
      <motion.div
        className="absolute top-10 right-10 pointer-events-none -z-0"
        animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
      >
        <Orbit
          size={100}
          className="text-slate-700/50 opacity-60"
          strokeWidth={0.5}
        />
      </motion.div>

      <div
        ref={contentWrapperRef}
        className="max-w-4xl mx-auto text-center relative z-10 py-10"
      >
        {" "}
        {/* Added py-10 for some breathing room */}
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold ${theme.textPrimary} tracking-tighter leading-none -mt-32 mb-8 sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight`}
        >
          <span
            className={`animate-main-title-line block overflow-hidden bg-clip-text bg-gradient-to-r from-${theme.accent}-400 via-${theme.accentSecondary}-400 to-${theme.accentTertiary}-900`}
          >
            <span className="inline-block">Explore</span>
          </span>
          <span className="animate-main-title-line block overflow-hidden">
            <span className="inline-block">Neural</span>
          </span>
          <span className="animate-main-title-line block overflow-hidden">
            <span className="inline-block">Networks</span>
          </span>
        </h1>
        <p
          ref={subtitleRef}
          className={`text-md xs:text-lg sm:text-xl ${theme.textSecondary} mt-4 max-w-2xl mx-auto leading-relaxed`}
        >
          {prepareSubtitleWords(
            "Uncover the foundational architectures, dynamic activation functions, and intricate anatomy of modern neural networks."
          )}
        </p>
      </div>
      <button
        ref={scrollIndicatorRef}
        onClick={() => scrollToAction("architectures-gallery")} // Scroll to first content section
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-400 hover:text-sky-300 transition-colors z-10 cursor-pointer group"
        title="Discover More"
      >
        <span
          className={`text-xs mb-1 group-hover:text-${theme.accent}-300 transition-colors`}
        >
          Begin Exploration
        </span>
        <ChevronDown
          size={26}
          className={`opacity-70 group-hover:opacity-90 transition-opacity`}
        />
      </button>
    </section>
  );
}
