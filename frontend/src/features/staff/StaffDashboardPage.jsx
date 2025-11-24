import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/ui/Icon";

const managementSections = [
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

const StaffDashboardPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementSections.map((section) => (
          <Link
            key={section.name}
            to={section.link}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
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

export default StaffDashboardPage;
