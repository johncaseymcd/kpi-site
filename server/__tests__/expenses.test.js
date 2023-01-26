/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../routes/expenses");
const req = request(app);

describe("POST /expenses/new", () => {
  it("should create a new expense", async () => {
    const res = await req.post("/expenses/new").send({
      name: "Website Renewal",
      cost: 250,
      expenseType: "Business Maintenance",
      isPaid: false,
      incurredDate: new Date(2023, 0, 25),
      dueDate: new Date(2023, 1, 1),
      isTaxDeductible: true,
    });

    expect(res.statusCode).toBe(201);
  });

  it("should return an error", async () => {
    const res = await req.post("/expenses/new").send({});

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /expenses/new", () => {
  it("shoulde return a 200 with a message", async () => {
    const res = await req.get("/expenses/new");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /expenses/:page", () => {
  it("should return a paginated list of all expenses", async () => {
    const res = await req.get("/expenses/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/expenses/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/expenses/notAPage");

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /expenses/:type/:page", () => {
  it("should return a paginated list of expenses with the given type", async () => {
    const type = encodeURI("Business Maintenance");
    const res = await req.get(`/expenses/${type}/1`);

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const type = encodeURI("This is not a type");
    const res = await req.get(`/expenses/${type}/1`);

    expect(res.statusCode).toBe(204);
  });

  it("should return no results", async () => {
    const type = encodeURI("Business Maintenance");
    const res = await req.get(`/expenses/${type}/99999`);

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const type = encodeURI("Business Maintenance");
    const res = await req.get(`/expenses/${type}/0`);

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /expenses/:paid/:page", () => {
  it("should return a paginated list of all expenses matching the given status", async () => {
    const status = false;
    const res = await req.get(`/expenses/${status}/1`);

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const status = false;
    const res = await req.get(`/expenses/${status}/99999`);

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const status = "this is false";
    const res = await req.get(`/expenses/${status}/1`);

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /expenses/:year/:page", () => {
  it("should return a paginated list of expenses incurred within the given year", async () => {
    const res = await req.get("/expenses/2023/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/expenses/99999/1");

    expect(res.statusCode).toBe(204);
  });

  it("should return no results", async () => {
    const res = await req.get("/expenses/2023/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/expenses/2023/0");

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /expenses/:year/:month/:page", () => {
  it("should return a list of expenses incurred in the given month and year", async () => {
    const res = await req.get("/expenses/2023/1/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/expenses/2023/2/1");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/expenses/2023/1/0");

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /expenses/due/:interval/:page", () => {
  it("should return a list of expenses with due dates that are within the given interval from the current date", async () => {
    const res = await req.get("/expenses/due/14/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/expenses/due/1/1");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/expenses/due/notANumber/1");

    expect(res.statusCode).toBe(500);
  });
});

describe("GET /expenses/past-due/:page", () => {
  it("should return a list of past-due expenses", async () => {
    const res = await req.get("/expenses/past-due/1");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /expenses/id/:expenseId", () => {
  it("should return a single expense with the given ID", async () => {
    const res = await req.get("/expenses/id/1");

    expect(res.statusCode).toBe(200);
  });

  it("should return no results", async () => {
    const res = await req.get("/expenses/id/99999");

    expect(res.statusCode).toBe(204);
  });

  it("should return an error", async () => {
    const res = await req.get("/expenses/id/notAnId");

    expect(res.statusCode).toBe(500);
  });
});

describe("PUT /expenses/update/:expenseId", () => {
  it("should update the is_paid status of the expense", async () => {
    const res = await req.put("/expenses/update/1").send({
      isPaid: true,
    });

    expect(res.statusCode).toBe(200);
  });

  it("should return an error", async () => {
    const res = await req.put("/expenses/update/1").send({});

    expect(res.statusCode).toBe(500);
  });
});
