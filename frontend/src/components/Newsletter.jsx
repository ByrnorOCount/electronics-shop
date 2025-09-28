import React from "react";

export default function Newsletter() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-12 text-center">
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
          className="flex-1 px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
