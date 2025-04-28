import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div className="min-h-[80vh] w-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-end p-8"></div>

      {/* Hero Content */}
      <div className="flex flex-col items-center text-center px-6 mt-[20px]">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold leading-tight text-gray-900 mb-6"
        >
          Build. Train. Understand.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-lg md:text-2xl text-gray-600 max-w-2xl mb-10"
        >
          Explore Machine Learning models interactively with live training
          visualizations.
        </motion.p>

        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          className="px-8 py-3 rounded-full bg-black text-white font-semibold text-lg hover:bg-gray-800 transition-colors duration-300"
        >
          Get Started with Praxis
        </motion.button>
      </div>
    </div>
  );
}
