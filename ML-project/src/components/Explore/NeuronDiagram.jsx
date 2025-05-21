// NeuronDiagram.jsx
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

// --- THEME CONSTANTS (from your original file) ---
const accentColor = "rgb(56 189 248)"; // sky-400
const accentColorGlow = "rgba(56, 189, 248, 0.7)";
const textPrimaryColor = "rgb(248 250 252)"; // slate-50
const textSecondaryColor = "rgb(203 213 225)"; // slate-300
const surfaceColor = "rgb(15 23 42)"; // slate-900
const dividerColor = "rgb(51 65 85)"; // slate-700

const theme = {
  bg: "bg-slate-950",
  surface: "bg-slate-900",
  textPrimary: "text-slate-50",
  textSecondary: "text-slate-300",
  accent: "sky",
  divider: "border-slate-700/50",
};

const NeuronDiagram = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for elements to be animated by GSAP
  const pathRefs = useRef([]);
  const nodeRefs = useRef([]);
  const textRefs = useRef([]);
  const svgRef = useRef(null); // Ref for the main SVG to get arrowhead refs if needed

  const animationTimeline = useRef(null);

  // --- ANIMATION SEQUENCE DEFINITION ---
  // Each object defines what to animate for that step.
  // 'targets' should be indices into the ref arrays.
  const animationStepsConfig = [
    // Step 1: Inputs X1, X2 connect to multipliers
    {
      paths: [0, 2], // Indices for pathRefs (X1->Mul, X2->Mul)
      nodes: [],
      texts: [0, 2], // Indices for textRefs (X1, X2 labels)
    },
    // Step 2: Weights W1, W2 active; Multiplier nodes active
    {
      paths: [],
      nodes: [0, 1], // Indices for nodeRefs (Mul1, Mul2 rects)
      texts: [1, 3, 8, 10], // Indices for textRefs (W1, W2 labels, Mul1 '*', Mul2 '*')
    },
    // Step 3: Outputs of multipliers connect to Sum
    {
      paths: [4, 5], // Indices for pathRefs (Mul1->Sum, Mul2->Sum)
      nodes: [],
      texts: [],
    },
    // Step 4: Bias connects to Sum; Sum node active
    {
      paths: [6], // Index for pathRefs (Bias->Sum)
      nodes: [2], // Index for nodeRefs (Sum rect)
      texts: [4, 12], // Indices for textRefs (Bias 'b' label, Sum '+' label)
    },
    // Step 5: Sum connects to Activation
    {
      paths: [7], // Index for pathRefs (Sum->Activation)
      nodes: [],
      texts: [],
    },
    // Step 6: Activation node and its labels active
    {
      paths: [],
      nodes: [3], // Index for nodeRefs (Activation rect)
      texts: [5, 14, 15], // Indices for textRefs (Activation 'ƒ', "Activation", "Function" labels)
    },
    // Step 7: Activation connects to Output Y; Output Y active
    {
      paths: [8], // Index for pathRefs (Activation->Output)
      nodes: [],
      texts: [7], // Index for textRefs (Output 'Y' label)
    },
  ];

  const stepDuration = 1.2; // Duration for each step's transition in GSAP
  const stepOverlap = "-=0.1"; // How much animations overlap

  useEffect(() => {
    // Initialize GSAP timeline
    animationTimeline.current = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Optional: Add a slight delay then allow re-animation or show a "completed" state
        gsap.delayedCall(1, () => setIsAnimating(false));
      },
    });

    // Populate refs - Ensure correct number of refs are created based on SVG structure
    // This assumes the order of elements in JSX matches the indices in animationStepsConfig
    // This is a common pattern, but ensure your JSX reflects this.
    // If you add/remove elements, update this ref pushing.
    // Alternatively, use IDs and select elements if order is not guaranteed.

    // Cleanup on unmount
    return () => {
      if (animationTimeline.current) {
        animationTimeline.current.kill();
      }
      gsap.killTweensOf([
        ...pathRefs.current,
        ...nodeRefs.current,
        ...textRefs.current,
      ]);
    };
  }, []);

  const resetElementsToInitialState = () => {
    const arrowheadDefault = svgRef.current?.querySelector("#arrowhead");
    const arrowheadActive = svgRef.current?.querySelector("#arrowhead-active");

    pathRefs.current.forEach((path) => {
      if (path) {
        gsap.to(path, {
          stroke: dividerColor,
          strokeWidth: 1.5,
          strokeDasharray: "5 5",
          filter: "none",
          markerEnd: arrowheadDefault ? `url(#arrowhead)` : null,
          duration: 0.5,
        });
      }
    });
    nodeRefs.current.forEach((node) => {
      if (node) {
        gsap.to(node, {
          fill: "rgb(30 41 59)", // slate-800
          stroke: dividerColor,
          strokeWidth: 1.5,
          filter: "none",
          duration: 0.5,
        });
      }
    });
    textRefs.current.forEach((textObj) => {
      if (textObj && textObj.element) {
        gsap.to(textObj.element, {
          fill: textObj.baseColor || textSecondaryColor,
          filter: "none",
          duration: 0.5,
        });
      }
    });
  };

  const handleVisualize = () => {
    if (
      isAnimating &&
      animationTimeline.current &&
      animationTimeline.current.isActive()
    ) {
      // If already animating and button means "Reset", let reset handle it.
      return;
    }

    setIsAnimating(true);
    resetElementsToInitialState(); // Ensure a clean start visually

    const tl = animationTimeline.current;
    tl.clear(); // Clear any previous animations from the timeline instance

    const arrowheadDefault = svgRef.current?.querySelector("#arrowhead");
    const arrowheadActive = svgRef.current?.querySelector("#arrowhead-active");

    animationStepsConfig.forEach((stepConfig, index) => {
      const stepLabel = `step${index + 1}`;
      tl.addLabel(stepLabel, index === 0 ? "+=0.1" : stepOverlap); // Stagger start of steps

      stepConfig.paths.forEach((pathIndex) => {
        if (pathRefs.current[pathIndex]) {
          tl.to(
            pathRefs.current[pathIndex],
            {
              stroke: accentColor,
              strokeWidth: 2.5,
              strokeDasharray: "none",
              filter: "url(#glow)",
              markerEnd: arrowheadActive ? `url(#arrowhead-active)` : null,
              duration: stepDuration,
              ease: "power1.inOut",
            },
            stepLabel
          );
        }
      });

      stepConfig.nodes.forEach((nodeIndex) => {
        if (nodeRefs.current[nodeIndex]) {
          tl.to(
            nodeRefs.current[nodeIndex],
            {
              fill: surfaceColor,
              stroke: accentColor,
              strokeWidth: 2,
              filter: "url(#glow)",
              duration: stepDuration,
              ease: "power1.inOut",
            },
            stepLabel
          );
        }
      });

      stepConfig.texts.forEach((textIndex) => {
        const textObj = textRefs.current[textIndex];
        if (textObj && textObj.element) {
          tl.to(
            textObj.element,
            {
              fill: accentColor,
              filter: "url(#textGlow)",
              duration: stepDuration,
              ease: "power1.inOut",
            },
            stepLabel
          );
        }
      });
    });

    tl.play(0); // Play from the beginning
  };

  const handleReset = () => {
    setIsAnimating(false);
    if (animationTimeline.current) {
      animationTimeline.current.pause(0).clear(); // Pause at start and clear
    }
    resetElementsToInitialState();
  };

  return (
    <div className={`${theme.bg} p-4 md:p-8 rounded-lg shadow-2xl`}>
      <div className="flex justify-center mb-6">
        {!isAnimating ? (
          <button
            onClick={handleVisualize}
            className={`px-6 py-3 ${theme.surface} ${theme.textPrimary} border border-${theme.accent}-500 rounded-lg 
                       hover:bg-${theme.accent}-500 hover:text-slate-950 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-${theme.accent}-400 focus:ring-opacity-50
                       shadow-lg shadow-${theme.accent}-500/30 hover:shadow-${theme.accent}-500/50`}
          >
            Visualize Forward Pass
          </button>
        ) : (
          <button
            onClick={handleReset}
            className={`px-6 py-3 bg-red-600 ${theme.textPrimary} border border-red-700 rounded-lg 
                       hover:bg-red-700 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                       shadow-lg shadow-red-600/30 hover:shadow-red-500/50`}
          >
            Reset Animation
          </button>
        )}
      </div>

      <svg
        ref={svgRef} // Ref for the main SVG
        viewBox="0 0 750 427"
        className="w-full h-auto"
        style={{ fontFamily: "monospace" }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blurEffect" />{" "}
            {/* Renamed result */}
            <feFlood floodColor={accentColorGlow} result="colorOfGlow" />{" "}
            {/* Renamed result */}
            <feComposite
              in="colorOfGlow"
              in2="blurEffect"
              operator="in"
              result="coloredGlowEffect"
            />{" "}
            {/* Renamed result */}
            <feMerge>
              <feMergeNode in="coloredGlowEffect" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="textGlow">
            <feGaussianBlur stdDeviation="1" result="blur" />{" "}
            {/* Reduced deviation */}
            <feFlood floodColor={accentColorGlow} result="flood" />
            <feComposite in="flood" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker
            id="arrowhead"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            {" "}
            {/* Adjusted for smaller size */}
            <polygon points="0 0, 6 3, 0 6" fill={dividerColor} />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 7 3.5, 0 7" fill={accentColor} />{" "}
            {/* Removed filter for perf, direct fill is fine */}
          </marker>
        </defs>

        {/* Main Labels and static Neuron Core are unchanged */}
        <text
          x="100"
          y="40"
          fontSize="24"
          fontWeight="bold"
          fill={textPrimaryColor}
          textAnchor="middle"
        >
          Inputs
        </text>
        <line
          x1="50"
          y1="55"
          x2="150"
          y2="55"
          stroke={dividerColor}
          strokeWidth="1"
        />
        <text
          x="680"
          y="40"
          fontSize="24"
          fontWeight="bold"
          fill={textPrimaryColor}
          textAnchor="middle"
        >
          Output
        </text>
        <line
          x1="630"
          y1="55"
          x2="730"
          y2="55"
          stroke={dividerColor}
          strokeWidth="1"
        />
        <circle
          cx="350"
          cy="200"
          r="120"
          fill={surfaceColor}
          stroke={dividerColor}
          strokeWidth="2"
        />

        {/* Dynamic Elements: Assign refs in the order they appear in animationStepsConfig */}
        {/* IMPORTANT: The index passed to el => pathRefs.current[index] = el must match the config */}

        {/* Texts - Group 1 (Step 1, 2) */}
        <text
          ref={(el) =>
            (textRefs.current[0] = { element: el, baseColor: textPrimaryColor })
          }
          x="30"
          y="105"
          fontSize="18"
          fill={textPrimaryColor}
        >
          X₁
        </text>
        <text
          ref={(el) => (textRefs.current[1] = { element: el })}
          x="140"
          y="105"
          fontSize="16"
          fill={textSecondaryColor}
        >
          W₁
        </text>
        <text
          ref={(el) =>
            (textRefs.current[2] = { element: el, baseColor: textPrimaryColor })
          }
          x="35"
          y="310"
          fontSize="18"
          fill={textPrimaryColor}
        >
          X₂
        </text>
        <text
          ref={(el) => (textRefs.current[3] = { element: el })}
          x="145"
          y="305"
          fontSize="16"
          fill={textSecondaryColor}
        >
          W₂
        </text>

        {/* Paths - Group 1 (Step 1) */}
        <line
          ref={(el) => (pathRefs.current[0] = el)}
          x1="60"
          y1="100"
          x2="200"
          y2="140"
          stroke={dividerColor}
          strokeWidth="1.5"
          strokeDasharray="5 5"
          markerEnd="url(#arrowhead)"
        />
        {/* Path 1 is an invisible path, not for config -> for weight W1 text. NO, W1 is textRefs[1] */}
        <line
          ref={(el) => (pathRefs.current[2] = el)}
          x1="60"
          y1="300"
          x2="200"
          y2="260"
          stroke={dividerColor}
          strokeWidth="1.5"
          strokeDasharray="5 5"
          markerEnd="url(#arrowhead)"
        />
        {/* Path 3 is invisible path for W2 -> skip */}

        {/* Nodes - Group 1 (Step 2) */}
        <rect
          ref={(el) => (nodeRefs.current[0] = el)}
          x="230"
          y="135"
          width="30"
          height="30"
          rx="5"
          fill="rgb(30 41 59)"
          stroke={dividerColor}
          strokeWidth="1.5"
        />
        <rect
          ref={(el) => (nodeRefs.current[1] = el)}
          x="230"
          y="235"
          width="30"
          height="30"
          rx="5"
          fill="rgb(30 41 59)"
          stroke={dividerColor}
          strokeWidth="1.5"
        />
        {/* Texts for Multipliers (Step 2) */}
        <text
          ref={(el) =>
            (textRefs.current[8] = { element: el, baseColor: textPrimaryColor })
          }
          x="245"
          y="161"
          fontSize="18"
          textAnchor="middle"
          fill={textPrimaryColor}
        >
          *
        </text>
        <text
          ref={(el) =>
            (textRefs.current[10] = {
              element: el,
              baseColor: textPrimaryColor,
            })
          }
          x="245"
          y="260"
          fontSize="18"
          textAnchor="middle"
          fill={textPrimaryColor}
        >
          *
        </text>

        {/* Paths - Group 2 (Step 3) */}
        <line
          ref={(el) => (pathRefs.current[4] = el)}
          x1="270"
          y1="150"
          x2="315"
          y2="178"
          stroke={dividerColor}
          strokeWidth="1.5"
          strokeDasharray="5 5"
          markerEnd="url(#arrowhead)"
        />
        <line
          ref={(el) => (pathRefs.current[5] = el)}
          x1="270"
          y1="250"
          x2="315"
          y2="223"
          stroke={dividerColor}
          strokeWidth="1.5"
          strokeDasharray="5 5"
          markerEnd="url(#arrowhead)"
        />

        {/* Texts - Group 2 (Step 4 - Bias) & Node (Sum) */}
        <text
          ref={(el) => (textRefs.current[4] = { element: el })}
          x="345"
          y="310"
          fontSize="24"
          fill={textSecondaryColor}
        >
          b
        </text>
        <rect
          ref={(el) => (nodeRefs.current[2] = el)}
          x="335"
          y="185"
          width="30"
          height="30"
          rx="5"
          fill="rgb(30 41 59)"
          stroke={dividerColor}
          strokeWidth="1.5"
        />
        {/* Text for Sum (Step 4) */}
        <text
          ref={(el) =>
            (textRefs.current[12] = {
              element: el,
              baseColor: textPrimaryColor,
            })
          }
          x="350"
          y="207"
          fontSize="20"
          textAnchor="middle"
          fill={textPrimaryColor}
        >
          +
        </text>

        {/* Path - Group 3 (Step 4 - Bias to Sum) */}
        <line
          ref={(el) => (pathRefs.current[6] = el)}
          x1="350"
          y1="277"
          x2="350"
          y2="237"
          stroke={dividerColor}
          strokeWidth="1.5"
          strokeDasharray="5 5"
          markerEnd="url(#arrowhead)"
        />

        {/* Path & Node & Texts - Group 4 & 5 (Step 5, 6 - Sum to Activation, Activation itself) */}
        <line
          ref={(el) => (pathRefs.current[7] = el)}
          x1="375"
          y1="200"
          x2="413"
          y2="200"
          stroke={dividerColor}
          strokeWidth="1.5"
          strokeDasharray="5 5"
          markerEnd="url(#arrowhead)"
        />
        <rect
          ref={(el) => (nodeRefs.current[3] = el)}
          x="435"
          y="185"
          width="50"
          height="30"
          rx="5"
          fill="rgb(30 41 59)"
          stroke={dividerColor}
          strokeWidth="1.5"
        />
        {/* Texts for Activation (Step 6) */}
        <text
          ref={(el) =>
            (textRefs.current[5] = { element: el, baseColor: textPrimaryColor })
          }
          x="460"
          y="205"
          fontSize="18"
          textAnchor="middle"
          fill={textPrimaryColor}
        >
          ƒ
        </text>
        <text
          ref={(el) => (textRefs.current[14] = { element: el })}
          x="469"
          y="162"
          fontSize="14"
          fill={textSecondaryColor}
        >
          Activation
        </text>
        <text
          ref={(el) => (textRefs.current[15] = { element: el })}
          x="475"
          y="180"
          fontSize="14"
          fill={textSecondaryColor}
        >
          Function
        </text>

        {/* Path & Text - Group 6 (Step 7 - Activation to Output, Output Y) */}
        <line
          ref={(el) => (pathRefs.current[8] = el)}
          x1="505"
          y1="200"
          x2="640"
          y2="200"
          stroke={dividerColor}
          strokeWidth="1.5"
          strokeDasharray="5 5"
          markerEnd="url(#arrowhead)"
        />
        <text
          ref={(el) =>
            (textRefs.current[7] = { element: el, baseColor: textPrimaryColor })
          }
          x="670"
          y="205"
          fontSize="18"
          fill={textPrimaryColor}
        >
          Y
        </text>
      </svg>
    </div>
  );
};

export default NeuronDiagram;
