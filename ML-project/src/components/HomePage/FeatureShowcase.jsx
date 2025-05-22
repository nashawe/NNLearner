// src/components/HomePage/FeatureShowcase.jsx
import React, { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { Blocks, Waypoints, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Ensure ScrollTrigger is registered if not globally

// If ScrollTrigger is not registered globally (e.g., in App.js or HomePage.jsx), register it here.
// However, it's best practice to register GSAP plugins once.
// For this component in isolation, we'll ensure it's available.
if (!ScrollTrigger.enabled) {
  // Check if already registered to avoid errors
  gsap.registerPlugin(ScrollTrigger);
}

const theme = {
  // Simplified for this component, assuming inherited or global theme
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  card: "bg-slate-800", // Base card background
  accent: "sky",
  accentSecondary: "rose",
  accentTertiary: "emerald",
  bg: "bg-slate-950", // Section background
};

// Reusable AnimatedTextWord component (Corrected Spacing)
const AnimatedTextWord = ({ text, delay = 0, className = "", as = "p" }) => {
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const words = text.split(" "); // Split by space
    el.innerHTML = ""; // Clear current content

    words.forEach((word, index) => {
      const wordWrapper = document.createElement("span");
      wordWrapper.className = "inline-block overflow-hidden";

      const innerSpan = document.createElement("span");
      innerSpan.className = "inline-block translate-y-full opacity-0";
      innerSpan.textContent = word;

      wordWrapper.appendChild(innerSpan);
      el.appendChild(wordWrapper);

      // Add a space character after each word's wrapper, except the last one
      if (index < words.length - 1) {
        const spaceSpan = document.createElement("span");
        spaceSpan.innerHTML = " "; // Use normal space, browser handles wrapping
        el.appendChild(spaceSpan);
      }
    });

    gsap.to(el.querySelectorAll("span > span"), {
      // Target the inner animating spans
      y: 0,
      opacity: 1,
      stagger: 0.03, // Snappier stagger
      duration: 0.4, // Snappier duration
      delay,
      ease: "power1.out", // Snappier ease
      scrollTrigger: {
        trigger: el,
        start: "top 90%", // Trigger a bit later for snappier feel
        toggleActions: "play none none none",
      },
    });
  }, [text, delay]);

  const Component = as;
  // Render the original text initially for SSR/no-JS, GSAP will replace it
  return (
    <Component ref={textRef} className={className}>
      {text}
    </Component>
  );
};

const FeatureShowcase = () => {
  const navigate = useNavigate();
  // sectionRef not strictly needed if cards animate themselves with Framer's whileInView

  const features = [
    {
      name: "Learn",
      Icon: BookOpen,
      description:
        "Dive into comprehensive guides and interactive explanations. Understand the 'how' and 'why' behind every component.",
      path: "/learn",
      accentColorName: theme.accentTertiary,
    },
    {
      name: "Build",
      Icon: Blocks,
      description:
        "Visually construct neural networks layer by layer. Define neurons, connections, and activation functions with an intuitive interface.",
      path: "/build",
      accentColorName: theme.accent,
    },
    {
      name: "Explore",
      Icon: Waypoints,
      description:
        "Experiment with different architectures and datasets. Train your models and observe their learning journey through dynamic visualizations.",
      path: "/explore",
      accentColorName: theme.accentSecondary,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.5,
      },
    },
  };

  // Hover animation copied from InfoHighlightSection
  const cardHoverAnimation = {
    y: -7, // from InfoHighlightSection
    // The boxShadow and borderColor will be handled by Tailwind's group-hover and transition-colors
    // For direct Framer Motion control, it would be:
    // boxShadow: `0 12px 30px rgba(14, 165, 233, 0.15), 0 0 15px rgba(14, 165, 233, 0.1)`,
    // We'll rely on Tailwind for boxShadow and borderColor on hover for simplicity,
    // but the y and scale will be Framer Motion.
    // To exactly match, we only take the 'y' and framer's 'transition'
    transition: { type: "spring", stiffness: 260, damping: 15 }, // from InfoHighlightSection
  };

  return (
    <section
      id="feature-showcase"
      className={`py-20 sm:py-28 ${theme.bg} overflow-hidden`}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <AnimatedTextWord
          as="h2"
          text="Your Gateway to Neural Networks" // No   needed here
          className={`text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-16 sm:mb-24 ${theme.textPrimary}`}
        />
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.name}
              variants={cardVariants}
              className={`group relative p-6 sm:p-8 rounded-2xl ${theme.card} border border-slate-700/80 flex flex-col 
                          transform 
                          hover:border-sky-900 hover:shadow-xl hover:shadow-${feature.accentColorName}-500/15
                          transition-all duration-250 ease-out`} // Tailwind transitions for border and shadow
              whileHover={cardHoverAnimation} // APPLYING THE COPIED HOVER ANIMATION LOGIC
              onClick={() => navigate(feature.path)}
              style={{ cursor: "pointer" }}
            >
              <div
                className={`relative z-10 flex flex-col h-full items-center`}
              >
                <div
                  className={`mb-6 p-4 rounded-full bg-gradient-to-br from-${feature.accentColorName}-600/20 to-slate-800/40 
                                border border-${feature.accentColorName}-500/40 shadow-lg 
                                group-hover:scale-110 group-hover:shadow-${feature.accentColorName}-500/25 transition-all duration-250 ease-out`}
                >
                  <feature.Icon
                    size={30}
                    className={`${theme.textPrimary} transition-colors duration-250 group-hover:text-${feature.accentColorName}-300`}
                  />
                </div>
                <div className="text-center">
                  <h3
                    className={`text-2xl sm:text-3xl font-bold mb-3 ${theme.textPrimary} transition-colors duration-250 group-hover:text-${feature.accentColorName}-300`}
                  >
                    {feature.name}
                  </h3>
                  <p
                    className={`${theme.textSecondary} text-sm sm:text-base leading-relaxed mb-6 min-h-[80px] sm:min-h-[100px]`}
                  >
                    {feature.description}
                  </p>
                </div>
                <motion.button
                  className={`mt-auto w-full inline-flex items-center justify-center gap-2 text-sm font-medium py-2.5 px-4 rounded-md 
                              bg-${feature.accentColorName}-600 hover:bg-${feature.accentColorName}-500 text-white
                              transition-colors duration-200 group-hover:tracking-tight`}
                  // Keep existing button hover/tap or simplify if desired
                  whileHover={{
                    letterSpacing: "0.025em",
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Go to {feature.name}{" "}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
