import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import HomePage from "./HomePage";
import BuildTrainPage from "./BuildTrainPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/build-train" element={<BuildTrainPage />} />
        {/* Add other routes here, e.g. Train, Load, Test */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
