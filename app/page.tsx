"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import LaunchAppButton from "./components/common/LaunchAppButton";

gsap.registerPlugin(ScrollTrigger);

const PinDemo = () => {
  const heroImageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (
      !heroImageRef.current ||
      !contentRef.current ||
      !titleRef.current ||
      !subtitleRef.current
    )
      return;

    const contentHeight = contentRef.current.offsetHeight;

    // Split text into individual characters for animation
    const titleText = titleRef.current.textContent || "";
    const chars = titleText.split("");
    titleRef.current.innerHTML = chars
      .map(
        (char) =>
          `<span style="display: inline-block;">${char === " " ? "&nbsp;" : char}</span>`
      )
      .join("");

    const charElements = titleRef.current.querySelectorAll("span");

    // Unique stagger animation
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Characters fly in from random directions with rotation
    tl.from(charElements, {
      y: () => gsap.utils.random(-200, 200),
      x: () => gsap.utils.random(-200, 200),
      rotation: () => gsap.utils.random(-180, 180),
      opacity: 0,
      scale: 0,
      duration: 1.2,
      stagger: {
        each: 0.03,
        from: "random",
      },
      ease: "back.out(2)",
    }).from(
      subtitleRef.current,
      {
        clipPath: "inset(0 100% 0 0)",
        duration: 1,
        ease: "power3.inOut",
      },
      "-=0.4"
    );

    // Pin the hero
    ScrollTrigger.create({
      trigger: heroImageRef.current,
      start: "top top",
      end: `+=${contentHeight}`,
      pin: true,
      pinSpacing: false,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      tl.kill();
    };
  }, []);

  return (
    <div className="bg-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Image
                src="/images/logo-1.webp"
                className="w-18 sm:w-24 h-auto object-contain"
                alt="BGCL"
                width={96}
                height="0"
              />
              <span className="text-white font-mono font-bold text-lg sm:text-xl tracking-wider">
                Boys & Girls Club
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#products"
                className="text-gray-300 hover:text-cyan-400 transition-colors font-mono text-sm uppercase tracking-wider"
              >
                Products
              </a>
              <a
                href="#technology"
                className="text-gray-300 hover:text-cyan-400 transition-colors font-mono text-sm uppercase tracking-wider"
              >
                Technology
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-cyan-400 transition-colors font-mono text-sm uppercase tracking-wider"
              >
                About
              </a>
              <LaunchAppButton />
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-cyan-400 hover:text-cyan-300 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>
      {/* Pinned Hero */}
      <div
        ref={heroImageRef}
        className="h-screen sm:h-[1000px] w-full flex items-center justify-center overflow-hidden relative"
      >
        {/* Factory grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>

        <div className="text-center text-white px-4 sm:px-6 relative z-10">
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 font-mono tracking-widest uppercase"
          >
            Boys & Girls CLub
          </h1>
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl md:text-2xl opacity-90 font-mono tracking-wider"
          >
            Lynn Massachusetts
          </p>
        </div>
      </div>

      {/* Content that scrolls over */}
      <div ref={contentRef} className="relative z-10">
        {/* First content section */}
        <div className="bg-white text-gray-900 py-16 sm:py-24 md:py-32 px-6 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Our Mission
            </h2>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-4 sm:mb-6">
              To inspire and enable all young people, especially those that need
              us the most, to realize their full potential as productive
              responsible and caring citizens.
            </p>
          </div>
        </div>

        {/* Second content section */}
        <div className="bg-gray-100 text-gray-900 py-16 sm:py-24 md:py-32 px-6 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10">
              What We Do
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎨</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                  Design
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Beautiful, intuitive interfaces that users love
                </p>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚡</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                  Develop
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Fast, scalable solutions built with modern tech
                </p>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🚀</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                  Launch
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Get your product to market with confidence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Third content section */}
        <div className="bg-gray-900 text-white py-16 sm:py-24 md:py-32 px-6 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Start?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
              Let&apos;s build something amazing together
            </p>
            <button className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold hover:scale-105 transition-transform">
              Get in Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="">
      <PinDemo />
    </div>
  );
}
