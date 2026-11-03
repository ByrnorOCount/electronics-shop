import React, { useEffect, useState } from "react";
import adminService from "./adminService";
import Spinner from "../../components/ui/Spinner";
import Icon from "../../components/ui/Icon";

const LOG_BATCH_SIZE = 100;

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
      metadata: Object.fromEntries(
        Object.entries(entry).filter(
          ([key]) => !["timestamp", "level", "message", "stack"].includes(key),
        ),
      ),
      raw: line,
    };
  } catch {
    return { raw: line };
  }
};

const matchesOrderLog = (line) => {
  const entry = parseLogLine(line);
  return (
    /\border(?:s)?\b/i.test(entry.message || line) ||
    Object.keys(entry.metadata || {}).some((key) =>
      /^order(?:Id|_id)$/i.test(key),
    )
  );
};

const logViews = [
  {
    id: "application",
    title: "Application output",
    fileName: "all.log",
    icon: "file-text",
    iconColor: "text-cyan-700",
    activeClasses: "border-cyan-700 text-cyan-800",
  },
  {
    id: "errors",
    title: "Error output",
    fileName: "error.log",
    icon: "x",
    iconColor: "text-rose-700",
    activeClasses: "border-rose-700 text-rose-800",
  },
  {
    id: "orders",
    title: "Order activity",
    fileName: "all.log · order filter",
    icon: "orders",
    iconColor: "text-amber-700",
    activeClasses: "border-amber-700 text-amber-800",
  },
];

function TerminalLog({
  title,
  fileName,
  icon,
  entries = [],
  hasMore,
  loadingOlder,
  olderError,
  onLoadOlder,
}) {
  const visibleEntries = entries.filter((entry) => entry !== "").reverse();

  return (
    <section className="overflow-hidden border border-[#344249] bg-[#101719] shadow-lg">
      <header className="flex min-h-12 flex-wrap items-center gap-x-4 gap-y-1 border-b border-[#344249] bg-[#1a2529] px-4 py-2 font-mono text-xs">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f07178]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e6b450]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#8ccf7e]" />
        </div>
        <Icon
          name={icon}
          className="h-4 w-4 text-emerald-300"
          aria-hidden="true"
        />
        <h2 className="font-semibold text-[#e5ecee]">{title}</h2>
        <span className="text-[#8ea0a5]">less {fileName}</span>
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
                  {Object.keys(entry.metadata || {}).length > 0 && (
                    <details className="pt-1 text-[#aebdc0]">
                      <summary className="w-fit cursor-pointer text-[#8ea0a5] hover:text-white">
                        Show structured fields
                      </summary>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words border-l border-[#52656b] pl-3 text-[11px] text-[#aebdc0]">
                        {JSON.stringify(entry.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#344249] bg-[#1a2529] px-4 py-2 font-mono text-[11px] text-[#8ea0a5]">
        <div>
          <span className="text-emerald-400">admin@electronics-shop</span>
          <span>:~$ </span>
          <span className="text-[#e5ecee]">less {fileName}</span>
        </div>
        {hasMore ? (
          <button
            type="button"
            onClick={onLoadOlder}
            disabled={loadingOlder}
            className="border border-[#52656b] px-3 py-1.5 text-[#e5ecee] hover:border-emerald-400 hover:text-emerald-300 disabled:cursor-wait disabled:opacity-60"
          >
            {loadingOlder
              ? "Loading older lines..."
              : `Load ${LOG_BATCH_SIZE} older lines`}
          </button>
        ) : (
          <span>Beginning of file</span>
        )}
        {olderError && (
          <p className="w-full text-rose-300" role="alert">
            {olderError}
          </p>
        )}
      </footer>
    </section>
  );
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("application");
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [olderError, setOlderError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await adminService.getLogs({
          limit: LOG_BATCH_SIZE,
          offset: 0,
        });
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

  const loadOlderLogs = async () => {
    const source = activeView === "errors" ? "error" : "all";
    const pagination = logs?.pagination?.[source];
    if (!pagination?.hasMore || loadingOlder) return;

    setLoadingOlder(true);
    setOlderError(null);
    try {
      const olderPage = await adminService.getLogs({
        limit: LOG_BATCH_SIZE,
        offset: pagination.nextOffset,
      });
      setLogs((currentLogs) => ({
        ...currentLogs,
        [source]: [...olderPage[source], ...currentLogs[source]],
        pagination: {
          ...currentLogs.pagination,
          [source]: olderPage.pagination[source],
        },
      }));
    } catch (err) {
      setOlderError("Failed to load older log lines.");
      console.error(err);
    } finally {
      setLoadingOlder(false);
    }
  };

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

  const entriesByView = {
    application: logs?.all ?? [],
    errors: logs?.error ?? [],
    orders: (logs?.all ?? []).filter(matchesOrderLog),
  };
  const selectedView = logViews.find((view) => view.id === activeView);
  const selectedEntries = entriesByView[activeView];
  const selectedSource = activeView === "errors" ? "error" : "all";
  const selectedPagination = logs?.pagination?.[selectedSource];

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
          Showing newest entries first; older lines load in batches of 100.
        </p>
      </header>
      <div
        className="border-b border-gray-300"
        role="tablist"
        aria-label="Log views"
      >
        {logViews.map((view) => (
          <button
            key={view.id}
            id={`log-tab-${view.id}`}
            type="button"
            role="tab"
            aria-selected={activeView === view.id}
            aria-controls="selected-log-view"
            onClick={() => setActiveView(view.id)}
            className={`-mb-px inline-flex min-h-12 items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors ${
              activeView === view.id
                ? view.activeClasses
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon
              name={view.icon}
              className={`h-4 w-4 ${view.iconColor}`}
              aria-hidden="true"
            />
            {view.id === "orders"
              ? "Order logs"
              : view.title.replace(" output", " logs")}
          </button>
        ))}
      </div>
      <div
        id="selected-log-view"
        role="tabpanel"
        aria-labelledby={`log-tab-${activeView}`}
        className="pt-4"
      >
        <TerminalLog
          title={selectedView.title}
          fileName={selectedView.fileName}
          icon={selectedView.icon}
          entries={selectedEntries}
          hasMore={selectedPagination?.hasMore}
          loadingOlder={loadingOlder}
          olderError={olderError}
          onLoadOlder={loadOlderLogs}
        />
      </div>
    </div>
  );
}
