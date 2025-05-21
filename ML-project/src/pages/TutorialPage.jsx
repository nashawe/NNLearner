// src/pages/TutorialPage.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom"; // For Navbar
import {
  PlayCircle,
  HelpCircle,
  Lightbulb,
  SearchCode,
  Server,
  Settings2,
  BarChart3,
  CodeXml,
  BookOpen,
  Blocks,
  Waypoints, // Icons for Navbar
} from "lucide-react";

const theme = {
  bgPage: "bg-slate-950",
  surface: "bg-slate-900", // Used by Navbar when scrolled
  cardBg: "bg-slate-800",
  cardHoverBg: "hover:bg-slate-700/70",
  textPrimary: "text-slate-50", // For main headings and Navbar logo
  textSecondary: "text-slate-300", // For Navbar links default
  textMuted: "text-slate-400",
  accent: "sky", // Primary accent for page & Navbar active/hover
  accentRGB: "14, 165, 233",
  accentSecondary: "violet", // For "Tips" section highlights
  divider: "border-slate-700",
  // Navbar specific (can be merged with above if values are identical)
  navbarLinkHoverText: "text-sky-300",
  navbarLinkActiveText: "text-sky-300 font-semibold",
};

// --- Navbar Links Data (Consistent with other pages) ---
const navLinks = [
  { label: "Learn", path: "/learn", Icon: BookOpen },
  { label: "Build", path: "/build", Icon: Blocks },
  { label: "Explore", path: "/explore", Icon: Waypoints },
];

// --- TUTORIAL DATA with YouTube Embed URLs ---
const tutorials = [
  {
    id: 1,
    title: "Getting Started: Navigating the NNLearner Platform",
    description:
      "A quick overview of the main sections: Learn, Build, and Explore. Understand the layout and how to find what you need.",
    duration: "5 min",
    embedSrc: "https://www.youtube.com/embed/VIDEO_ID_1_HERE", // REPLACE
    tags: ["Platform Basics", "Navigation"],
  },
  {
    id: 2,
    title: "Building Your First Network: The Design Canvas",
    description:
      "Step-by-step guide to using the 'Build' section. Add layers, choose activation functions, and set hyperparameters.",
    duration: "12 min",
    embedSrc: "https://www.youtube.com/embed/VIDEO_ID_2_HERE", // REPLACE
    tags: ["Build Mode", "Architecture"],
  },
  {
    id: 3,
    title: "Training & Visualization: Understanding Model Performance",
    description:
      "Learn how to upload data, initiate training, and interpret the loss and accuracy charts in the 'Train' section.",
    duration: "15 min",
    embedSrc:
      "https://www.youtube.com/embed/VIDEO_ID_3_HERE?modestbranding=1&rel=0", // REPLACE
    tags: ["Training", "Visualization", "Metrics"],
  },
  {
    id: 4,
    title: "Investigating Concepts: The Explore Page",
    description:
      "A deep dive into the Explore section. Look into the neuron anatomy visualizer, the activation function playground, and the NN architecture timeline.",
    duration: "8 min",
    embedSrc: "https://www.youtube.com/embed/VIDEO_ID_4_HERE", // REPLACE
    tags: ["Explore Mode", "Concepts"],
  },
];

const siteTips = [
  {
    id: "tip1",
    Icon: HelpCircle,
    title: "Interactive Tooltips",
    text: "Hover over various elements throughout the site, especially in diagrams and forms, to discover helpful tooltips explaining their purpose.",
  },
  {
    id: "tip2",
    Icon: Server,
    title: "Backend Processing",
    text: "When training models, remember that computations are happening on the server. Large datasets or complex networks might take some time to process.",
  },
  {
    id: "tip3",
    Icon: Lightbulb,
    title: "The 'Learn' Section",
    text: "Don't miss the 'Learn' page for in-depth explanations of the project's custom engine, architecture, and core ML concepts.",
  },
];

