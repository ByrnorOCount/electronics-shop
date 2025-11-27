import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout, selectIsAdmin } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import Icon from "../../components/ui/Icon";

const staffLinks = [
  { name: "Manage Tickets", to: "/staff/support", icon: "message-circle" },
  { name: "Manage Orders", to: "/staff/orders", icon: "shopping-cart" },
  { name: "Manage Products", to: "/staff/products", icon: "package" },
];

const adminLinks = [
  { name: "Manage Users", to: "/admin/users", icon: "users" },
  { name: "Manage Categories", to: "/admin/categories", icon: "tag" },
  { name: "Site Analytics", to: "/admin/analytics", icon: "bar-chart-2" },
  { name: "System Logs", to: "/admin/logs", icon: "file-text" },
];

const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAdmin = useAppSelector(selectIsAdmin);

  const dashboardLink = isAdmin ? "/admin" : "/staff";
  const handleLogout = () => {
    dispatch(logout());
    toast.success("You have been signed out.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <aside className="w-56 bg-gray-800 text-white p-4 fixed h-full flex flex-col">
        <h2 className="text-2xl font-bold mb-5">Control Panel</h2>
        <nav className="flex-grow">
          <ul className="space-y-1 mb-4">
            <li>
              <NavLink
                to={dashboardLink}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive ? "bg-indigo-600" : "hover:bg-gray-700"
                  }`
                }
              >
                <Icon name="dashboard" className="h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
            </li>
          </ul>
          <h3 className="px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider">
            Staff
          </h3>
          <ul className="mt-1 space-y-1">
            {staffLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.to}
                  end={false}
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

          {isAdmin && (
            <div className="mt-4">
              <h3 className="px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                Administrator
              </h3>
              <ul className="mt-1 space-y-1">
                {adminLinks.map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.to}
                      end={false}
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
            </div>
          )}
        </nav>

        <div className="mt-auto space-y-1 border-t border-gray-700 pt-1">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Icon name="user" className="h-5 w-5" />
            <span>My Profile</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
            <span>Back to Shop</span>
          </Link>
        </div>
      </aside>
      <main className="ml-56 flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
