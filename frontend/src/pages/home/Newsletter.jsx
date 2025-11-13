import React from "react";

export default function Newsletter() {
  return (
    <section className="bg-gradient-to-b from-yellow-50 to-yellow-100 py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Get special offers</h2>
        <p className="text-gray-600 mb-6">
          Sign up for deals and product launches — we only send the good stuff.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex gap-2 justify-center"
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 px-3 py-2 border rounded-md focus:ring focus:ring-indigo-200 bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
