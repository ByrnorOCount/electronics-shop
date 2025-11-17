import React from "react";
import { Link } from "react-router-dom";

const SupportPage = () => {
  return (
    <div className="container mx-auto p-8 max-w-4xl mb-12">
      <h1 className="text-4xl font-bold mb-4">Help Center</h1>
      <p className="text-lg text-gray-700 mb-8">
        We're here to help. Find answers to common questions or get in touch
        with our support team.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            Have a question? Our team is ready to assist you.
          </p>
          <a
            href="mailto:support@electroshop.example.com"
            className="text-indigo-600 hover:underline"
          >
            support@electroshop.example.com
          </a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Warranty Information</h2>
          <p className="text-gray-600 mb-4">
            Learn about our product warranty policies and how to make a claim.
          </p>
          <Link
            to="/support/warranty"
            className="text-indigo-600 hover:underline"
          >
            View Warranty Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
