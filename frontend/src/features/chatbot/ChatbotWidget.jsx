import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Icon from "../../components/ui/Icon";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hi! I can help you compare products or answer questions about shipping and returns.",
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const transcriptRef = useRef(null);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message || isSending) return;

    const history = messages
      .filter((item) => item.role === "user")
      .slice(-8)
      .map(({ role, content }) => ({ role, content }));

    setMessages((current) => [...current, { role: "user", content: message }]);
    setDraft("");
    setError("");
    setIsSending(true);

    try {
      const response = await api.post("/chatbot", { message, history });
      setMessages((current) => [
        ...current,
        { role: "assistant", content: response.data.data.answer },
      ]);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "The assistant could not respond. Try again or visit Support."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {isOpen && (
        <section
          aria-label="ElectroShop product assistant"
          aria-modal="false"
          className="flex h-[min(34rem,calc(100dvh-7rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl"
          role="dialog"
        >
          <header className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div>
              <h2 className="font-semibold">Product assistant</h2>
              <p className="text-xs text-slate-300">Powered by local Llama 3.2</p>
            </div>
            <button
              aria-label="Close product assistant"
              className="rounded p-2 text-slate-200 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <Icon name="x" className="h-5 w-5" />
            </button>
          </header>

          <div
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4"
            ref={transcriptRef}
          >
            {messages.map((item, index) => (
              <p
                className={`max-w-[88%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-5 ${
                  item.role === "user"
                    ? "ml-auto bg-amber-200 text-slate-900"
                    : "mr-auto border border-slate-200 bg-white text-slate-800"
                }`}
                key={`${index}-${item.role}`}
              >
                {item.content}
              </p>
            ))}
            {isSending && (
              <p className="text-sm text-slate-500" role="status">
                Thinking...
              </p>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            {error && (
              <p className="mb-2 text-xs text-red-700" role="alert">
                {error}
              </p>
            )}
            <form className="flex items-end gap-2" onSubmit={sendMessage}>
              <label className="sr-only" htmlFor="chatbot-message">
                Ask about products or store policies
              </label>
              <textarea
                className="max-h-24 min-h-10 flex-1 resize-none rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                disabled={isSending}
                id="chatbot-message"
                maxLength={1000}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Ask a question..."
                ref={inputRef}
                rows={1}
                value={draft}
              />
              <button
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-700"
                disabled={isSending || !draft.trim()}
                type="submit"
              >
                <Icon name="chevron-right" className="h-5 w-5" />
              </button>
            </form>
            <Link
              className="mt-2 inline-block text-xs font-medium text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-950"
              to="/support"
            >
              Contact customer support
            </Link>
          </div>
        </section>
      )}

      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close product assistant" : "Open product assistant"}
        className="flex h-14 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <Icon name={isOpen ? "x" : "message-circle"} className="h-5 w-5" />
        <span>{isOpen ? "Close" : "Ask ElectroShop"}</span>
      </button>
    </div>
  );
}