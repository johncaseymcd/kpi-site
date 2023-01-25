/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../routes/locations");
const req = request(app);

describe("POST /locations/new", () => {
  it("should add a new location", async () => {
    const res = await req.post("/locations/new").send({
      name: "Mama Korean BBQ",
      streetAddress: "8867 Pendleton Pike",
      unitNumber: null,
      city: "Indianapolis",
      state: "Indiana",
      zip: 46226,
      locationType: "Restaurant",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("post");
  });
});

describe("GET /locations/new", () => {
  it("should return a 200 with a message", async () => {
    const res = await req.get("/locations/new");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /locations/:page", () => {
  it("should return a paginated list of all locations", async () => {
    const res = await req.get("/locations/1");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /locations/:type/:page", () => {
  it("should return a list of locations with the given type", async () => {
    const type = "Restaurant";
    const res = await req.get(`/locations/${type}/1`);

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /:city/:page", () => {
  it("should return a list of locations in the given city", async () => {
    const city = "Indianapolis";
    const res = await req.get(`/locations/${city}/1`);

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /locations/:locationId", () => {
  it("should return a single location by ID", async () => {
    const res = await req.get("/locations/1");

    expect(res.statusCode).toBe(200);
  });
});

describe("PUT /locations/update/:locationId", () => {
  it("should update the location info", async () => {
    const res = await req.put("/locations/update/1").send({
      name: "Ma Ma Korean BBQ",
      streetAddress: "8867 Pendleton Pike",
      unitNumber: null,
      city: "Indianapolis",
      state: "Indiana",
      zip: 46226,
      locationType: "Restaurant",
    });

    expect(res.statusCode).toBe(200);
  });
});

describe("PUT /locations/delete/:locationId", () => {
  it("should set the is_deleted flag on the location to true", async () => {
    const res = await req.put("/locations/delete/1");

    expect(res.statusCode).toBe(200);
  });
});
