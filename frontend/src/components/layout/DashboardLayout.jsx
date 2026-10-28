import React, { useState } from "react";
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const dashboardLink = isAdmin ? "/admin" : "/staff";
  const handleLogout = () => {
    dispatch(logout());
    toast.success("You have been signed out.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <aside
        className={`${isCollapsed ? "w-20 p-3" : "w-60 p-4"} fixed inset-y-0 left-0 z-30 flex flex-col overflow-y-auto bg-gray-800 text-white transition-[width,padding] duration-200`}
      >
        <div
          className={`mb-4 flex h-10 items-center ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isCollapsed && (
            <div className="flex min-w-0 items-center gap-2 pl-3">
              <Icon name="staff-panel" className="h-5 w-5 shrink-0" />
              <h2 className="truncate text-lg font-semibold">Control</h2>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed((collapsed) => !collapsed)}
            aria-label={
              isCollapsed ? "Expand control panel" : "Collapse control panel"
            }
            aria-expanded={!isCollapsed}
            title={
              isCollapsed ? "Expand control panel" : "Collapse control panel"
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-200 transition-colors hover:bg-gray-700 hover:text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Icon
              name={isCollapsed ? "chevron-right" : "chevron-left"}
              className="h-5 w-5"
            />
          </button>
        </div>
        <nav className="space-y-3">
          <section
            className={`${isCollapsed ? "-mx-3 px-3" : "-mx-4 px-4"} border-t-2 border-gray-600 pt-3 first:border-t-0 first:pt-0`}
          >
            <ul className="space-y-1">
              <li>
                <NavLink
                  to={dashboardLink}
                  end
                  title={isCollapsed ? "Dashboard" : undefined}
                  aria-label={isCollapsed ? "Dashboard" : undefined}
                  className={({ isActive }) =>
                    `flex h-10 items-center rounded-md transition-colors ${isCollapsed ? "justify-center" : "gap-3 px-3"} ${
                      isActive ? "bg-indigo-600" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <Icon name="dashboard" className="h-5 w-5" />
                  {!isCollapsed && <span>Dashboard</span>}
                </NavLink>
              </li>
            </ul>
          </section>
          <section
            className={`${isCollapsed ? "-mx-3 px-3" : "-mx-4 px-4"} border-t-2 border-gray-600 pt-3`}
          >
            {!isCollapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Staff Controls
              </h3>
            )}
            <ul className="space-y-1">
              {staffLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.to}
                    end={false}
                    title={isCollapsed ? link.name : undefined}
                    aria-label={isCollapsed ? link.name : undefined}
                    className={({ isActive }) =>
                      `flex h-10 items-center rounded-md transition-colors ${isCollapsed ? "justify-center" : "gap-3 px-3"} ${
                        isActive ? "bg-indigo-600" : "hover:bg-gray-700"
                      }`
                    }
                  >
                    <Icon name={link.icon} className="h-5 w-5" />
                    {!isCollapsed && <span>{link.name}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </section>
          {isAdmin && (
            <section
              className={`${isCollapsed ? "-mx-3 px-3" : "-mx-4 px-4"} border-t-2 border-gray-600 pt-3`}
            >
              {!isCollapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Admin Controls
                </h3>
              )}
              <ul className="space-y-1">
                {adminLinks.map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.to}
                      end={false}
                      title={isCollapsed ? link.name : undefined}
                      aria-label={isCollapsed ? link.name : undefined}
                      className={({ isActive }) =>
                        `flex h-10 items-center rounded-md transition-colors ${isCollapsed ? "justify-center" : "gap-3 px-3"} ${
                          isActive ? "bg-indigo-600" : "hover:bg-gray-700"
                        }`
                      }
                    >
                      <Icon name={link.icon} className="h-5 w-5" />
                      {!isCollapsed && <span>{link.name}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section
            className={`${isCollapsed ? "-mx-3 px-3" : "-mx-4 px-4"} border-t-2 border-gray-600 pt-3`}
          >
            <ul className="space-y-1">
              <li>
                <Link
                  to="/profile"
                  title={isCollapsed ? "My Profile" : undefined}
                  aria-label={isCollapsed ? "My Profile" : undefined}
                  className={`flex h-10 items-center rounded-md text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${isCollapsed ? "justify-center" : "gap-3 px-3"}`}
                >
                  <Icon name="user" className="h-5 w-5" />
                  {!isCollapsed && <span>My Profile</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  title={isCollapsed ? "Back to Shop" : undefined}
                  aria-label={isCollapsed ? "Back to Shop" : undefined}
                  className={`flex h-10 items-center rounded-md text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${isCollapsed ? "justify-center" : "gap-3 px-3"}`}
                >
                  <Icon name="arrow-left" className="h-5 w-5" />
                  {!isCollapsed && <span>Back to Shop</span>}
                </Link>
              </li>
            </ul>
          </section>
        </nav>
      </aside>
      <main
        className={`${isCollapsed ? "ml-20" : "ml-60"} min-h-screen flex-grow px-4 transition-[margin] duration-200`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
