import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { submitTicket, getUserTickets } from "./supportSlice";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";

const SupportPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tickets, status, error } = useAppSelector((state) => state.support);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      dispatch(getUserTickets());
    }
  }, [user, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) {
      // Basic validation feedback
      alert("Please fill out both subject and message.");
      return;
    }
    dispatch(submitTicket({ subject, message }));
    setSubject("");
    setMessage("");
  };

  if (!user) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Support Center</h1>
        <p className="text-lg text-gray-700 mb-6">
          Please{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            log in
          </Link>{" "}
          to submit and view your support tickets.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl mb-12">
      <h1 className="text-4xl font-bold mb-6">Support Center</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* New Ticket Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Create a New Ticket</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <Input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Issue with my order"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Please describe your issue in detail..."
                required
              ></textarea>
            </div>
            <Button type="submit" className="w-full">
              Submit Ticket
            </Button>
          </form>
        </div>

        {/* Ticket History */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Your Tickets</h2>
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
                <p className="text-gray-600">
                  You have not submitted any support tickets yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border border-gray-200 p-4 rounded-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">
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
                          {ticket.status}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700">{ticket.message}</p>
                    </div>
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
