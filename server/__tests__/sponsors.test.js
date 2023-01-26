/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../routes/sponsors");
const req = request(app);

describe("POST /sponsors/new", () => {
  it("should create a new sponsor", async () => {
    const res = await req.post("/sponsors/new").send({
      name: "Kung Fu Tea",
      sponsorType: "Food & Drink",
      contact: "Jane Doe",
    });

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async () => {
    const res = await req.post("/sponsors/new").send({});

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /sponsors/new", () => {
  it("should return a 200 with a message", async () => {
    const res = await req.get("/sponsors/new");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /sponsors/:page", () => {
  it("should return a paginated list of all sponsors", async () => {
    const res = await req.get("/sponsors/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/sponsors/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/sponsors/0");

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /sponsors/:type/:page", () => {
  it("should return a list of sponsors with the given type", async () => {
    const type = encodeURI("Food & Drink");
    const res = await req.get(`/sponsors/${type}/1`);

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const type = encodeURI("Not a real type");
    const res = await req.get(`/sponsors/${type}/1`);

    expect(res.statusCode).toBe(204);
  });

  it("should return no results", async () => {
    const type = encodeURI("Food & Drink");
    const res = await req.get(`/sponsors/${type}/99999`);

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const type = encodeURI("Food & Drink");
    const res = await req.get(`/sponsors/${type}/0`);

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /id/:sponsorId", () => {
  it("should return a sponsor by its ID", async () => {
    const res = await req.get("/sponsors/id/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/sponsors/id/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/sponsors/id/notAnId");

    expect(res.statusCode).toBe(500);
  });
});

describe("PUT /sponsors/update/:sponsorId", () => {
  it("should update the sponsor information", async () => {
    const res = await req.put("/sponsors/update/1").send({
      name: "Kung Fu Tea Plainfield",
      sponsorType: "Food & Drink",
      contact: "Jane Doe",
    });

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async () => {
    const res = await req.put("/sponsors/update/1").send({});

    expect(res.statusCode).toBe(500);
  });
});

describe("PUT /sponsors/delete/:sponsorId", () => {
  it("should set the is_deleted flag on the sponsor to true", async () => {
    const res = await req.put("/sponsors/delete/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async () => {
    const res = await req.put("/sponsors/delete/notAnId");

    expect(res.statusCode).toBe(500);
  });
});
