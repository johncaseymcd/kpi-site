/* eslint-disable no-undef */
const request = require("supertest");
const { app } = require("../index");
const req = request(app);

describe("POST /members/new", () => {
  it("should create a new member", async () => {
    const res = await req
      .post("/members/new")
      .send({
        firstName: "Nicholas",
        middleName: "Patrick",
        lastName: "Sullivan",
        nickname: "Nick",
        email: "npsullivan26@gmail.com",
        phoneNumber: "442-800-3999",
        streetAddress: "2025 US Hwy 18",
        unitNumber: "Ste 430-147",
        city: "Apple Valley",
        state: "California",
        zip: 92307,
        foundMethod: "Business Card",
        pronouns: "He/Him, They/Them",
        neopronouns: null,
        birthday: new Date(1994, 1, 6),
        twitterHandle: "@6tonguppy",
        instagramHandle: "@6tonguppy",
        dietaryRestrictions: "none",
        hasAttendedEvent: true,
        isAdmin: true,
        isOnMailingList: true,
        isOver18: true,
        isOver21: true,
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("post");
  });
});

describe("GET /members/new", () => {
  it("should return a 200 with a message", async() => {
    const res = await req.get("/members/new");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /members/all/:page", () => {
  it("should return a list of members", async() => {
    const res = await req.get("/members/all/1");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /members/:city/:page", () => {
  it("should return a list of members in the given city", async() => {
    const city = "Indianapolis";
    const res = await req.get(`/members/${city}/1`);

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /members/:zip/:page", () => {
  it("should return a list of members in the given zip code", async() => {
    const zip = 46202;
    const res = await req.get(`/members/${zip}/1`);

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /members/:foundMethod/:page", () => {
  it("should return a list of members who found KPI in the same way", async() => {
    const foundMethod = encodeURI("Business Card");
    const res = await req.get(`/members/${foundMethod}/1`);

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /members/birthday/:page", () => {
  it("should return a list of members whose birthdays occur this week", async() => {
    const res = await req.get("/members/birthday/page");

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).toBe(204);
  });
});

describe("GET /members/events/:status/:page", () => {
  it("should return a list of members who have (or have not) attended an event", async() => {
    const status = true;
    const res = await req.get(`/members/events/${status}/1`);

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /members/mailto/:page", () => {
  it("should return a list of members who are on the mailing list", async() => {
    const res = await req.get("/members/mailto/1");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /members/over18/:page", () => {
  it("should return a list of members who are over 18 years old", async() => {
    const res = await req.get("/members/over18/1");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /members/over21/:page", () => {
  it("should return a list of members who are over 21 years old", async() => {
    const res = await req.get("/members/over21/1");

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /members/:memberId", () => {
  it("should return a single member by their ID", async() => {
    const memberId = 1;
    const res = await req.get(`/members/${memberId}`);

    expect(res.statusCode).toBe(204);
  });
});

describe("PUT /members/delete/:memberId", () => {
  it("should set the is_deleted flag on the member to TRUE", async() => {
    const memberId = 1;
    const res = await req.put(`/members/delete/${memberId}`);

    expect(res.statusCode).toBe(500);
  });
});

describe("PUT /members/update/:memberId", () => {
  it("should update the info for the member with the given ID", async() => {
    const memberId = 1;
    const res = await req.put(`/members/update/${memberId}`);

    expect(res.statusCode).toBe(500);
  });
});