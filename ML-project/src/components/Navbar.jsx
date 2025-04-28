import { motion } from "framer-motion";
import PraxisLogo from "../assets/praxis-logo.svg";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-4 bg-white border-b border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
          <img
            src={PraxisLogo}
            alt="Praxis Logo"
            className="w-[150px] h-[150px]"
          />
        </div>
      </div>

      {/* About Me Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-1 rounded-full border border-black text-black font-semibold hover:bg-black hover:text-white transition-colors duration-300"
      >
        About Me
      </motion.button>
    </nav>
  );
}
