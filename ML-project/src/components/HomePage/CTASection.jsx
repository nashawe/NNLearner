// src/components/HomePage/CTASection.jsx
import React, { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, BrainCircuit } from "lucide-react"; // BrainCircuit for thematic icon
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Import ScrollTrigger

// Register ScrollTrigger if not done globally
if (!ScrollTrigger.isRegistered) {
  // Check if already registered
  gsap.registerPlugin(ScrollTrigger);
}

const theme = {
  surface: "bg-slate-900",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  accent: "sky",
  card: "bg-slate-800", // For potential future card-like elements within CTA
};

// Updated AnimatedTextWord for better space handling and slightly snappier animation
const AnimatedTextWord = ({ text, delay = 0, className = "", as = "p" }) => {
  const textRef = useRef(null);
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const words = text.split(" "); // Split by space
    el.innerHTML = ""; // Clear

    words.forEach((word, index) => {
      const wordWrapper = document.createElement("span");
      wordWrapper.className = "inline-block overflow-hidden"; // Wrapper for y-transform

      const innerSpan = document.createElement("span");
      innerSpan.className = "inline-block translate-y-full opacity-0";
      innerSpan.textContent = word;

      wordWrapper.appendChild(innerSpan);
      el.appendChild(wordWrapper);

      // Add a normal space character after each word, browser will handle wrapping
      if (index < words.length - 1) {
        el.appendChild(document.createTextNode(" "));
      }
    });

    gsap.to(el.querySelectorAll("span > span"), {
      y: 0,
      opacity: 1,
      stagger: 0.03, // Slightly faster stagger
      duration: 0.45, // Slightly faster duration
      delay: delay,
      ease: "cubic.out", // A smooth but quick ease
      scrollTrigger: {
        trigger: el,
        start: "top 88%", // Trigger slightly later
        toggleActions: "play none none none",
      },
    });
  }, [text, delay]);

  const Component = as;
  return (
    <Component ref={textRef} className={className}>
      {text} {/* Initial text for SSR/SEO, GSAP will replace */}
    </Component>
  );
};

const CTASection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  // All animated elements can use Framer Motion's whileInView for simplicity here
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(3px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }, // Smooth cubic
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      className={`${theme.surface} py-24 sm:py-32 overflow-hidden`} // Added overflow-hidden
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Trigger when 20% is visible
    >
      <div className="container mx-auto px-4 max-w-2xl text-center">
        {" "}
        {/* Slightly smaller max-width for focus */}
        <motion.div variants={itemVariants} className="mb-10">
          {" "}
          {/* Wrapper for icon */}
          <div
            className={`inline-flex p-4 rounded-full bg-gradient-to-br from-${theme.accent}-500/10 to-slate-800/30 border border-${theme.accent}-500/30 shadow-xl`}
          >
            <BrainCircuit size={44} className={`text-${theme.accent}-400`} />{" "}
            {/* More thematic icon */}
          </div>
        </motion.div>
        <motion.div variants={itemVariants}>
          <AnimatedTextWord
            as="h2"
            // Removed   relying on normal word wrap and container width
            text="Embark on Your Neural Odyssey."
            className={`text-4xl sm:text-5xl font-bold mb-5 ${theme.textPrimary}`}
            // GSAP delay will be relative to its own scroll trigger, Framer handles overall stagger
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AnimatedTextWord
            text="The tools and knowledge await. It's time to transform complexity into clarity, and observation into true understanding. Your journey starts now."
            className={`mx-auto ${theme.textSecondary} text-lg sm:text-xl leading-relaxed mb-12 max-w-lg`} // Constrained width for paragraph
            delay={0.1} // Slight stagger from title if both visible together
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={() => navigate("/build")}
            className={`px-10 py-4 rounded-xl bg-transparent 
                font-semibold text-lg 
                transition-all duration-300 ease-out
                shadow-2xl hover:shadow-emerald-400/30
                flex items-center justify-center group mx-auto`}
            whileHover={{
              scale: 1.05,
              y: -4,
              transition: { type: "spring", stiffness: 250, damping: 15 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="inline-flex items-center gap-2.5 bg-gradient-to-r from-sky-400 via-rose-400 to-emerald-300 saturate-150 bg-clip-text text-transparent">
              Begin Creating
              <ArrowRight
                size={20}
                className="transition-transform text-white duration-250 group-hover:translate-x-1.5"
              />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CTASection;
