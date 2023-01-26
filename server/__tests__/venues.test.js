/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../routes/venues");
const req = request(app);

describe("POST /venues/new", () => {
  it("should create a new venue", async() => {
    const res = await req.post("/venues/new").send({
      locationId: 1,
      name: "Broad Ripple Park",
      contact: "John Doe",
      cost: 250,
      costType: "Flat Rate"
    });

    expect(res.statusCode).toBe(201);
  });

  it("should return an error", async() => {
    const res = await req.post("/venues/new").send({});

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /venues/new", () => {
  it("should return 200 with a message", async() => {
    const res = await req.get("/venues/new");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /venues/:page", () => {
  it("should return a paginated list of all venues", async() => {
    const res = await req.get("/venues/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async() => {
    const res = await req.get("/venues/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async() => {
    const res = await req.get("/venues/0");

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /venues/:type/:page", () => {
  it("should return a list of venues with the given cost type", async() => {
    const type = encodeURI("Flat Rate");
    const res = await req.get(`/venues/${type}/1`);

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async() => {
    const type = "thisIsNotAType";
    const res = await req.get(`/venues/${type}/1`);

    expect(res.statusCode).toBe(204);
  });

  it("should return no results", async() => {
    const type = encodeURI("Flat Rate");
    const res = await req.get(`/venues/${type}/99999`);

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async() => {
    const type = encodeURI("Flat Rate");
    const res = await req.get(`/venues/${type}/0`);

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /id/:venueId", () => {
  it("should return a single venue by ID", async() => {
    const res = await req.get("/venues/id/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async() => {
    const res = await req.get("/venues/id/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async() => {
    const res = await req.get("/venues/id/badId");

    expect(res.statusCode).toBe(500);
  });
});

describe("PUT /venues/update/:venueId", () => {
  it("should update the venue info", async() => {
    const res = await req.put("/venues/update/1").send({
      locationId: 1,
      name: "Broad Ripple Park",
      contact: "John Doe",
      cost: 20,
      costType: "Hourly"
    });

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async() => {
    const res = await req.put("/venues/update/1").send({
      locationId: "notAnId",
      name: "Broad Ripple Park",
      contact: "John Doe",
      cost: "$20",
      costType: "Hourly"
    });

    expect(res.statusCode).toBe(500);
  });
});

describe("PUT /venues/delete/:venueId", () => {
  it("should set the is_deleted flag on the venue to true", async() => {
    const res = await req.put("/venues/delete/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async() => {
    const res = await req.put("/venues/delete/badId");

    expect(res.statusCode).toBe(500);
  });
});

