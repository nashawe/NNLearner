import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="min-h-[80vh] w-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-end pt-[30px] pb-[50px]"></div>

      {/* Hero Content */}
      <div className="flex flex-col items-center text-center px-6 mt-[10px]">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold leading-tight text-gray-900 mb-6"
        >
          Build. Train. Understand.
        </motion.h1>

        <p className="mt-[25px] mb-[25px] text-xl text-gray-600 max-w-2xl mx-auto">
          Praxis lets you design, train, and visualize neural networks from
          scratch — no code, just real understanding.
        </p>

        <div className="flex flex-row justify-center items-center gap-4 mt-8">
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            className="px-10 py-4 rounded-full bg-black text-white font-semibold text-lg hover:bg-gray-800 transition-colors duration-300"
          >
            Build Your First Neural Network
          </motion.button>
        </div>

        <motion.button
          onClick={() =>
            document
              .getElementById("features")
              .scrollIntoView({ behavior: "smooth", block: "start" })
          }
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="mt-[60px] flex flex-col items-center text-black/70 cursor-pointer"
        >
          <span className="mb-1 text-sm font-medium">Learn More</span>
          <ChevronDown size={32} />
        </motion.button>
      </div>
    </div>
  );
}
