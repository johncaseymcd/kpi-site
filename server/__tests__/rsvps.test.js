/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../routes/rsvps");
const req = request(app);

describe("POST /rsvp/event/:eventId/new", () => {
  it("should create a new rsvp for the event", async () => {
    const res = await req.post("/rsvp/event/1/new").send({
      eventId: 1,
      response: "Yes",
      memberCount: 1,
      memberNames: "Nick Sullivan",
    });

    expect(res.statusCode).toBe(201);
  });

  it("should return an error", async () => {
    const res = await req.post("/rsvp/event/1/new").send({});

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /rsvp/event/:eventId/new", () => {
  it("should return a 200 with a message", async () => {
    const res = await req.get("/rsvp/event/1/new");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /rsvp/event/:eventId/:page", () => {
  it("should return a list of RSVPS for the selected event", async () => {
    const res = await req.get("/rsvp/event/1/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/rsvp/event/99999/1");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/rsvp/event/notAnId/1");

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /rsvp/id/:rsvpId", () => {
  it("should return a single RSVP with the given ID", async () => {
    const res = await req.get("/rsvp/id/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/rsvp/id/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/rsvp/id/notAnId");

    expect(res.statusCode).toBe(500);
  });
});

describe("PUT /rsvp/update/:rsvpId", () => {
  it("should update the RSVP info", async () => {
    const res = await req.put("/rsvp/update/1").send({
      response: "Maybe",
      memberCount: 1,
      memberNames: "Nick Sullivan",
      contactId: 1,
    });

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async () => {
    const res = await req.put("/rsvp/id/1").send({});

    expect(res.statusCode).toBe(500);
  });
});
