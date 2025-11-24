import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks";
import { logout } from "../../auth/authSlice";
import toast from "react-hot-toast";
import Icon from "../../../components/ui/Icon";

const staffLinks = [
  { name: "Dashboard", to: "/staff", icon: "dashboard" },
  { name: "Manage Tickets", to: "/staff/support", icon: "message-circle" },
  { name: "Manage Orders", to: "/staff/orders", icon: "shopping-cart" },
  { name: "Manage Products", to: "/staff/products", icon: "package" },
];

const StaffLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You have been signed out.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <aside className="w-48 bg-gray-800 text-white p-4 fixed h-full flex flex-col">
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

        <div className="mt-auto pt-6 border-t border-gray-700">
          <h3 className="px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider">
            Account
          </h3>
          <ul className="mt-2 space-y-1">
            <li>
              <NavLink
                to="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-700"
              >
                <Icon name="settings" className="h-5 w-5" />
                <span>Settings</span>
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-700"
              >
                <Icon name="sign-out" className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
            <span>Back to Shop</span>
          </Link>
        </div>
      </aside>
      <main className="ml-48 flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
