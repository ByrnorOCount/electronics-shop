import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { selectIsAdmin } from "../features/auth/authSlice";
import Icon from "../components/ui/Icon";
import { adminService } from "../api";
import { formatCurrency } from "../utils/formatters";

const staffManagementSections = [
  {
    name: "Manage Support Tickets",
    description: "View, reply to, and manage all customer support tickets.",
    link: "/staff/support",
    icon: "message-circle",
  },
  {
    name: "Manage Orders",
    description: "Update order statuses and view order details.",
    link: "/staff/orders",
    icon: "shopping-cart",
  },
  {
    name: "Manage Products",
    description: "Add, edit, and remove products from the catalog.",
    link: "/staff/products",
    icon: "package",
  },
];

const adminManagementSections = [
  {
    name: "Manage Users",
    description: "View, edit roles, and manage all registered users.",
    link: "/admin/users",
    icon: "users",
  },
  {
    name: "Manage Categories",
    description: "Add, edit, and remove product categories.",
    link: "/admin/categories",
    icon: "tag",
  },
  {
    name: "Site Analytics",
    description: "View key metrics, sales trends, and user activity.",
    link: "/admin/analytics",
    icon: "bar-chart-2",
  },
  {
    name: "System Logs",
    description: "Access system activity logs and error reports.",
    link: "/admin/logs",
    icon: "file-text",
  },
];

const AdminStats = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await adminService.getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Site Overview</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-500">Total Sales</h3>
          <p className="text-3xl font-bold mt-1">
            {metrics ? formatCurrency(Number(metrics.totalSales)) : "--"}
          </p>
        </article>
        <article className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-500">Total Orders</h3>
          <p className="text-3xl font-bold mt-1">
            {metrics ? metrics.totalOrders : "--"}
          </p>
        </article>
        <article className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold mt-1">
            {metrics ? metrics.totalUsers : "--"}
          </p>
        </article>
      </div>
    </div>
  );
};

const DashboardHomePage = () => {
  const isAdmin = useAppSelector(selectIsAdmin);

  const managementSections = isAdmin
    ? [...staffManagementSections, ...adminManagementSections]
    : staffManagementSections;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {isAdmin && <AdminStats />}
      <h2 className="text-2xl font-bold mb-4">Management Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {managementSections.map((section) => (
          <Link
            key={section.name}
            to={section.link}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <Icon
              name={section.icon}
              className="h-8 w-8 text-indigo-600 mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{section.name}</h3>
            <p className="text-gray-600">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardHomePage;
