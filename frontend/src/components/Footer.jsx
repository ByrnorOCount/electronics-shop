import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span className="text-lg font-bold text-blue-600">ElectroShop</span>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ElectroShop - All rights reserved.
          </p>
        </div>
        <div className="flex gap-12">
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li><a href="#">Help center</a></li>
              <li><a href="#">Warranty</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
