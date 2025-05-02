import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ArchitecturePage from "./pages/ArchitecturePage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-black">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/build" element={<ArchitecturePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// This is the main entry point of the application. It imports the HomePage component and renders it inside a div with some styling. The App component is then exported for use in other parts of the application.
