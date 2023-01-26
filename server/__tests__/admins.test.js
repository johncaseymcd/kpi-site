/* eslint-disable no-undef */
const request = require("supertest");
const { app } = require("../index");
const req = request(app);

describe("POST /admins/new", () => {
  it("should create a new admin", async () => {
    const memberId = 1;
    const res = await req.post(`/admins/new/${memberId}`).send({
      memberId: memberId,
      role: "Lead",
      platform: "Website",
      section: "KPI",
    });

    expect(res.statusCode).toBe(201);
  });
});

describe("GET /admins/new/:memberId", () => {
  it("should return a 200 with a message", async () => {
    const memberId = 1;
    const res = await req.get(`/admins/new/${memberId}`);

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /admins/:page", () => {
  it("should return a list of all the admins", async () => {
    const res = await req.get("/admins/1");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /admins/:role/:page", () => {
  it("should return a list of admins with the given role", async () => {
    const role = "Lead";
    const res = await req.get(`/admins/${role}/1`);

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /admins/:platform/:page", () => {
  it("should return a list of admins on the given platform", async () => {
    const platform = "Website";
    const res = await req.get(`/admins/${platform}/1`);

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /admins/:section/:page", () => {
  it("should return a list of admins in the given section", async () => {
    const section = "KPI";
    const res = await req.get(`/admins/${section}/1`);

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /admins/id/:memberId", () => {
  it("should return a single admin by ID", async () => {
    const memberId = 1;
    const res = await req.get(`/admins/${memberId}`);

    expect(res.statusCode).toBe(200);
  });
});

describe("PUT /admins/delete/:memberId", () => {
  it("should set the is_deleted flag on the admin to true", async () => {
    const memberId = 1;
    const res = await req.put(`/admins/delete/${memberId}`);

    expect(res.statusCode).toBe(200);
  });
});

describe("PUT /admins/update/:memberId", () => {
  it("should update the info for the admin", async () => {
    const memberId = 1;
    const res = await req.put(`/admins/update/${memberId}`).send({
      memberId: 1,
      role: "Admin",
      platform: "Website",
      section: "KPI",
    });

    expect(res.statusCode).toBe(200);
  });
});
