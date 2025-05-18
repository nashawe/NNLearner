"use client";
import React from "react";

export default function ExploreHero() {
  return (
    <section className="bg-gray-900 py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Explore Neural Networks
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mt-4">
          Dive into architectures, activations, and key concepts powering
          today’s AI.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <a
            href="#architectures"
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Architectures
          </a>
          <a
            href="#activations"
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Activations
          </a>
          <a
            href="#concepts"
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Concepts
          </a>
        </div>
      </div>
    </section>
  );
}
