import { Settings, Rocket, Brain, ActivitySquare } from "lucide-react";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans antialiased bg-gray-50">
      <HeroSection />

      <div className="bg-white">
        <FeatureSection
          title="Build Custom Models"
          description="Customize layers, neurons, and activation functions easily."
          Icon={Settings}
          bgColor="bg-blue-50"
        />
      </div>

      <div className="bg-gray-50">
        <FeatureSection
          title="Train and Test"
          description="Watch your models learn and evolve over time."
          Icon={Rocket}
          bgColor="bg-purple-50"
        />
      </div>

      <div className="bg-white">
        <FeatureSection
          title="Understand Architectures"
          description="Visualize how data flows through networks."
          Icon={Brain}
          bgColor="bg-pink-50"
        />
      </div>

      <div className="bg-gray-50">
        <FeatureSection
          title="Interactive Visualizations"
          description="Track loss, accuracy, and live network behavior."
          Icon={ActivitySquare}
          bgColor="bg-green-50"
        />
      </div>

      <Footer />
    </div>
  );
}
