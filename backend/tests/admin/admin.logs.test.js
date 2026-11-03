import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("fs/promises", () => ({
  default: { readFile: vi.fn() },
}));

import fs from "fs/promises";
import { fetchSystemLogs } from "../../src/modules/admin/admin.model.js";

describe("admin log pagination", () => {
  const allLines = Array.from({ length: 250 }, (_, index) => `all-${index + 1}`);
  const errorLines = Array.from(
    { length: 225 },
    (_, index) => `error-${index + 1}`
  );

  beforeEach(() => {
    fs.readFile.mockImplementation(async (filePath) =>
      String(filePath).endsWith("all.log")
        ? `${allLines.join("\n")}\n`
        : `${errorLines.join("\n")}\n`
    );
  });

  it("returns newest batches first and pages through every line without gaps", async () => {
    const latest = await fetchSystemLogs({ limit: 100, offset: 0 });
    const middle = await fetchSystemLogs({ limit: 100, offset: 100 });
    const oldest = await fetchSystemLogs({ limit: 100, offset: 200 });

    expect(latest.all).toEqual(allLines.slice(150));
    expect(middle.all).toEqual(allLines.slice(50, 150));
    expect(oldest.all).toEqual(allLines.slice(0, 50));
    expect([...oldest.all, ...middle.all, ...latest.all]).toEqual(allLines);

    expect(latest.pagination.all).toMatchObject({
      total: 250,
      returned: 100,
      hasMore: true,
      nextOffset: 100,
    });
    expect(oldest.pagination.all).toMatchObject({
      returned: 50,
      hasMore: false,
      nextOffset: 250,
    });
  });

  it("keeps independent pagination metadata for the error log", async () => {
    const latest = await fetchSystemLogs({ limit: 100, offset: 0 });

    expect(latest.error).toEqual(errorLines.slice(125));
    expect(latest.pagination.error).toMatchObject({
      total: 225,
      returned: 100,
      hasMore: true,
      nextOffset: 100,
    });
  });
});