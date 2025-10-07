import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-yellow-50">
      <Header />
      <main className="flex flex-col flex-grow">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
