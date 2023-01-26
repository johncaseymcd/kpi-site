/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../routes/events");
const req = request(app);

describe("POST /events/new", () => {
  it("should create a new event", async () => {
    const res = await req.post("/events/new").send({
      name: "Testing Event",
      venueId: 1,
      description: "This is a test.",
      eventDate: new Date(2023, 1, 6),
      price: 10,
      expectedGuests: 25,
      suggestedPrice: 5,
    });

    expect(res.statusCode).toBe(201);
  });

  it("should return an error", async () => {
    const res = await req.post("/events/new").send({});

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /events/new", () => {
  it("should return a 200 with a message", async () => {
    const res = await req.get("/events/new");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /events/:page", () => {
  it("should return a paginated list of all events", async () => {
    const res = await req.get("/events/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/events/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/events/0");

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /events/venue/:venueId/:page", () => {
  it("should return a list of events that have taken place at the given venue", async () => {
    const res = await req.get("/events/venue/1/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/events/venue/99999/1");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/events/venue/notAnId/1");

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /events/id/:eventId", () => {
  it("should return a single event by its ID", async () => {
    const res = await req.get("/events/id/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/events/id/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/events/id/notAnId");

    expect(res.statusCode).toBe(500);
  });
});

describe("PUT /events/update/:eventId", () => {
  it("should update the event info", async () => {
    const res = await req.put("/events/update/1").send({
      name: "Birthday",
      venueId: 2,
      description: "Happy Birthday!",
      eventDate: new Date(2023, 1, 6),
      price: 0,
      expectedGuests: 15,
      actualProfit: 100,
      turnoutPercentage: 85,
    });

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async () => {
    const res = await req.put("/events/update/1").send({});

    expect(res.statusCode).toBe(500);
  });
});
