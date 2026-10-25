import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ErrorBoundary from "../ErrorBoundary";
import ChatbotWidget from "../../features/chatbot/ChatbotWidget";

// No longer needs useOutletContext as openSupportModal is removed from App.jsx context
const Layout = () => {
  const { pathname } = useLocation();
  const isProductDetailPage = /^\/products\/\d+$/.test(pathname);

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
      {!isProductDetailPage && <ChatbotWidget />}
    </div>
  );
};

export default Layout;
