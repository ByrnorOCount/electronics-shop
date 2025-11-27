import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Site Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            Sales by Day (Last 30 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.salesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Top 5 Selling Products</h2>
          {analytics?.topProducts.length > 0 ? (
            <ul className="space-y-2">
              {analytics.topProducts.map((product, index) => (
                <li
                  key={product.name}
                  className="flex justify-between items-center"
                >
                  <span>
                    {index + 1}. {product.name}
                  </span>
                  <span className="font-semibold bg-gray-200 px-2 py-1 rounded-md text-sm">
                    {product.total_quantity} sold
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No product sales data available.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            New User Signups (Last 30 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.newUserSignups}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="New Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Order Status Distribution</h2>
          <div className="space-y-2">
            {analytics?.orderStatusDistribution &&
              Object.entries(analytics.orderStatusDistribution)
                .filter(([key]) => key !== "total")
                .map(([status, count]) => (
                  <div key={status} className="flex justify-between">
                    <span className="capitalize">{status}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
