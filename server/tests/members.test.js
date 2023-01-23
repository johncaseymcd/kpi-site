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
