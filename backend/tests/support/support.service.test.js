import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/support/support.model.js", () => ({
  create: vi.fn(),
  createReply: vi.fn(),
  findById: vi.fn(),
  findByIdAndUserId: vi.fn(),
  findRepliesByTicketId: vi.fn(),
  findTicketAuthor: vi.fn(),
  update: vi.fn(),
}));

import * as supportModel from "../../src/modules/support/support.model.js";
import {
  addTicketReply,
  getTicketById,
  submitTicket,
  updateTicketStatus,
} from "../../src/modules/support/support.service.js";

describe("support service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a support ticket for the current user", async () => {
    const ticket = { id: 12, user_id: 7, subject: "Help", message: "Question" };
    supportModel.create.mockResolvedValue(ticket);

    await expect(submitTicket(7, "Help", "Question")).resolves.toEqual(ticket);
    expect(supportModel.create).toHaveBeenCalledWith({
      user_id: 7,
      subject: "Help",
      message: "Question",
      status: "open",
    });
  });

  it("does not expose another user's ticket", async () => {
    supportModel.findByIdAndUserId.mockResolvedValue(undefined);

    await expect(
      getTicketById(12, { id: 8, role: "customer" })
    ).rejects.toMatchObject({ statusCode: 404 });
    expect(supportModel.findByIdAndUserId).toHaveBeenCalledWith(12, 8);
    expect(supportModel.findRepliesByTicketId).not.toHaveBeenCalled();
  });

  it("lets staff view a ticket without using customer ownership lookup", async () => {
    const ticket = {
      id: 12,
      user_id: 7,
      message: "Question",
      created_at: new Date(),
    };
    supportModel.findById.mockResolvedValue(ticket);
    supportModel.findRepliesByTicketId.mockResolvedValue([]);
    supportModel.findTicketAuthor.mockResolvedValue({
      author_name: "Customer",
      author_role: "customer",
    });

    const result = await getTicketById(12, { id: 2, role: "staff" });

    expect(result.ticket).toEqual(ticket);
    expect(result.replies).toHaveLength(1);
    expect(supportModel.findByIdAndUserId).not.toHaveBeenCalled();
  });

  it("allows customers to close their own ticket but not reopen it", async () => {
    supportModel.findById.mockResolvedValue({ id: 12, user_id: 7 });
    supportModel.update.mockResolvedValue([
      { id: 12, user_id: 7, status: "closed" },
    ]);

    await expect(
      updateTicketStatus(12, { id: 7, role: "customer" }, "closed")
    ).resolves.toMatchObject({ status: "closed" });
    await expect(
      updateTicketStatus(12, { id: 7, role: "customer" }, "open")
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("reopens a closed ticket when its owner replies", async () => {
    supportModel.findByIdAndUserId.mockResolvedValue({
      id: 12,
      user_id: 7,
      status: "closed",
    });
    supportModel.createReply.mockResolvedValue({ id: 19, ticket_id: 12 });

    await expect(
      addTicketReply(12, { id: 7, role: "customer" }, "More details")
    ).resolves.toEqual({ id: 19, ticket_id: 12 });
    expect(supportModel.update).toHaveBeenCalledWith(12, { status: "open" });
  });
});
