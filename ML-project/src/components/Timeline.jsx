"use client";
import React from "react";

const milestones = [
  {
    year: "1958",
    title: "Perceptron proposed",
    summary:
      "Frank Rosenblatt introduces the Perceptron, laying the groundwork for neural networks.",
  },
  {
    year: "1986",
    title: "Backpropagation popularized",
    summary:
      "Rumelhart, Hinton & Williams publish paper demonstrating efficient training of multilayer networks.",
  },
  {
    year: "1998",
    title: "LeNet-5",
    summary:
      "Yann LeCun’s LeNet-5 shows power of convolutional networks for handwriting recognition.",
  },
  {
    year: "2012",
    title: "AlexNet wins ImageNet",
    summary:
      "Deep CNN trained on GPUs crushes competitors, igniting the modern deep-learning era.",
  },
  {
    year: "2017",
    title: "Transformer released",
    summary:
      "Vaswani et al. replace recurrent nets with self-attention, revolutionizing NLP and beyond.",
  },
];

export default function Timeline() {
  return (
    <section id="timeline" className="bg-gray-50 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-900 mb-12 text-center">
          Deep Learning Timeline
        </h2>

        <div className="relative">
          {/* vertical line */}
          <span className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-gray-300" />

          <div className="space-y-12">
            {milestones.map((m, idx) => (
              <div key={m.year} className="relative flex items-start">
                {/* dot */}
                <span
                  className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-indigo-600"
                  style={{ top: "0.25rem" }}
                />

                {/* year */}
                <div className="w-1/2 pr-8 text-right font-semibold text-indigo-700">
                  {m.year}
                </div>

                {/* content */}
                <div className="w-1/2 pl-8">
                  <h3 className="font-bold text-gray-800">{m.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 leading-snug">
                    {m.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
