/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../routes/venueContacts");
const req = request(app);

describe("POST /contacts/venue/new", () => {
  it("should create a new venue contact", async () => {
    const res = await req.post("/contacts/venue/new").send({
      venueId: 1,
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@email.com",
      phoneNumber: "317-555-1234",
    });

    expect(res.statusCode).toBe(201);
  });

  it("should return an error", async () => {
    const res = await req.post("/contacts/venue/new").send({});

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /contacts/venue/new", () => {
  it("should return a 200 with a message", async () => {
    const res = await req.get("/contacts/venue/new");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /contacts/venue/:page", () => {
  it("should return a paginated list of all venue contacts", async () => {
    const res = await req.get("/contacts/venue/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/contacts/venue/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/contacts/venue/0");

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /contacts/venue/id/:contactId", () => {
  it("should return a single venue contact with the given ID", async () => {
    const res = await req.get("/contacts/venue/id/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/contacts/venue/id/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/contacts/venue/id/notAnId");

    expect(res.statusCode).toBe(500);
  });
});

describe("PUT /contacts/venue/update/:contactId", () => {
  it("should update the venue contact info", async () => {
    const res = await req.put("/contacts/venue/update/1").send({
      venueId: 2,
      firstName: "Rebecca",
      lastName: "Johnson",
      email: "tigerboobs@losangeles.gov",
      phoneNumber: "317-555-6969",
    });

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async () => {
    const res = await req.put("/contacts/venue/update/2").send({});

    expect(res.statusCode).toBe(500);
  });
});
