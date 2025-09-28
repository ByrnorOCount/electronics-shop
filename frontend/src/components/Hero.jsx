/**
 * Hero section: marketing banner + CTA
 */
import React from "react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Power your projects with quality electronics
          </h1>
          <p className="text-gray-600 mb-6">
            Components, boards and peripherals for hobbyists and professionals -
            curated and tested.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Shop catalog
            </a>
            <a
              href="#"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              Learn more
            </a>
          </div>
        </div>
        <div className="flex-1 w-full h-56 bg-white rounded-xl shadow-md">
          {/* Replace with image later */}
        </div>
      </div>
    </section>
  );
}
