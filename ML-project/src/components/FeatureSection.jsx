import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function FeatureSection({
  title,
  description,
  Icon,
  bgColor,
  isFirst = false,
}) {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`max-w-5xl mx-auto ${
        isFirst ? "mt-12" : "my-32"
      } px-10 py-16 rounded-2xl shadow-md border border-gray-300 ${bgColor} flex flex-col md:flex-row items-center text-center md:text-left gap-10`}
    >
      {/* Icon Side */}
      <div className="flex-shrink-0">
        <Icon size={64} className="text-gray-700" />
      </div>

      {/* Text Side */}
      <div>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        <p className="text-lg text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}
