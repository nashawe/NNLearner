// src/components/Explore/ArchitectureGallery.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Layers as LayersIcon,
  Cpu,
  Brain,
  GitMerge,
  Bot,
  Atom,
} from "lucide-react";

const theme = {
  bgSection: "bg-slate-950",
  cardBgBase: "bg-slate-900",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-200",
  textMuted: "text-slate-400",
  accent: "sky",
  accentSecondary: "emerald",
  accentTertiary: "rose",
  dotActive: "bg-sky-400",
  dotInactive: "bg-slate-600 hover:bg-slate-500",
  divider: "border-slate-700",
};

const archItems = [
  /* ... archItems with bgColorClass, accentColorClass, borderColorClass etc. ... */
  {
    id: "lenet",
    name: "LeNet-5",
    Icon: Cpu,
    year: 1998,
    sub: "Yann LeCun et al.",
    bgColorClass: `bg-gradient-to-br from-sky-900/70 via-slate-900 to-slate-950`,
    accentColorClass: `text-sky-400`,
    borderColorClass: `border-sky-700/40`,
    description:
      "A pioneering Convolutional Neural Network, LeNet-5 excelled at handwritten digit recognition and established foundational CNN principles.",
  },
  {
    id: "alexnet",
    name: "AlexNet",
    Icon: LayersIcon,
    year: 2012,
    sub: "Alex Krizhevsky et al.",
    bgColorClass: `bg-gradient-to-br from-emerald-900/70 via-slate-900 to-slate-950`,
    accentColorClass: `text-emerald-400`,
    borderColorClass: `border-emerald-700/40`,
    description:
      "Marked a deep learning breakthrough by winning ImageNet 2012, leveraging GPUs, ReLUs, and dropout for superior image classification.",
  },
  {
    id: "gan",
    name: "GAN",
    Icon: Bot,
    year: 2014,
    sub: "Ian Goodfellow et al.",
    bgColorClass: `bg-gradient-to-br from-pink-900/70 via-slate-900 to-slate-950`,
    accentColorClass: `text-pink-400`,
    borderColorClass: `border-pink-700/40`,
    description:
      "Generative Adversarial Networks introduced a novel framework where two neural networks compete, enabling highly realistic synthetic data generation.",
  },
  {
    id: "vgg",
    name: "VGGNet",
    Icon: LayersIcon,
    year: 2014,
    sub: "Karen Simonyan & Zisserman",
    bgColorClass: `bg-gradient-to-br from-rose-900/70 via-slate-900 to-slate-950`,
    accentColorClass: `text-rose-400`,
    borderColorClass: `border-rose-700/40`,
    description:
      "VGGNets demonstrated the power of increased network depth using simple, stacked 3x3 convolutional filters for image recognition tasks.",
  },
  {
    id: "resnet",
    name: "ResNet",
    Icon: GitMerge,
    year: 2015,
    sub: "Kaiming He et al.",
    bgColorClass: `bg-gradient-to-br from-amber-900/70 via-slate-900 to-slate-950`,
    accentColorClass: `text-amber-400`,
    borderColorClass: `border-amber-700/40`,
    description:
      "Introduced residual (skip) connections to effectively train extremely deep neural networks, mitigating the vanishing gradient problem.",
  },
  {
    id: "transformer",
    name: "Transformer",
    Icon: Atom,
    year: 2017,
    sub: "Ashish Vaswani et al. (Google Brain)",
    bgColorClass: `bg-gradient-to-br from-violet-900/70 via-slate-900 to-slate-950`,
    accentColorClass: `text-violet-400`,
    borderColorClass: `border-violet-700/40`,
    description:
      "Revolutionized sequence processing with its self-attention mechanism, enabling parallel computation and forming the basis for advanced NLP models.",
  },
];

// Optimized slide variants
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95, // Slightly less drastic scale change during enter/exit
    // filter: "blur(5px)" // Optional: remove blur during transition if too heavy
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    // filter: "blur(0px)",
    transition: {
      x: { type: "spring", stiffness: 250, damping: 25, duration: 0.4 }, // Spring for x for a bit of bounce
      opacity: { duration: 0.3, ease: "easeOut" }, // Faster opacity
      scale: { duration: 0.3, ease: "easeOut" },
      // filter: {duration: 0.2, ease: "easeOut"}
    },
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
    // filter: "blur(5px)",
    transition: {
      x: { type: "spring", stiffness: 250, damping: 25, duration: 0.4 },
      opacity: { duration: 0.25, ease: "easeIn" }, // Faster opacity exit
      scale: { duration: 0.25, ease: "easeIn" },
      // filter: {duration: 0.2, ease: "easeIn"}
    },
  }),
};

