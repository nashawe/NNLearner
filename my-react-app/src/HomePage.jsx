import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <div className="text-xl font-bold">Houral</div>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/train" className="hover:text-blue-600">
            Train
          </Link>
          <Link to="/load" className="hover:text-blue-600">
            Load
          </Link>
          <Link to="/test" className="hover:text-blue-600">
            Test
          </Link>
        </div>
      </nav>

      {/* Hero / Heading */}
      <main className="flex-grow container mx-auto px-4 py-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
          Neural Network Builder
        </h1>
        <p className="text-gray-600 text-lg text-center mb-8">
          Build and train your own neural network — no coding needed.
        </p>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full max-w-5xl">
          {/* Card 1: Build/Train a Model */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
            <h2 className="text-xl font-semibold mb-2">Build/Train a Model</h2>
            <p className="text-gray-600 text-sm mb-4">
              Configure and train a new neural network from scratch.
            </p>
            <Link
              to="/build-train"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Build Model
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
            <h2 className="text-xl font-semibold mb-2">Load Existing Model</h2>
            <p className="text-gray-600 text-sm mb-4">
              Browse and manage previously saved models.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Browse Models
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
            <h2 className="text-xl font-semibold mb-2">Test a Model</h2>
            <p className="text-gray-600 text-sm mb-4">
              Evaluate model accuracy by providing test data.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Test with Data
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
