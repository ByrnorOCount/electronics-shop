import React, { useEffect, useState } from "react";
import { fetchHome } from "../services/api.js";

function HomePage() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetchHome().then((data) => {
      setMessage(data.message || "No message received");
    });
  }, []);

  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold text-blue-600">Online Shop</h1>
      <p className="mt-4 text-gray-700">{message}</p>
    </div>
  );
}

export default HomePage;