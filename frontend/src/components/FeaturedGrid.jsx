/**
 * Static demo featured grid. Replace static data with API later.
 */
import React from "react";
import ProductCard from "./ProductCard";

const demoProducts = [
  { id: 1, name: "Raspberry Pi 4 Model B 4GB", price: 49.99, short: "Small single-board computer", img: "/images/pi4.jpg" },
  { id: 2, name: "ESP32 Dev Module", price: 6.5, short: "Wi-Fi + BLE microcontroller", img: "/images/esp32.jpg" },
  { id: 3, name: "18650 Li-ion Battery", price: 8.25, short: "High capacity cell", img: "/images/battery.jpg" },
  { id: 4, name: "USB-C PD 65W Charger", price: 24.0, short: "Fast charging for laptops & phones", img: "/images/charger.jpg" },
];

export default function FeaturedGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
      {demoProducts.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
