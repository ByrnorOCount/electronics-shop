import React, { useEffect, useState } from "react";
import adminService from "./adminService";
import Spinner from "../../components/ui/Spinner";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await adminService.getLogs();
        setLogs(data);
      } catch (err) {
        setError("Failed to load system logs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">System Logs</h1>
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            Application Logs (`all.log`)
          </h2>
          <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto h-64">
            {logs?.all.join("\n")}
          </pre>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Error Logs (`error.log`)</h2>
          <pre className="bg-red-900 text-white p-4 rounded-md text-sm overflow-x-auto h-64">
            {logs?.error.join("\n")}
          </pre>
        </div>
      </div>
    </div>
  );
}
