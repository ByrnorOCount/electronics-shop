import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-amber-100 border-t border-amber-200 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <Link to="/" className="text-lg font-bold text-indigo-600">
            ElectroShop
          </Link>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ElectroShop - All rights reserved.
          </p>
        </div>
        <div className="flex gap-12">
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li><Link to="/support">Help center</Link></li>
              <li><Link to="/support/warranty">Warranty</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
