import React from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ErrorBoundary from "../ErrorBoundary";

// No longer needs useOutletContext as openSupportModal is removed from App.jsx context
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-yellow-50">
      <Header />
      <main className="flex flex-col flex-grow items-center">
        <ErrorBoundary>
          {/* The w-full is crucial to make the content pages stretch to the full width of the main container */}
          <div className="w-full">
            <Outlet />
          </div>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
