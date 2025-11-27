import React, { useEffect, useState } from "react";
import adminService from "./adminService";
import Spinner from "../../components/ui/Spinner";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError("Failed to load analytics data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Site Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            Sales by Day (Last 30 Days)
          </h2>
          {/* In a real app, use a chart library like Chart.js or Recharts here */}
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(analytics?.salesByDay, null, 2)}
          </pre>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Top 5 Selling Products</h2>
          <ul className="list-disc list-inside">
            {analytics?.topProducts.map((product) => (
              <li key={product.name}>
                {product.name} ({product.total_quantity} sold)
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Order Status Distribution</h2>
          <pre className="bg-gray-100 p-4 rounded-md">
            {JSON.stringify(analytics?.orderStatusDistribution, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
