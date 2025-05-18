"use client";
import React from "react";

const architectures = [
  {
    name: "LeNet",
    sub: "1989 – Yann LeCun",
    description:
      "Pioneering convolutional network that proved back-prop works for visual tasks. Designed for handwritten digit recognition and set early benchmarks.",
  },
  {
    name: "AlexNet",
    sub: "2012 – Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton",
    description:
      "Deep CNN that won ImageNet 2012 by a huge margin. Popularized ReLU, dropout, and GPU training, igniting the deep-learning boom.",
  },
  {
    name: "VGG",
    sub: "2014 – Karen Simonyan & Andrew Zisserman",
    description:
      "Very deep CNN using small 3×3 filters. Showed that depth with uniform blocks improves performance and became a classic backbone.",
  },
  {
    name: "ResNet",
    sub: "2015 – Kaiming He et al.",
    description:
      "Introduced residual connections enabling 100+-layer networks. Won ImageNet 2015 and reshaped deep network design across domains.",
  },
  {
    name: "Transformer",
    sub: "2017 – Vaswani et al.",
    description:
      "Sequence-to-sequence model relying solely on attention. Replaced RNNs in NLP and now powers state-of-the-art language and vision models.",
  },
  {
    name: "GAN",
    sub: "2014 – Ian Goodfellow et al.",
    description:
      "Adversarial framework with generator and discriminator in competition. Enabled realistic image synthesis and sparked generative AI research.",
  },
];

export default function ArchitectureGallery() {
  return (
    <section id="architectures" className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-900 mb-12 text-center">
          Neural Network Architectures
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {architectures.map((arch) => (
            <div
              key={arch.name}
              className="bg-gray-100 p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold text-gray-800">{arch.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{arch.sub}</p>

              <svg
                className="w-full h-20 mt-4"
                viewBox="0 0 210 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="10"
                  y="10"
                  width="30"
                  height="40"
                  className="fill-gray-300"
                />
                <rect
                  x="50"
                  y="10"
                  width="30"
                  height="40"
                  className="fill-gray-400"
                />
                <rect
                  x="90"
                  y="10"
                  width="30"
                  height="40"
                  className="fill-gray-500"
                />
                <rect
                  x="130"
                  y="10"
                  width="30"
                  height="40"
                  className="fill-gray-600"
                />
                <rect
                  x="170"
                  y="10"
                  width="30"
                  height="40"
                  className="fill-gray-700"
                />
              </svg>

              <p className="text-gray-700 mt-4 text-sm">{arch.description}</p>

              <button
                className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                onClick={() => console.log(`Explore ${arch.name}`)}
              >
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
