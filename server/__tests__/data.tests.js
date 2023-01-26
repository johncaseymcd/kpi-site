/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../routes/data");
const req = request(app);

describe("POST /data/events/:eventId/admins/:adminId", () => {
  it("should join the admin to the event", async () => {
    const res = await req.post("/data/events/1/admins/1");

    expect(res.statusCode).toBe(201);
  });
});

describe("DELETE /data/events/:eventId/admins/:adminId", () => {
  it("should remove the admin from the event", async () => {
    const res = await req.delete("/data/events/1/admins/1");

    expect(res.statusCode).toBe(200);
  });
});

describe("POST /data/events/:eventId/sponsors/:sponsorId", () => {
  it("should add the sponsor to the event", async () => {
    const res = await req.post("/data/events/1/sponsors/1");

    expect(res.statusCode).toBe(201);
  });
});

describe("DELETE /data/events/:eventId/sponsors/:sponsorId", () => {
  it("should remove the sponsor from the event", async () => {
    const res = await req.delete("/data/events/1/sponsors/1");

    expect(res.statusCode).toBe(200);
  });
});

describe("POST /data/members/:memberId/contacts/:contactId", () => {
  it("should add an emergency contact to a member", async () => {
    const res = await req.post("/data/members/1/contacts/1");

    expect(res.statusCode).toBe(201);
  });
});

describe("DELETE /data/members/:memberId/contacts/:contactId", () => {
  it("should remove the emergency contact from the member", async () => {
    const res = await req.delete("/data/members/1/contacts/1");

    expect(res.statusCode).toBe(200);
  });
});

describe("POST /data/events/:eventId/expenses/:expenseId", () => {
  it("should add an expense to an event", async () => {
    const res = await req.post("/data/events/1/expenses/1");

    expect(res.statusCode).toBe(201);
  });
});

describe("POST /data/rsvps/:rsvpId/members/:memberId", () => {
  it("should add a member to an RSVP", async () => {
    const res = await req.post("/data/rsvps/1/members/1");

    expect(res.statusCode).toBe(201);
  });
});

describe("DELETE /data/rsvps/:rsvpId/members/:memberI", () => {
  it("should remove a member from an RSVP", async () => {
    const res = await req.delete("/data/rsvps/1/members/1");

    expect(res.statusCode).toBe(200);
  });
});
