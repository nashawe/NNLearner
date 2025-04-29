import {
  useState,
  useRef,
  useLayoutEffect,
  useState as useReactState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeatureSection({
  title,
  description,
  Icon,
  bgColor,
  isFirst = false,
  extraInfo = [],
}) {
  const [hovered, setHovered] = useState(false);
  const [contentHeight, setContentHeight] = useReactState(0);
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (hovered && ref.current) {
      setContentHeight(ref.current.scrollHeight);
    }
  }, [hovered]);

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`max-w-[900px] mx-auto ${
        isFirst ? "mt-5 mb-3" : "mt-20 mb-4"
      } px-10 py-[50px] rounded-2xl shadow-md border border-gray-300 ${bgColor}
      flex flex-col md:flex-row items-center text-center md:text-left gap-10
      transition-colors duration-300`}
    >
      {/* Icon Side */}
      <div className="flex-shrink-0">
        <Icon size={64} className="text-white" />
      </div>

      {/* Text Side */}
      <div className="flex flex-col">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-lg text-white">{description}</p>

        <AnimatePresence initial={false}>
          {hovered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: contentHeight, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden mt-4"
            >
              <ul ref={ref} className="space-y-1 text-base text-white">
                {extraInfo.map((point, i) => (
                  <li key={i}>• {point}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
