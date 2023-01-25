/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../routes/expenses");
const req = request(app);

describe("POST /expenses/new", () => {
  it("should create a new expense", async() => {
    const res = await req.post("/expenses/new").send({
      name: "Website Renewal",
      cost: 250,
      expenseType: "Business Maintenance",
      isPaid: true,
      incurredDate: new Date(2023, 0, 25),
      dueDate: new Date(2023, 1, 1),
      isTaxDeductible: true
    });

    expect(res.statusCode).toBe(201);
  });

  it("should return an error", async() => {
    const res = await req.post("/expenses/new").send({});

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /expenses/new", () => {
  it("shoulde return a 200 with a message", async() => {
    const res = await req.get("/expenses/new");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /expenses/:page", () => {
  it("should return a paginated list of all expenses", async() => {
    const res = await req.get("/expenses/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async() => {
    const res = await req.get("/expenses/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async() => {
    const res = await req.get("/expenses/notAPage");

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /expenses/:type/:page", () => {
  it("should return a paginated list of expenses with the given type", async() => {
    const type = encodeURI("Business Maintenance");
    const res = await req.get(`/expenses/${type}/1`);

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async() => {
    const type = encodeURI("This is not a type");
    const res = await req.get(`/expenses/${type}/1`);

    expect(res.statusCode).toBe(204);
  });

  it("should return no results", async() => {
    const type = encodeURI("Business Maintenance");
    const res = await req.get(`/expenses/${type}/99999`);

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async() => {
    const type = encodeURI("Business Maintenance");
    const res = await req.get(`/expenses/${type}/0`);

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /expenses/:paid/:page", () => {
  it("should return a paginated list of all expenses matching the given status", async() => {
    const status = true;
    const res = await req.get(`/expenses/${status}/1`);

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async() => {
    const status = true;
    const res = await req.get(`/expenses/${status}/99999`);

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async() => {
    const status = "this is true";
    const res = await req.get(`/expenses/${status}/1`);

    expect(res.statusCode).toBe(500);
  });
});

