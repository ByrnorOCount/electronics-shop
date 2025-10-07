import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h1 className="text-6xl font-bold text-red-500">Oops!</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mt-4">Something went wrong.</h2>
          <p className="text-gray-600 mt-2">We're sorry for the inconvenience. Please try again or return to the homepage.</p>
          <Link to="/" onClick={() => this.setState({ hasError: false })} className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Go to Homepage
          </Link>
          {/* For development, it's useful to see the error */}
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="mt-6 p-4 bg-gray-100 rounded-md text-left w-full max-w-2xl">
              <summary className="cursor-pointer font-semibold">Error Details</summary>
              <pre className="mt-2 text-sm whitespace-pre-wrap break-words">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