const TutorialCard = ({ tutorial }) => {
  /* ... (same as before) ... */
  return (
    <motion.div
      className={`rounded-xl overflow-hidden shadow-xl border ${theme.divider} ${theme.cardBg} flex flex-col group 
                 transition-all duration-300 ease-in-out ${theme.cardHoverBg} hover:shadow-2xl hover:border-${theme.accent}-500/50`}
      whileHover={{
        y: -6,
        transition: { type: "spring", stiffness: 300, damping: 15 },
      }}
    >
      <div className="relative w-full aspect-video bg-slate-700 rounded-t-xl overflow-hidden">
        <iframe
          key={tutorial.id}
          className="absolute top-0 left-0 w-full h-full"
          src={tutorial.embedSrc}
          title={tutorial.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3
          className={`text-lg font-semibold ${theme.textPrimary} mb-2 group-hover:text-${theme.accent}-300 transition-colors`}
        >
          {tutorial.title}
        </h3>
        <p
          className={`${theme.textMuted} text-sm mb-4 leading-relaxed flex-grow`}
        >
          {tutorial.description}
        </p>
        <div className="mt-auto flex flex-wrap gap-2">
          {tutorial.tags.map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 group-hover:bg-${theme.accent}-600/30 group-hover:text-${theme.accent}-200 transition-colors`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const TipCard = ({ tip }) => {
  /* ... (same as before) ... */
  return (
    <motion.div
      className={`p-5 rounded-lg ${theme.cardBg} border ${theme.divider} flex items-start gap-4 
                       shadow-lg hover:shadow-${theme.accentSecondary}-500/10 transition-shadow duration-300`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div
        className={`mt-1 flex-shrink-0 p-2.5 bg-${theme.accentSecondary}-500/15 rounded-full`}
      >
        <tip.Icon size={20} className={`text-${theme.accentSecondary}-400`} />
      </div>
      <div>
        <h4 className={`text-md font-semibold ${theme.textPrimary} mb-1`}>
          {tip.title}
        </h4>
        <p className={`${theme.textMuted} text-xs leading-normal`}>
          {tip.text}
        </p>
      </div>
    </motion.div>
  );
};

const TutorialPage = () => {
  const [isScrolled, setIsScrolled] = React.useState(false); // For Navbar scroll effect
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* --- INTEGRATED NAVBAR --- */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.1,
          ease: "easeOut",
        }} // Slightly faster entrance
        className={`w-full fixed top-0 left-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 transition-all duration-200 ease-in-out
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
        <div className="flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-lg rounded-xl sm:gap-2 md:gap-3">
          {navLinks.map(({ label, path, Icon }) => (
            <motion.button
              key={label}
              onClick={() => navigate(path)}
              className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-${
                           theme.accent
                         }-500/70 
                         focus:ring-offset-2 focus:ring-offset-${
                           isScrolled ? "slate-900" : "slate-950"
                         } /* Adjust offset color */
                         ${
                           location.pathname.startsWith(path) &&
                           (path !== "/" || location.pathname === "/")
                             ? `${theme.navbarLinkActiveText} bg-${theme.accent}-500/20`
                             : `${theme.textSecondary} hover:${theme.navbarLinkHoverText} hover:bg-slate-700/40`
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
      </motion.nav>
      {/* --- END OF INTEGRATED NAVBAR --- */}

      <div
        className={`${theme.bgPage} min-h-screen ${theme.textSecondary} font-sans pt-20 md:pt-24`}
      >
        <motion.header
          className="py-16 md:py-24 text-center relative overflow-hidden"
          // Removed initial/animate for header, will rely on children or page load
        >
          <div
            className="absolute inset-0 -z-10 opacity-30"
            style={{
              background: `radial-gradient(circle at 30% 70%, rgba(${theme.accentRGB},0.15) 0%, ${theme.bgPage} 40%), 
                            radial-gradient(circle at 70% 30%, rgba(128, 0, 128, 0.08) 0%, ${theme.bgPage} 40%)`, // violet accent used in theme
            }} // Using violet in the second radial to match theme.accentSecondary if it were used like 167,139,250 for violet
          />
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              // Start animation after navbar
              transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            >
              <PlayCircle
                size={48}
                className={`mx-auto mb-6 text-${theme.accent}-400`}
                strokeWidth={1.5}
              />
            </motion.div>
            <motion.h1
              className={`text-4xl sm:text-5xl md:text-6xl font-extrabold ${theme.textPrimary} tracking-tight mb-5`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            >
              Platform{" "}
              <span className={`text-${theme.accent}-400`}>Tutorials</span> &
              Guides
            </motion.h1>
            <motion.p
              className={`text-lg md:text-xl ${theme.textMuted} max-w-2xl mx-auto leading-relaxed`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
            >
              Master NNLearner with these quick guides. Learn to navigate,
              build, train, and explore effectively.
            </motion.p>
          </div>
        </motion.header>

        {/* Tutorials Grid (Animations slightly delayed to follow header) */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {tutorials.map((tutorial, index) => (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }} // Trigger sooner
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08 + 0.5,
                    ease: "easeOut",
                  }} // Staggered delay after header
                >
                  <TutorialCard tutorial={tutorial} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Site Usage Tips Section (Animations slightly delayed) */}
        <section className={`py-12 md:py-20 ${theme.surface}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-14">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`inline-block p-2 bg-${theme.accentSecondary}-500/15 rounded-full mb-4`}
              >
                <Lightbulb
                  size={28}
                  className={`text-${theme.accentSecondary}-400`}
                />
              </motion.div>
              <motion.h2
                className={`text-3xl sm:text-4xl font-bold ${theme.textPrimary} mb-3`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Tips for Using{" "}
                <span className={`text-${theme.accentSecondary}-400`}>
                  NNLearner
                </span>
              </motion.h2>
              <motion.p
                className={`${theme.textMuted} max-w-xl mx-auto`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Get the most out of your experience with these handy pointers.
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              {siteTips.map((tip, index) => (
                <motion.div // Added motion div for staggered animation of TipCards
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1 + 0.4,
                    ease: "easeOut",
                  }}
                >
                  <TipCard tip={tip} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <footer
          className={`py-16 text-center border-t ${theme.divider} ${theme.textMuted}`}
        >
          <p className="text-xs">NNLearner Platform | Happy Experimenting!</p>
        </footer>
      </div>
    </>
  );
};
export default TutorialPage;
