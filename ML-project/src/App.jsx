import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./main/HomePage";
import ArchitecturePage from "./build/ArchitecturePage";
import TrainPage from "./train/TrainPage";
import Explore from "./explore/Explore";
import LearnPage from "./learn/LearnPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-black">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/train" element={<TrainPage />} />
          <Route path="/build" element={<ArchitecturePage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/learn" element={<LearnPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// This is the main entry point of the application. It imports the HomePage component and renders it inside a div with some styling. The App component is then exported for use in other parts of the application.
