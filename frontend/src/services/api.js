const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchHome() {
  try {
    const response = await fetch(`${API_URL}/`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (err) {
    console.error("API fetch error:", err);
    return { message: "Error connecting to backend" };
  }
}