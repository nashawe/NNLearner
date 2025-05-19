"use client";
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const archItems = [
  {
    name: "LeNet",
    sub: "1989 - Yann LeCun",
    description:
      "LeNet was one of the first successful neural networks for image recognition. It was designed to read handwritten digits, like those on checks. It introduced key ideas like convolutional layers and pooling, which are now common in modern image models. LeNet showed that machines could learn to understand images through structured layers of processing.",
  },
  {
    name: "AlexNet",
    sub: "2012 - Krizhevsky, Sutskever & Hinton",
    description:
      "AlexNet marked a major turning point in deep learning. It won a major image classification competition in 2012 by a wide margin, proving that deep neural networks could outperform traditional methods. It introduced useful techniques like ReLU (a new type of activation function), dropout (to prevent overfitting), and GPU-based training, which made it much faster. This model helped bring deep learning into the mainstream.",
  },
  {
    name: "VGG",
    sub: "2014 - Simonyan & Zisserman",
    description:
      "VGG made the architecture of convolutional networks simpler and more consistent by using only small (3x3) filters stacked in a regular pattern. This showed that making networks deeper could improve accuracy, even with a very straightforward design. However, the model is quite large and slow, so it’s mostly used today as a baseline or feature extractor.",
  },
  {
    name: "ResNet",
    sub: "2015 - Kaiming He et al.",
    description:
      "ResNet solved a big problem with deep networks: the more layers you add, the harder it gets to train them properly. ResNet introduced shortcut connections that let information skip over some layers. This made it possible to train much deeper models—over 100 layers—and still get great results. It became a standard for image tasks and influenced many later models.",
  },
  {
    name: "Transformer",
    sub: "2017 - Vaswani et al.",
    description:
      "The Transformer architecture changed how models handle sequences, like text or time-series data. Instead of processing input step-by-step, it looks at all parts of the input at once and figures out what’s important using a mechanism called attention. This allowed much faster training and better results on large datasets. Transformers are now the backbone of most advanced language and vision models, including ChatGPT.",
  },
  {
    name: "GAN",
    sub: "2014 - Goodfellow et al.",
    description:
      "GANs, or Generative Adversarial Networks, are made of two competing models: a generator that tries to make fake data, and a discriminator that tries to detect whether data is real or fake. As they train together, the generator gets better at producing realistic outputs, like images or music. GANs opened the door to creative AI applications, like face generation, art, and image editing.",
  },
];

export default function ArchitectureGallery() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const tocRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=" + archItems.length * 100 + "%",
        scrub: true,
        pin: true,
        pinSpacing: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=" + archItems.length * 100 + "%",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const offsetProgress = Math.max(
              0,
              progress - 1 / (archItems.length + 1)
            );
            const index = Math.min(
              archItems.length - 1,
              Math.floor(offsetProgress * archItems.length)
            );

            setActiveIndex(index);
          },
        },
      });

      tl.from(sectionRef.current.querySelector("h2"), {
        opacity: 0,
        y: 50,
        duration: 0.7,
        ease: "power3.out",
      });

      tl.from(
        tocRefs.current["container"],
        {
          opacity: 0,
          y: 50,
          duration: 0.7,
          ease: "power3.out",
        },
        "<"
      );

      tl.from(
        cardsRef.current,
        {
          y: () => window.innerHeight / 2 + 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 1,
        },
        "+=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="architectures"
      ref={sectionRef}
      className="bg-gray-900 min-h-screen relative overflow-hidden flex"
    >
      {/* Table of Contents */}
      <div
        ref={(el) => (tocRefs.current["container"] = el)}
        className="absolute left-12 top-1/2 -translate-y-1/2 z-20 space-y-3"
      >
        {archItems.map((item, idx) => (
          <div
            key={item.name}
            ref={(el) => (tocRefs.current[idx] = el)}
            className={`text-sm font-medium transition-all duration-300 ${
              idx === activeIndex
                ? "text-white scale-110"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="relative w-full">
        <h2 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-4xl font-bold text-white text-center">
          Famous Neural Network Architectures
        </h2>

        {archItems.map((item, idx) => (
          <div
            key={item.name}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="absolute top-1/2 left-1/2 w-full max-w-2xl transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-semibold text-white">{item.name}</h3>
            <p className="text-sm italic text-gray-300 mt-1">{item.sub}</p>
            <p className="mt-4 text-gray-200 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
