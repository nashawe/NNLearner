"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ExploreHero() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // pin + scroll animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=50%",
        scrub: true,
        pin: true,
        pinSpacing: true,
        animation: gsap.to(contentRef.current, {
          opacity: 0,
          scale: 0.95,
          ease: "none",
        }),
      });

      // entrance animation
      gsap.fromTo(
        contentRef.current.querySelectorAll(".fade-up"),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-gray-900 min-h-screen flex items-center justify-center px-6 relative"
    >
      <div ref={contentRef} className="max-w-4xl mx-auto text-center">
        <h1 className="fade-up text-4xl -mt-24 md:text-6xl font-bold text-white">
          Explore Neural Networks
        </h1>
        <p className="fade-up text-lg md:text-xl text-gray-300 mt-4">
          Dive into architectures, activations, and key concepts powering
          today’s AI.
        </p>
        <div className="fade-up flex justify-center gap-4 mt-8">
          <a
            href="#architectures"
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Architectures
          </a>
          <a
            href="#activations"
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Activations
          </a>
          <a
            href="#anatomy"
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Anatomy
          </a>
        </div>
      </div>
    </section>
  );
}
