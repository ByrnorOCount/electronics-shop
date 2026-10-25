import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../../api/axios";
import Icon from "../../components/ui/Icon";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hi! Ask me about electronics, projects, or anything in our catalog.",
};

const markdownComponents = {
  a: ({ href = "", children }) => {
    if (/^\/(products\/\d+|support(?:\/[\w-]+)*)$/.test(href)) {
      return (
        <Link
          className="font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
          to={href}
        >
          {children}
        </Link>
      );
    }

    if (/^https:\/\//i.test(href)) {
      return (
        <a
          className="font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {children}
        </a>
      );
    }

    return <>{children}</>;
  },
  p: ({ children }) => <p className="my-1 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
};

function AssistantMarkdown({ children }) {
  const content = children
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/:\n{2,}(?=(?:\*\*)?\[[^\]]+\]\(\/products\/\d+\))/g, ": ")
    .trim();

  return (
    <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
  );
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [streamingAnswer, setStreamingAnswer] = useState("");
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
      .slice(1)
      .slice(-12)
      .map(({ role, content }) => ({ role, content }));

    setMessages((current) => [...current, { role: "user", content: message }]);
    setDraft("");
    setError("");
    setStreamingAnswer("");
    setIsSending(true);

    let fullResponse = "";
    let pendingLine = "";
    let streamedText = "";
    let streamError = "";

    const handleLine = (line) => {
      if (!line.trim()) return;
      try {
        const event = JSON.parse(line);
        if (event.error) {
          streamError = event.error;
          return;
        }
        if (event.token) {
          streamedText += event.token;
          setStreamingAnswer(streamedText);
        }
      } catch {
        streamError = "The assistant returned an invalid response.";
      }
    };

    const consumeResponse = (text) => {
      if (typeof text !== "string" || text.length <= fullResponse.length)
        return;
      pendingLine += text.slice(fullResponse.length);
      fullResponse = text;
      const lines = pendingLine.split("\n");
      pendingLine = lines.pop() || "";
      lines.forEach(handleLine);
    };

    try {
      const response = await api.post(
        "/chatbot",
        { message, history },
        {
          responseType: "text",
          onDownloadProgress: ({ event }) => {
            consumeResponse(event?.target?.responseText);
          },
        },
      );
      consumeResponse(response.data);
      if (pendingLine.trim()) handleLine(pendingLine);
      if (streamError) throw new Error(streamError);
      if (!streamedText.trim())
        throw new Error("The assistant returned no answer.");
      setMessages((current) => [
        ...current,
        { role: "assistant", content: streamedText.trim() },
      ]);
    } catch (requestError) {
      const responseBody = requestError.response?.data;
      let messageFromServer = responseBody?.message;
      if (typeof responseBody === "string") {
        try {
          messageFromServer = JSON.parse(responseBody).message;
        } catch {
          messageFromServer = "";
        }
      }
      setError(
        messageFromServer || requestError.message || "The request failed.",
      );
    } finally {
      setStreamingAnswer("");
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {isOpen && (
        <section
          aria-label="ElectroShop product assistant"
          aria-modal="false"
          className="flex h-[min(34rem,calc(100dvh-7rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-amber-200 bg-white shadow-2xl"
          role="dialog"
        >
          <header className="flex items-center justify-between bg-amber-200 px-4 py-3 text-indigo-900">
            <div>
              <h2 className="font-semibold">Product assistant</h2>
              <p className="text-xs text-indigo-800/75">Local Llama 3.2</p>
            </div>
            <button
              aria-label="Close product assistant"
              className="rounded p-2 text-indigo-800 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <Icon name="x" className="h-5 w-5" />
            </button>
          </header>

          <div
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto bg-yellow-50 p-4"
            ref={transcriptRef}
          >
            {messages.map((item, index) => (
              <div
                className={`max-w-[88%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-5 ${
                  item.role === "user"
                    ? "ml-auto bg-indigo-600 text-white"
                    : "mr-auto whitespace-normal border border-amber-100 bg-white text-gray-800"
                }`}
                key={`${index}-${item.role}`}
              >
                {item.role === "assistant" ? (
                  <AssistantMarkdown>{item.content}</AssistantMarkdown>
                ) : (
                  item.content
                )}
              </div>
            ))}
            {isSending && !streamingAnswer && (
              <p className="text-sm text-gray-600" role="status">
                Connecting to the assistant...
              </p>
            )}
            {streamingAnswer && (
              <div
                className="mr-auto max-w-[88%] whitespace-normal rounded-lg border border-amber-100 bg-white px-3 py-2 text-sm leading-5 text-gray-800"
                role="status"
              >
                <AssistantMarkdown>{streamingAnswer}</AssistantMarkdown>
                <span aria-hidden="true" className="animate-pulse">
                  |
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-amber-200 bg-white p-3">
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
                className="max-h-24 min-h-10 flex-1 resize-none rounded border border-amber-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                id="chatbot-message"
                maxLength={4000}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Ask anything..."
                ref={inputRef}
                rows={1}
                value={draft}
              />
              <button
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={!draft.trim() || isSending}
                type="submit"
              >
                <Icon name="chevron-right" className="h-5 w-5" />
              </button>
            </form>
            <Link
              className="mt-2 inline-block text-xs font-medium text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-900"
              to="/support"
            >
              Contact customer support
            </Link>
          </div>
        </section>
      )}

      <button
        aria-expanded={isOpen}
        aria-label={
          isOpen ? "Close product assistant" : "Open product assistant"
        }
        className="flex h-14 items-center gap-2 rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <Icon name={isOpen ? "x" : "message-circle"} className="h-5 w-5" />
        <span>{isOpen ? "Close" : "Ask ElectroShop"}</span>
      </button>
    </div>
  );
}
