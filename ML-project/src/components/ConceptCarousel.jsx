"use client";
import React from "react";

const concepts = [
  {
    title: "Gradient Descent",
    icon: "📉",
    description:
      "Optimization algorithm that iteratively adjusts weights by moving them in the direction that minimizes the loss function. Forms the backbone of most training routines.",
  },
  {
    title: "Backpropagation",
    icon: "🔄",
    description:
      "Algorithm for computing gradients by propagating errors backward through layers. Enables efficient training of deep networks via gradient descent.",
  },
  {
    title: "Overfitting vs Underfitting",
    icon: "🎯",
    description:
      "Overfitting captures noise (low bias, high variance) while underfitting misses patterns (high bias, low variance). Balance is key for generalization.",
  },
  {
    title: "Dropout",
    icon: "🚪",
    description:
      "Regularization technique that randomly " +
      "drops neurons during training. Prevents co-adaptation and reduces overfitting by making the network robust.",
  },
  {
    title: "Weight Initialization",
    icon: "⚖️",
    description:
      "Strategic starting values (e.g., Xavier, He) ensure stable signal flow. Good initialization accelerates convergence and avoids vanishing/exploding gradients.",
  },
];

export default function ConceptCarousel() {
  return (
    <section id="concepts" className="bg-gray-900 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Deep Learning Concepts
        </h2>

        <div className="flex flex-nowrap overflow-x-auto gap-6 scrollbar-hide pb-2">
          {concepts.map((c) => (
            <div
              key={c.title}
              className="min-w-[250px] bg-gray-800 rounded-xl p-6 shadow-md hover:bg-gray-700 transition flex-shrink-0"
            >
              <span className="text-3xl">{c.icon}</span>
              <h3 className="mt-4 font-bold text-lg">{c.title}</h3>
              <p className="mt-2 text-sm text-gray-300 leading-snug">
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
