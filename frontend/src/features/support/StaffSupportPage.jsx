import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { staffService } from "../../api";
import Spinner from "../../components/ui/Spinner";
import { formatStatus } from "../../utils/formatters";

const StaffSupportPage = () => {
  const {
    data: tickets,
    status,
    error,
    request: fetchAllTickets,
  } = useApi(staffService.getAllSupportTickets, { defaultData: [] });

  useEffect(() => {
    fetchAllTickets();
  }, [fetchAllTickets]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Support Tickets</h1>

      {status === "loading" && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {status === "failed" && (
        <p className="text-red-500">
          Error: {error?.message || "Failed to load tickets."}
        </p>
      )}

      {status === "succeeded" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {tickets.length === 0 ? (
            <p className="text-gray-600">There are no support tickets.</p>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Link
                  to={`/support/ticket/${ticket.id}`} // Links to the same detail page
                  key={ticket.id}
                  className="block border border-gray-200 p-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {ticket.subject}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Ticket #{ticket.id} &bull; User ID: {ticket.user_id}{" "}
                        &bull; Created on{" "}
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        ticket.status === "open"
                          ? "bg-green-100 text-green-800"
                          : ticket.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {formatStatus(ticket.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700 truncate">
                    {ticket.message}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffSupportPage;
