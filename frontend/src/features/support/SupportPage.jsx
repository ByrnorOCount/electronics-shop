import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import Spinner from "../../components/ui/Spinner";
import FaqSection from "./components/FaqSection";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";
import { useSupportActions } from "./useSupportActions";
import { useApi } from "../../hooks/useApi";
import { supportService } from "../../api";
import { formatStatus } from "../../utils/formatters";

const SupportPage = () => {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const {
    data: tickets,
    status,
    error,
    request: fetchUserTickets,
  } = useApi(supportService.getUserTickets, { defaultData: [] });

  useEffect(() => {
    if (user) {
      fetchUserTickets();
    }
  }, [user, fetchUserTickets]);

  // --- Ticket Submission Form ---
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const {
    submitTicket,
    isLoading: isSubmitting,
    error: submissionError,
  } = useSupportActions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error("Please fill out both subject and message.");
      return;
    }
    // Pass the fetch function so the hook can refresh the ticket list
    const success = await submitTicket({ subject, message }, fetchUserTickets);
    if (success) {
      setSubject("");
      setMessage("");
      setShowTicketForm(false); // Hide form after submission
    }
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Support Center</h1>
          <p className="text-lg text-gray-700 mb-6">
            Please{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              log in
            </Link>{" "}
            to submit and view your support tickets.
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <FaqSection />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Support Center</h1>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <h2 className="text-2xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <FaqSection />
        </div>
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <h2 className="text-2xl font-bold">Your Support Tickets</h2>
            {user && (
              <Button
                onClick={() => setShowTicketForm(!showTicketForm)}
                className="w-full sm:w-auto"
                variant="primary"
              >
                {showTicketForm ? "Hide Form" : "Submit a Ticket"}
              </Button>
            )}
          </div>
          {showTicketForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4">Submit New Ticket</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="support-subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                  <Input
                    type="text"
                    id="support-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Issue with my order"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="support-message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="support-message"
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Please describe your issue in detail..."
                    required
                  ></textarea>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </form>
            </div>
          )}
          {status === "loading" && (
            <div className="flex justify-center">
              <Spinner />
            </div>
          )}
          {status === "failed" && (
            <p className="text-red-500">Error: {error}</p>
          )}
          {status === "succeeded" && (
            <>
              {tickets.length === 0 ? (
                <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
                  You have not submitted any support tickets yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <Link
                      to={`/support/ticket/${ticket.id}`}
                      key={ticket.id}
                      className="block border border-gray-200 p-4 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">
                              {ticket.subject}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Ticket #{ticket.id} &bull; Created on{" "}
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
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
