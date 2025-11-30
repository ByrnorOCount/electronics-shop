/**
 * Hero section: marketing banner + CTA
 */
import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-yellow-100 to-yellow-50 py-16">
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
            <Link
              to="/products"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Shop catalog
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md bg-white hover:bg-indigo-50"
            >
              Learn more
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <img
            src="/hero.jpg"
            alt="A modern desk setup with various electronic gadgets including a laptop, tablet, and speakers."
            className="w-full h-56 md:h-64 object-cover rounded-xl shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
