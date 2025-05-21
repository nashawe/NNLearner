// src/components/HomePage/HeroSection.jsx
import React, { useRef, useLayoutEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Layers, BookOpen, Blocks, Waypoints } from "lucide-react";
import { gsap } from "gsap";
import { useNavigate, useLocation } from "react-router-dom";

const theme = {
  textPrimary: "text-slate-50",
  accent: "sky",
  accentSecondary: "rose",
  accentTertiary: "emerald",
  // Navbar specific theme properties
  navbarBg: "bg-slate-900/70 backdrop-blur-md", // Slightly more opaque, more blur
  navbarText: "text-slate-300", // Default nav link text
  navbarHoverText: "text-sky-300", // Hover text color (using main accent)
  navbarActiveText: "text-sky-300 font-semibold", // Active link text
  navbarButtonHoverBg: "hover:bg-slate-700/60", // Subtle background on hover
  navbarButtonActiveBg: `bg-${"sky"}-500/20`, // Use template literal for dynamic class
  navbarButtonRingFocus: `focus:ring-${"sky"}-500/70`,
  navbarButtonRingActive: `ring-${"sky"}-500/50`,
};

const navLinks = [
  { label: "Learn", path: "/learn", Icon: BookOpen },
  { label: "Build", path: "/build", Icon: Blocks },
  { label: "Explore", path: "/explore", Icon: Waypoints },
];

const HeroSection = () => {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 0.8],
    [1, 1, 0]
  );
  const bgIconScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.4, 0.6]);
  const bgIconOpacity = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [0.07, 0.1, 0]
  ); // Adjusted opacity
  const bgIconRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  useLayoutEffect(() => {
    const heroContentAnim =
      heroRef.current?.querySelector(".hero-content-anim");
    const scrollIndicatorAnim = heroRef.current?.querySelector(
      ".hero-scroll-indicator-anim"
    );
    const navAnim = heroRef.current?.querySelector(".hero-navbar-anim");

    if (!heroContentAnim || !scrollIndicatorAnim || !navAnim) return;

    const ctx = gsap.context(() => {
      // Navbar entrance animation
      gsap.fromTo(
        navAnim,
        { yPercent: -150, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.3,
          ease: "power2.out",
        }
      );

      // Main title animation
      gsap.fromTo(
        heroContentAnim.querySelectorAll(
          ".animate-main-title-line .inline-block"
        ),
        { yPercent: 105, opacity: 0, skewY: 7, rotateX: -30 },
        {
          yPercent: 0,
          opacity: 1,
          skewY: 0,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.12,
          delay: 0.7, // Delay after navbar
          ease: "expo.out",
        }
      );
      // Scroll indicator animation
      gsap.fromTo(
        scrollIndicatorAnim,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          delay: 1.9, // Delay after title
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <motion.section
      ref={heroRef}
      className={`min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden px-4 pt-24 sm:pt-20 bg-slate-950`}
      style={{ opacity: contentOpacity }}
    >
      {/* Navbar - Positioned Top Right, directly in HeroSection */}
      <nav // Changed motion.nav to nav for GSAP control
        ref={(el) =>
          heroRef.current
            ? heroRef.current.querySelector(".hero-navbar-anim")
              ? null
              : heroRef.current.querySelector(".hero-navbar-anim") ||
                (el && el.classList.add("hero-navbar-anim"))
            : null
        }
        className={`hero-navbar-anim absolute top-4 right-4 ${theme.navbarBg} p-8 md:p-2.5 rounded-xl shadow-2xl z-30 opacity-0`} // Start with opacity-0 for GSAP
      >
        <div className="flex items-center gap-2 md:gap-3">
          {navLinks.map(({ label, path, Icon }) => (
            <motion.button
              key={label}
              onClick={() => navigate(path)} // CORRECTLY USE navigate
              className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200
                     ${
                       (location.pathname.startsWith(path) && path !== "/") ||
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
      </nav>

      <motion.div
        className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10"
        style={{
          scale: bgIconScale,
          opacity: bgIconOpacity,
          rotate: bgIconRotate,
        }}
      >
        <Layers
          size="90vh"
          className={`text-${theme.accent}-950 opacity-80`}
          strokeWidth={0.07}
        />
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        className="hero-content-anim relative z-10 mt-12 md:mt-0"
      >
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold 
                     ${theme.textPrimary} tracking-tighter leading-none -mt-32 mb-0 sm:mb-0 
                     sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight`}
        >
          <span
            className={`animate-main-title-line block overflow-hidden mb-1 sm:mb-2 md:mb-3`}
          >
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-rose-400 to-emerald-300 brightness-125 saturate-150">
              Learn.
            </span>
          </span>
          <span
            className={`animate-main-title-line block overflow-hidden mb-1 sm:mb-2 md:mb-3`}
          >
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-rose-400 to-emerald-300 brightness-125 saturate-150">
              Build.
            </span>
          </span>
          <span className={`animate-main-title-line block overflow-hidden`}>
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-rose-400 to-emerald-300 brightness-125 saturate-150">
              Explore.
            </span>
          </span>
        </h1>
      </motion.div>

      <div
        className="hero-scroll-indicator-anim absolute bottom-8 sm:bottom-10 flex flex-col items-center z-20"
        onClick={() => {
          const nextSection =
            document.getElementById("project-highlights") ||
            document.getElementById("feature-showcase");
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
        title="Scroll to discover"
        style={{ cursor: "pointer" }}
      >
        <ChevronDown
          size={30}
          className={`text-${theme.accent}-400 opacity-50 hover:opacity-80 transition-opacity`}
        />
      </div>
    </motion.section>
  );
};

export default HeroSection;
