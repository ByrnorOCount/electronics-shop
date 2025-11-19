import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Icon from "../../../components/ui/Icon";

const staffLinks = [
  { name: "Dashboard", to: "/staff", icon: "dashboard" },
  { name: "Manage Tickets", to: "/staff/support", icon: "message-circle" },
  // { name: "Manage Products", to: "/staff/products", icon: "package" },
  // { name: "Manage Orders", to: "/staff/orders", icon: "shopping-cart" },
];

const StaffLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Staff Panel</h2>
        <nav>
          <ul>
            {staffLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive ? "bg-indigo-600" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <Icon name={link.icon} className="h-5 w-5" />
                  <span>{link.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-grow p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
