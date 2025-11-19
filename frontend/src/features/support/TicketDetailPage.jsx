import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { supportService } from "../../api";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { useApi } from "../../hooks/useApi";

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const { user } = useAppSelector((state) => state.auth);

  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const {
    data: ticketData,
    status,
    error,
    request: fetchTicketDetails,
  } = useApi(supportService.getTicketById);

  const { isLoading: isSubmitting, request: submitReply } = useApi(
    supportService.addTicketReply
  );

  const { isLoading: isUpdatingStatus, request: updateStatus } = useApi(
    supportService.updateTicketStatus
  );

  useEffect(() => {
    fetchTicketDetails(ticketId);
  }, [ticketId, fetchTicketDetails]);

  useEffect(() => {
    if (ticketData) {
      setTicket(ticketData.ticket);
      setReplies(ticketData.replies);
    }
  }, [ticketData]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error("Reply message cannot be empty.");
      return;
    }
    try {
      const newReply = await submitReply(ticketId, { message: newMessage });
      setReplies([...replies, newReply]);
      setNewMessage("");
      toast.success("Reply sent successfully!");
      // If ticket was closed, user reply should re-open it.
      if (ticket.status === "closed") {
        fetchTicketDetails(ticketId); // Re-fetch to get updated status from backend
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reply.");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">
          {error?.message || "Failed to load ticket."}
        </p>
        <Link to="/support" className="text-indigo-600 hover:underline mt-4">
          &larr; Back to Support
        </Link>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center p-8">
        <p>Ticket not found.</p>
        <Link to="/support" className="text-indigo-600 hover:underline mt-4">
          &larr; Back to Support
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl mb-12">
      <Link
        to="/support"
        className="text-indigo-600 hover:underline mb-4 block"
      >
        &larr; Back to All Tickets
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
          <h1 className="text-3xl font-bold">{ticket.subject}</h1>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
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

        {ticket.status !== "closed" && (
          <div className="flex justify-end mb-4">
            <Button
              variant="danger"
              onClick={async () => {
                try {
                  const updated = await updateStatus(ticketId, {
                    status: "closed",
                  });
                  setTicket(updated);
                  toast.success("Ticket has been closed.");
                } catch (err) {
                  toast.error(
                    err.response?.data?.message || "Failed to close ticket."
                  );
                }
              }}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? "Closing..." : "Close Ticket"}
            </Button>
          </div>
        )}
        <p className="text-sm text-gray-500 mb-6">
          Ticket #{ticket.id} &bull; Created on{" "}
          {new Date(ticket.created_at).toLocaleString()}
        </p>

        {/* Message Thread */}
        <div className="space-y-6">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className={`p-4 rounded-lg ${
                reply.user_id === user.id
                  ? "bg-indigo-50 ml-auto"
                  : "bg-gray-50"
              }`}
              style={{ maxWidth: "85%" }}
            >
              <p className="font-semibold text-gray-800">
                {reply.user_id === user.id ? "You" : reply.author_name}
              </p>
              <p className="text-gray-700">{reply.message}</p>
              <p className="text-xs text-gray-400 mt-2 text-right">
                {new Date(reply.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Your Reply</h3>
          <form onSubmit={handleReplySubmit}>
            <textarea
              rows="5"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Type your message here..."
              required
            ></textarea>
            <Button type="submit" disabled={isSubmitting} className="mt-4">
              {isSubmitting
                ? "Sending..."
                : ticket.status === "closed"
                ? "Submit & Reopen Ticket"
                : "Send Reply"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
