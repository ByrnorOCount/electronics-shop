import React from "react";

export default function AdminLogsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">System Logs</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">
          This page will display system activity logs, error logs, and other
          relevant system information for administrators.
        </p>
      </div>
    </div>
  );
}
