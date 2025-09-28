import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedGrid from "../components/FeaturedGrid";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />

        {/* Featured products */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-2">Featured products</h2>
          <p className="text-gray-600 mb-8">
            Hand-picked for performance, quality and value.
          </p>
          <FeaturedGrid />
        </section>

        {/* Why shop */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Why shop with us</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-2">Quality first</h3>
              <p className="text-gray-600">
                We curate components and devices from trusted manufacturers with
                thorough QA.
              </p>
            </article>
            <article className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-2">Fast shipping</h3>
              <p className="text-gray-600">
                Multiple shipping options and real-time tracking for peace of
                mind.
              </p>
            </article>
            <article className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-2">Support & warranty</h3>
              <p className="text-gray-600">
                Customer-first support plus manufacturer warranties on supported
                products.
              </p>
            </article>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}