const SectionTitle = ({ text, className }) => (
  <motion.h2
    className={`text-4xl sm:text-5xl md:text-6xl font-bold text-center ${theme.textPrimary} mb-10 sm:mb-12 tracking-tight ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.7, ease: "circOut" }}
  >
    {text}
  </motion.h2>
);

export default function ArchitectureGallery() {
  const [[page, direction], setPage] = useState([0, 0]);
  const currentArch = archItems[page];
  const slideKey = `${currentArch.id}-${page}`;

  const paginate = (newDirection) => {
    /* ... (as before) ... */
    setPage((prev) => {
      const nextPage = prev[0] + newDirection;
      if (nextPage < 0 || nextPage >= archItems.length) {
        return prev;
      }
      return [nextPage, newDirection];
    });
  };

  return (
    <section
      id="architectures-gallery"
      className={`${theme.bgSection} min-h-screen h-screen flex flex-col items-center justify-center relative overflow-hidden pt-12 -mb-32 sm:py-16 px-4`}
    >
      <SectionTitle text="Landmark Architectures Timeline" />

      {/* Slide Container - Add will-change here */}
      <div
        className="relative w-full max-w-3xl lg:max-w-4xl h-[60vh] sm:h-[65vh] md:h-[70vh] flex items-center justify-center"
        style={{ willChange: "transform" }} // Hint for browser
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={slideKey}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`absolute w-[95%] sm:w-[90%] h-[95%] sm:h-[90%] p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl 
                        flex flex-col justify-center items-center text-center
                        ${
                          currentArch.bgColorClass || theme.cardBgBase
                        } border ${
              currentArch.borderColorClass || theme.divider
            }
                        overflow-hidden`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1} // Make drag less elastic for quicker snap back
            onDragEnd={(e, { offset, velocity }) => {
              const swipeThreshold = 50; // Keep threshold relatively low for responsiveness
              if (offset.x < -swipeThreshold || velocity.x < -300) {
                paginate(1);
              } else if (offset.x > swipeThreshold || velocity.x > 300) {
                paginate(-1);
              }
            }}
            style={{ willChange: "transform, opacity" }} // Hint for this specific element
          >
            {/* Content of the slide - Defer entrance slightly more for main slide to settle */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { delay: 0.3, duration: 0.4, ease: "circOut" },
              }}
              className="w-full max-w-xl flex flex-col items-center"
            >
              <currentArch.Icon
                size={40}
                className={`${currentArch.accentColorClass} mb-3 filter drop-shadow-lg`}
                strokeWidth={1.5}
              />
              <h3
                className={`text-3xl sm:text-4xl font-bold ${theme.textPrimary} mb-1.5 tracking-tight`}
              >
                {currentArch.name}{" "}
                <span className="text-xl sm:text-2xl font-light text-slate-400">
                  ({currentArch.year})
                </span>
              </h3>
              <p
                className={`text-xs sm:text-sm italic ${theme.textMuted} mb-5`}
              >
                {currentArch.sub}
              </p>
              <p
                className={`${theme.textSecondary} text-[0.9rem] sm:text-base leading-relaxed max-h-[18vh] sm:max-h-[20vh] md:max-h-[22vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent pr-2 text-balance`}
              >
                {currentArch.description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons (styling and logic mostly same) */}
        <motion.button
          onClick={() => paginate(-1)}
          className={`absolute top-1/2 -translate-y-1/2 -left-2 sm:left-0 md:-left-4 z-20 p-2.5 rounded-full ${theme.cardBgBase} bg-opacity-60 backdrop-blur-sm shadow-lg text-slate-300 hover:text-white hover:bg-slate-700/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all border ${theme.divider}`}
          disabled={page === 0}
          whileHover={{ scale: 1.1, x: -1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous Architecture"
        >
          {" "}
          <ArrowLeft size={20} strokeWidth={2.5} />{" "}
        </motion.button>
        <motion.button
          onClick={() => paginate(1)}
          className={`absolute top-1/2 -translate-y-1/2 -right-2 sm:right-0 md:-right-4 z-20 p-2.5 rounded-full ${theme.cardBgBase} bg-opacity-60 backdrop-blur-sm shadow-lg text-slate-300 hover:text-white hover:bg-slate-700/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all border ${theme.divider}`}
          disabled={page === archItems.length - 1}
          whileHover={{ scale: 1.1, x: 1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next Architecture"
        >
          {" "}
          <ArrowRight size={20} strokeWidth={2.5} />{" "}
        </motion.button>
      </div>

      {/* Dot Indicators (styling mostly same) */}
      <div
        className="flex justify-center space-x-2 sm:space-x-2.5 mt-6 sm:mt-8 z-10"
        aria-label="Gallery Progress"
      >
        {archItems.map((item, i) => (
          <motion.button
            key={item.id}
            onClick={() => setPage([i, i > page ? 1 : -1])}
            className={`rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-1 ring-offset-1 ring-offset-slate-950`}
            animate={{
              scale: page === i ? 1.4 : 1,
              opacity: page === i ? 1 : 0.4,
              width: page === i ? "0.7rem" : "0.5rem",
              height: page === i ? "0.7rem" : "0.5rem",
            }}
            style={{
              backgroundColor:
                page === i
                  ? `rgb(var(--color-${
                      item.accentColor || theme.accent
                    }-rgb,14 165 233))`
                  : "rgb(100,116,139)",
            }}
            whileHover={{
              scale: page === i ? 1.5 : 1.2,
              opacity: 1,
              backgroundColor: `rgb(var(--color-${
                item.accentColor || theme.accent
              }-rgb,14 165 233))`,
            }}
            aria-label={`Go to ${item.name} slide`}
            title={item.name}
          />
        ))}
      </div>
    </section>
  );
}
