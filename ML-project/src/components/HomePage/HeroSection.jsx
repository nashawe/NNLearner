// src/components/HomePage/HeroSection.jsx
import React, { useRef, useLayoutEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Layers } from "lucide-react"; // Using Layers as the background icon
import { gsap } from "gsap";

const theme = {
  textPrimary: "text-slate-50",
  // textSecondary: "text-slate-300", // No longer used for a direct subtitle
  accent: "sky",
  accentSecondary: "rose",
  accentTertiary: "emerald",
};

const HeroSection = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Pronounced Parallax for the entire hero content block
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 0.8],
    [1, 1, 0]
  );

  // Background icon parallax
  const bgIconScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.4, 0.6]);
  const bgIconOpacity = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [0.1, 0.2, 0]
  );
  const bgIconRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  useLayoutEffect(() => {
    const heroContentAnim =
      heroRef.current?.querySelector(".hero-content-anim");
    const scrollIndicatorAnim = heroRef.current?.querySelector(
      ".hero-scroll-indicator-anim"
    );

    if (!heroContentAnim || !scrollIndicatorAnim) return;

    // GSAP animation for the main title "Learn. Build. Explore."
    gsap.fromTo(
      heroContentAnim.querySelectorAll(".animate-main-title-line"),
      { yPercent: 110, opacity: 0, skewY: 7 },
      {
        yPercent: 0,
        opacity: 1,
        skewY: 0,
        duration: 0.9,
        stagger: 0.1,
        delay: 0.5, // Overall delay for hero entrance
        ease: "power3.out",
      }
    );

    // GSAP animation for the scroll indicator
    gsap.fromTo(
      scrollIndicatorAnim,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        delay: 1.5, // Delay after title animation is mostly done
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      }
    );
  }, []);

  return (
    <motion.section
      ref={heroRef}
      className={`min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden px-4 pt-20 sm:pt-0`}
      style={{ opacity: contentOpacity }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0"
        style={{
          scale: bgIconScale,
          opacity: bgIconOpacity,
          rotate: bgIconRotate,
        }}
      >
        <Layers
          size="80vh"
          className={`text-${theme.accent}-800`}
          strokeWidth={0.08}
        />
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        className="hero-content-anim relative z-10"
      >
        {/* Main Title: Learn. Build. Explore. */}
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold ${theme.textPrimary} tracking-tighter leading-none sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight`}
        >
          <span className="animate-main-title-line block overflow-hidden">
            <span className="inline-block">Learn.</span>
          </span>
          <span className="animate-main-title-line block overflow-hidden">
            <span className="inline-block">Build.</span>
          </span>
          <span
            className={`animate-main-title-line block overflow-hidden bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-rose-400 to-emerald-300 brightness-125 saturate-150`}
          >
            <span className="inline-block">Explore.</span>
          </span>
        </h1>

        {/* No slot machine or other subheading needed below the main title now */}
      </motion.div>

      <div
        className="hero-scroll-indicator-anim absolute bottom-8 sm:bottom-10 flex flex-col items-center z-10"
        onClick={() => {
          // Ensure the target ID matches an element on your page
          const nextSection =
            document.getElementById("project-highlights") ||
            document.getElementById("feature-showcase");
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
        title="Scroll to discover" // Updated title
        style={{ cursor: "pointer" }}
      >
        <ChevronDown
          size={30}
          className={`text-${theme.accent}-400 opacity-60`} // Adjusted opacity
        />
      </div>
    </motion.section>
  );
};

export default HeroSection;
