import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-amber-200 border-t border-amber-300 py-8 text-gray-600">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
        <div className="col-span-2 lg:col-span-1">
          <Link
            to="/"
            className="text-xl font-bold text-indigo-600 flex items-center"
          >
            <img
              src="/logo.svg"
              alt="ElectroShop Logo"
              className="h-8 w-auto mr-1"
            />
            ElectroShop
          </Link>
          <p className="text-sm mt-2">
            © {new Date().getFullYear()} ElectroShop - All rights reserved.
          </p>
        </div>
        <div className="col-span-2 md:col-span-3 flex justify-start md:justify-end gap-12">
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/careers">Careers</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>
                <Link to="/support">Help Center</Link>
              </li>
              <li>
                <Link to="/support/warranty">Warranty</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
