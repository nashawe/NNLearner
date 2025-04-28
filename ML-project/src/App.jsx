import { Rocket, Brain, ActivitySquare, Paperclip, Blocks } from "lucide-react";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PraxisLogo from "./assets/praxis-logo.svg";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans antialiased bg-gray-50">
      <Navbar />
      <HeroSection />

      <div className="bg-white">
        <FeatureSection
          title="Build Custom Models"
          description="Customize layers, neurons, and activation functions easily."
          Icon={Blocks}
          bgColor="bg-blue-50"
          isFirst={true}
        />
      </div>

      <div className="bg-white">
        <FeatureSection
          title="Train and Test"
          description="Watch your models learn and evolve over time."
          Icon={Rocket}
          bgColor="bg-red-50"
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

      <div className="bg-white">
        <FeatureSection
          title="Interactive Visualizations"
          description="Track loss, accuracy, and live network behavior."
          Icon={ActivitySquare}
          bgColor="bg-green-50"
        />
      </div>

      <div className="bg-white">
        <FeatureSection
          title="Learn with Praxis"
          description="Explore tutorials and resources to enhance your skills."
          Icon={Paperclip}
          bgColor="bg-purple-50"
        />
      </div>

      <Footer />
    </div>
  );
}
