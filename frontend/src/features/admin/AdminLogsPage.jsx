import React, { useEffect, useState } from "react";
import adminService from "./adminService";
import Spinner from "../../components/ui/Spinner";

const levelStyles = {
  error: "text-rose-300",
  warn: "text-amber-300",
  info: "text-emerald-300",
  debug: "text-sky-300",
};

const parseLogLine = (line) => {
  try {
    const entry = JSON.parse(line);
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      return { raw: line };
    }

    return {
      timestamp: entry.timestamp,
      level: entry.level || "log",
      message: entry.message || line,
      stack: entry.stack,
      raw: line,
    };
  } catch {
    return { raw: line };
  }
};

function TerminalLog({ title, fileName, entries = [] }) {
  const visibleEntries = entries.filter((entry) => entry !== "");

  return (
    <section className="overflow-hidden border border-[#344249] bg-[#101719] shadow-lg">
      <header className="flex min-h-12 flex-wrap items-center gap-x-4 gap-y-1 border-b border-[#344249] bg-[#1a2529] px-4 py-2 font-mono text-xs">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f07178]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e6b450]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#8ccf7e]" />
        </div>
        <h2 className="font-semibold text-[#e5ecee]">{title}</h2>
        <span className="text-[#8ea0a5]">tail -n 100 {fileName}</span>
        <span className="ml-auto text-[#8ea0a5]">
          {visibleEntries.length} lines
        </span>
      </header>

      <div
        role="log"
        aria-label={title}
        tabIndex={0}
        className="max-h-[28rem] min-h-52 overflow-auto px-3 py-2 font-mono text-xs leading-5 text-[#d3dcde] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:px-4"
      >
        {visibleEntries.length === 0 ? (
          <p className="px-2 py-6 text-[#8ea0a5]">No log entries.</p>
        ) : (
          visibleEntries.map((line, index) => {
            const entry = parseLogLine(line);
            const level = String(entry.level || "").toLowerCase();

            return (
              <article
                key={`${index}-${line}`}
                className="flex gap-3 border-b border-white/[0.06] px-2 py-2 last:border-b-0 hover:bg-white/[0.035]"
              >
                <span
                  className="w-8 shrink-0 select-none text-right text-[#607278]"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1 space-y-0.5">
                  {entry.timestamp || entry.level ? (
                    <div className="flex flex-wrap gap-x-3 text-[11px] leading-4">
                      {entry.timestamp && (
                        <time className="text-[#8ea0a5]">
                          {entry.timestamp}
                        </time>
                      )}
                      {entry.level && (
                        <span
                          className={`font-semibold uppercase ${levelStyles[level] || "text-[#c2a8ff]"}`}
                        >
                          {entry.level}
                        </span>
                      )}
                    </div>
                  ) : null}
                  <p className="whitespace-pre-wrap break-words text-[#e0e7e8]">
                    {entry.message || entry.raw}
                  </p>
                  {entry.stack && (
                    <details className="pt-1 text-[#aebdc0]">
                      <summary className="w-fit cursor-pointer text-[#8ea0a5] hover:text-white">
                        Show stack trace
                      </summary>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words border-l border-[#52656b] pl-3 text-[11px] text-[#aebdc0]">
                        {entry.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
      <footer className="border-t border-[#344249] bg-[#1a2529] px-4 py-2 font-mono text-[11px] text-[#8ea0a5]">
        <span className="text-emerald-400">admin@electronics-shop</span>
        <span>:~$ </span>
        <span className="text-[#e5ecee]">view {fileName}</span>
      </footer>
    </section>
  );
}

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
    return <p className="p-8 text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 font-mono text-xs uppercase text-emerald-700">
            Operations / Diagnostics
          </p>
          <h1 className="text-3xl font-bold">System Logs</h1>
        </div>
        <p className="font-mono text-xs text-gray-500">
          Showing the latest 100 lines per file
        </p>
      </header>
      <div className="space-y-5">
        <TerminalLog
          title="Application output"
          fileName="all.log"
          entries={logs?.all}
        />
        <TerminalLog
          title="Error output"
          fileName="error.log"
          entries={logs?.error}
        />
      </div>
    </div>
  );
}
