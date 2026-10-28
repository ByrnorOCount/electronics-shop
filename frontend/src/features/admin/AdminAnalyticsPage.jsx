import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import adminService from "./adminService";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency, formatShortDate } from "../../utils/formatters";

const toDateInputValue = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 30);

  return {
    startDate: toDateInputValue(startDate),
    endDate: toDateInputValue(endDate),
  };
};

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rangeError, setRangeError] = useState(null);
  const [dateRange, setDateRange] = useState(getDefaultDateRange);
  const [appliedRange, setAppliedRange] = useState(getDefaultDateRange);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getAnalytics(appliedRange);

        const formattedData = {
          ...data,
          salesByDay: (data.salesByDay ?? []).map((item) => ({
            ...item,
            date: formatShortDate(item.date),
          })),
          newUserSignups: (data.newUserSignups ?? []).map((item) => ({
            ...item,
            date: formatShortDate(item.date),
          })),
        };
        setAnalytics(formattedData);
      } catch (err) {
        setError("Failed to load analytics data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [appliedRange]);

  const handleDateRangeSubmit = (event) => {
    event.preventDefault();
    if (dateRange.startDate > dateRange.endDate) {
      setRangeError("Start date must be on or before the end date.");
      return;
    }
    setRangeError(null);
    setAppliedRange({ ...dateRange });
  };

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
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <h1 className="text-3xl font-bold">Site Analytics</h1>
        <form
          onSubmit={handleDateRangeSubmit}
          className="flex flex-wrap items-end gap-3"
        >
          <label className="grid gap-1 text-sm font-medium text-gray-700">
            From
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(event) =>
                setDateRange({ ...dateRange, startDate: event.target.value })
              }
              className="rounded border border-gray-300 px-3 py-2"
              required
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-gray-700">
            To
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(event) =>
                setDateRange({ ...dateRange, endDate: event.target.value })
              }
              className="rounded border border-gray-300 px-3 py-2"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Apply
          </button>
        </form>
        {rangeError && (
          <p className="w-full text-sm text-red-600" role="alert">
            {rangeError}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Sales by Day</h2>
          {analytics?.salesByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.salesByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="total" fill="#168a82" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No sales for this date range.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Top 5 Selling Products</h2>
          {analytics?.topProducts?.length > 0 ? (
            <ul className="space-y-2">
              {analytics.topProducts.map((product, index) => (
                <li
                  key={product.name}
                  className="flex justify-between items-center"
                >
                  <Link
                    to={`/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {index + 1}. {product.name}
                  </Link>
                  <span className="text-right text-sm">
                    <span className="block font-semibold">
                      {formatCurrency(Number(product.total_sales))}
                    </span>
                    <span className="text-gray-500">
                      {product.total_quantity} sold
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No product sales data available.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Sales by Category</h2>
          {analytics?.salesByCategory?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.salesByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="total_sales" fill="#d97732" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">
              No category sales for this date range.
            </p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Top Customers</h2>
          {analytics?.topCustomers?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b text-gray-500">
                  <tr>
                    <th className="py-2 pr-3 font-medium">Customer</th>
                    <th className="py-2 px-3 font-medium">Orders</th>
                    <th className="py-2 px-3 font-medium">Spent</th>
                    <th className="py-2 pl-3 font-medium">Average order</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b last:border-0">
                      <td className="py-3 pr-3">
                        <span className="block font-medium">
                          {customer.first_name} {customer.last_name}
                        </span>
                        <span className="text-gray-500">{customer.email}</span>
                      </td>
                      <td className="py-3 px-3">{customer.order_count}</td>
                      <td className="py-3 px-3 font-medium">
                        {formatCurrency(Number(customer.total_spent))}
                      </td>
                      <td className="py-3 pl-3">
                        {formatCurrency(Number(customer.average_order_value))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">
              No customer purchases for this date range.
            </p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Customer Segments</h2>
          {analytics?.customerSegments?.length > 0 ? (
            <div className="divide-y">
              {analytics.customerSegments.map((segment) => (
                <div
                  key={segment.segment}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <span className="font-medium">{segment.segment}</span>
                  <span className="text-right text-sm">
                    <span className="block font-semibold">
                      {segment.customer_count} customers
                    </span>
                    <span className="text-gray-500">
                      {segment.segment === "One-time"
                        ? "1 order | "
                        : segment.segment === "Repeat"
                          ? "2-4 orders | "
                          : "5+ orders | "}
                      {formatCurrency(Number(segment.total_spent))} spent
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No customer segments for this date range.
            </p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            New User Signups (Last 30 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.newUserSignups ?? []}>
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
