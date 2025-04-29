import { Rocket, Brain, ActivitySquare, Paperclip, Blocks } from "lucide-react";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans antialiased bg-gray-50">
      <Navbar />
      <HeroSection />

      <div id="features" className="bg-white">
        <FeatureSection
          title="Build Custom Models"
          description="Customize layers, neurons, and activation functions easily."
          Icon={Blocks}
          bgColor="bg-sky-600 text-white shadow-md hover:brightness-110 transition"
          isFirst={true}
          extraInfo={[
            "Define the number of layers and neurons per layer manually",
            "Select activation functions (ReLU, Sigmoid, Tanh, etc.)",
            "View a diagram of your network's architecture before training",
            "Input binary or multi-class data and labels for training and testing",
          ]}
        />
      </div>

      <div className="bg-white">
        <FeatureSection
          title="Train and Visualize"
          description="Watch your models learn and evolve over time."
          Icon={Rocket}
          bgColor="bg-amber-600 shadow-md hover:brightness-110 transition"
          extraInfo={[
            "Choose learning rates and training epochs dynamically",
            "Live loss and accuracy line graphs while training",
            "View model performance and weight updates across training iterations",
            "Compare different models and their training outcomes",
          ]}
        />
      </div>

      <div className="bg-white pb-10">
        <FeatureSection
          title="Learn with Praxis"
          description="Explore tutorials and resources to enhance your skills."
          Icon={Paperclip}
          bgColor="bg-violet-600 text-white shadow-md hover:brightness-110 transition"
          extraInfo={[
            "Step-by-step tutorials on neural networks from scratch using NumPy",
            "Explanations of key concepts like forward pass, backprop, and more",
            "Compare different architectures and learn their similarities and differences",
            "Get insights on how activation and loss functions affect learning",
          ]}
        />
      </div>

      <Footer />
    </div>
  );
}
