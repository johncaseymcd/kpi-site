/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../routes/sponsorContacts");
const req = request(app);

describe("POST /contacts/sponsor/new", () => {
  it("should create a new sponsor contact", async () => {
    const res = await req.post("/contacts/sponsor/new").send({
      sponsorId: 1,
      firstName: "Jacob",
      lastName: "Tester",
      email: "jacobtester@email.com",
      phoneNumber: "317-555-9876",
    });

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async () => {
    const res = await req.post("/contacts/sponsor/new").send({});

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /contacts/sponsor/new", () => {
  it("should return 200 with a message", async () => {
    const res = await req.get("/contacts/sponsors/new");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /contacts/sponsor/:page", () => {
  it("should return a paginated list of all sponsor contacts", async () => {
    const res = await req.get("/contacts/sponsor/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/contacts/sponsor/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/contacts/sponsor/notAnId");

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /contacts/sponsor/id/:contactId", () => {
  it("should return a single sponsor contact with the given ID", async () => {
    const res = await req.get("/contacts/sponsor/id/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/contacts/sponsor/id/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/contacts/sponsor/id/notAnId");

    expect(res.statusCode).toBe(500);
  });
});

describe("PUT /contacts/sponsor/update/:contactId", () => {
  it("should update the info for the sponsor contact", async () => {
    const res = await req.put("/contacts/sponsor/update/1").send({
      sponsorId: 2,
      firstName: "Tester",
      lastName: "Jacob",
      email: "testerjacob@email.com",
      phoneNumber: "317-555-6789",
    });

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async () => {
    const res = await req.put("/contacts/sponsor/update/2").send({});

    expect(res.statusCode).toBe(500);
  });
});

describe("PUT /contacts/sponsor/delete/:contactId", () => {
  it("should set the is_deleted flag on the sponsor contact to true", async () => {
    const res = await req.put("/contacts/sponsor/delete/2");

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async () => {
    const res = await req.put("/contacts/sponsor/delete/notAnId");

    expect(res.statusCode).toBe(500);
  });
});
