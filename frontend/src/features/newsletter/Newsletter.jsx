import React, { useState } from "react";
import newsletterService from "./newsletterService";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return (
    <section className="bg-gradient-to-b from-yellow-50 to-yellow-100 py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Get special offers</h2>
        <p className="text-gray-600 mb-6">
          Sign up for deals and product launches — we only send the good stuff.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setMessage("");
            try {
              const response = await newsletterService.subscribe(email);
              setMessage(
                response.data.data.message || "Thank you for subscribing!"
              );
              setEmail("");
            } catch (err) {
              setError(
                err.response?.data?.message ||
                  "An error occurred. Please try again."
              );
            }
          }}
          className="flex gap-2 justify-center"
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:ring focus:ring-indigo-200 bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Subscribe
          </button>
        </form>
        <div className="mt-4 h-5">
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>
    </section>
  );
}
