/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../routes/emergencyContacts");
const req = request(app);

describe("POST /contacts/emergency/new", () => {
  it("should create a new emergency contact", async () => {
    const res = await req.post("/contacts/emergency/new").send({
      firstName: "John",
      lastName: "Emergency",
      email: "johnemergency@email.com",
      phoneNumber: "317-555-1597",
    });

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async () => {
    const res = await req.post("/contacts/emergency/new").send({});

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /contacts/emergency/new", () => {
  it("should return a 200 with a message", async () => {
    const res = await req.get("/contacts/emergency/new");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /contacts/emergency/:page", () => {
  it("should return a paginated list of all emergency contacts", async () => {
    const res = await req.get("/contacts/emergency/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/contacts/emergency/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/contacts/emergency/notAPage");

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /contacts/emergency/id/:contactId", () => {
  it("should return a single emergency contact with the given ID", async () => {
    const res = await req.get("/contacts/emergency/id/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/contacts/emergency/id/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/contacts/emergency/id/notAnId");

    expect(res.statusCode).toBe(500);
  });
});

describe("PUT /contacts/emergency/update/:contactId", () => {
  it("should update the emergency contact info", async () => {
    const res = await req.put("/contacts/emergency/update/1").send({
      firstName: "Randall",
      lastName: "Blythe",
      email: "hedeservedit@email.com",
      phoneNumber: "317-555-4916",
    });

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async () => {
    const res = await req.put("/contacts/emergency/update/2").send({});

    expect(res.statusCode).toBe(500);
  });
});

describe("PUT /contacts/emergency/delete/:contactId", () => {
  it("should set the is_deleted flag on the emergency contact to true", async () => {
    const res = await req.put("/contacts/emergency/delete/2");

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async () => {
    const res = await req.put("/contacts/emergency/delete/notAnId");

    expect(res.statusCode).toBe(500);
  });
});
